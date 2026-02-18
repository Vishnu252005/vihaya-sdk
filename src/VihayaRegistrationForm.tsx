"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { VihayaClient, VihayaEvent, RegisterData, VihayaError, SpecialPrice, PromoCode } from './index';

export interface VihayaRegistrationFormProps {
    /** The VihayaClient instance. */
    client: VihayaClient;
    /** The ID of the event to register for. */
    eventId: string;
    /** Optional: Pre-fetched event data. */
    event?: VihayaEvent;
    /** Callback on successful registration. */
    onSuccess?: (registrationId: string) => void;
    /** Callback on error. */
    onError?: (error: string) => void;
    /** Theme color for buttons and accents. */
    themeColor?: string;
    /** Whether to show only custom fields (hides Name, Email, Phone). */
    showOnlyCustomFields?: boolean;
    /** Initial data to pre-fill the form (useful if fields are hidden). */
    initialData?: Partial<RegisterData>;
}

export const VihayaRegistrationForm: React.FC<VihayaRegistrationFormProps> = ({
    client,
    eventId,
    event: initialEvent,
    onSuccess,
    onError,
    themeColor = '#0CF2A0',
    showOnlyCustomFields = false,
    initialData = {}
}) => {
    const [event, setEvent] = useState<VihayaEvent | undefined>(initialEvent);
    const [loading, setLoading] = useState(!initialEvent);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [selectedPriceName, setSelectedPriceName] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<RegisterData>>({
        name: '',
        email: '',
        phone: '',
        teamName: '',
        teamMembers: [],
        customFields: {},
        preferences: {},
        ...initialData
    });

    useEffect(() => {
        if (!event && eventId) {
            client.events.get(eventId)
                .then(setEvent)
                .catch(err => {
                    const msg = err.message || 'Failed to load event';
                    setError(msg);
                    if (onError) onError(msg);
                })
                .finally(() => setLoading(false));
        }
    }, [eventId, event, client]);

    // Derived States
    const activePricing = useMemo(() => {
        if (!event) return null;
        if (selectedPriceName && event.specialPrices) {
            return event.specialPrices.find(p => p.name === selectedPriceName) || null;
        }
        return null;
    }, [selectedPriceName, event]);

    const baseAmount = useMemo(() => {
        if (!event) return 0;
        return activePricing ? activePricing.amount : (event.price || 0);
    }, [activePricing, event]);

    const discountAmount = useMemo(() => {
        if (!appliedPromo) return 0;
        if (appliedPromo.type === 'percentage') {
            return (baseAmount * appliedPromo.value) / 100;
        }
        return appliedPromo.value;
    }, [appliedPromo, baseAmount]);

    const subtotal = Math.max(0, baseAmount - discountAmount);

    const platformFeeAmount = useMemo(() => {
        if (!event || !event.hasPlatformFee || !event.passPlatformFeeToUser) return 0;
        if (event.platformFeeType === 'percentage') {
            return (subtotal * (event.platformFee || 0)) / 100;
        }
        return event.platformFee || 0;
    }, [event, subtotal]);

    const totalAmount = subtotal + platformFeeAmount;

    const handleApplyPromo = () => {
        if (!event || !promoCode) return;
        const code = event.promoCodes?.find(c => c.code.toUpperCase() === promoCode.toUpperCase() && c.isActive);
        if (code) {
            setAppliedPromo(code);
            setError(null);
        } else {
            setError("Invalid or inactive promo code.");
            setAppliedPromo(null);
        }
    };

    const handleAddTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...(prev.teamMembers || []), { name: '', email: '', phone: '' }]
        }));
    };

    const handleUpdateTeamMember = (index: number, field: string, value: string) => {
        const members = [...(formData.teamMembers || [])];
        members[index] = { ...members[index], [field]: value };
        setFormData(prev => ({ ...prev, teamMembers: members }));
    };

    const handleRemoveTeamMember = (index: number) => {
        const members = [...(formData.teamMembers || [])];
        members.splice(index, 1);
        setFormData(prev => ({ ...prev, teamMembers: members }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const data: RegisterData = {
                ...formData,
                name: formData.name || '',
                email: formData.email || '',
                phone: formData.phone || '',
                specialPrice: selectedPriceName || undefined,
                promoCode: appliedPromo?.code || undefined,
                source: 'api-sdk'
            } as RegisterData;

            const result = await client.events.register(eventId, data);

            if (result.orderId) {
                if (!(window as any).Razorpay) {
                    throw new Error('Razorpay SDK not loaded. Please include <script src="https://checkout.razorpay.com/v1/checkout.js"></script>');
                }

                const options = {
                    key: result.key,
                    amount: result.amount,
                    currency: result.currency,
                    name: 'Vihaya Events',
                    description: `Registration for ${event!.title}`,
                    order_id: result.orderId,
                    handler: async (response: any) => {
                        try {
                            await client.events.register(eventId, {
                                ...data,
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                registrationId: result.registrationId
                            });
                            if (onSuccess) onSuccess(result.registrationId);
                        } catch (confirmErr: any) {
                            setError(confirmErr.message);
                            if (onError) onError(confirmErr.message);
                        }
                    },
                    prefill: {
                        name: data.name,
                        email: data.email,
                        contact: data.phone
                    },
                    theme: { color: themeColor }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } else {
                if (onSuccess) onSuccess(result.registrationId);
            }
        } catch (err: any) {
            setError(err.message);
            if (onError) onError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ color: '#9ca3af', padding: '40px', textAlign: 'center' }}>Loading event details...</div>;
    if (error && !event) return <div style={{ color: '#ef4444', padding: '24px', textAlign: 'center', backgroundColor: '#1f2937', borderRadius: '12px' }}>{error}</div>;
    if (!event) return null;

    const inputStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #374151',
        backgroundColor: '#030712',
        color: 'white',
        width: '100%',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#9ca3af',
        marginBottom: '6px',
        display: 'block'
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                padding: '32px',
                backgroundColor: '#09090b',
                color: '#f9fafb',
                borderRadius: '24px',
                border: '1px solid #18181b',
                fontFamily: 'Inter, system-ui, sans-serif',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0', letterSpacing: '-0.025em' }}>{event.title}</h2>
                <p style={{ color: '#71717a', fontSize: '0.875rem', marginTop: '8px' }}>Complete your registration below</p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {!showOnlyCustomFields && (
                    <>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                required
                                style={inputStyle}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    required
                                    type="email"
                                    style={inputStyle}
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    style={inputStyle}
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Team Event logic */}
                {event.isTeamEvent && (
                    <div style={{ padding: '20px', backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a' }}>
                        <label style={labelStyle}>Team Name</label>
                        <input
                            required
                            style={inputStyle}
                            placeholder="Avengers"
                            value={formData.teamName}
                            onChange={e => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                        />
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={labelStyle}>Team Members</label>
                                <button type="button" onClick={handleAddTeamMember} style={{ color: themeColor, fontSize: '12px', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>+ ADD MEMBER</button>
                            </div>
                            {formData.teamMembers?.map((member, idx) => (
                                <div key={idx} style={{ padding: '12px', backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid #27272a', marginTop: '8px', display: 'grid', gap: '10px' }}>
                                    <input style={inputStyle} placeholder="Member Name" value={member.name} onChange={e => handleUpdateTeamMember(idx, 'name', e.target.value)} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input style={{ ...inputStyle, fontSize: '12px' }} placeholder="Phone" value={member.phone} onChange={e => handleUpdateTeamMember(idx, 'phone', e.target.value)} />
                                        <button type="button" onClick={() => handleRemoveTeamMember(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing Selection */}
                {event.hasSpecialPrices && event.specialPrices && event.specialPrices.length > 0 && (
                    <div>
                        <label style={labelStyle}>Select Pricing Tier</label>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {event.specialPrices.map(p => (
                                <div
                                    key={p.name}
                                    onClick={() => setSelectedPriceName(p.name)}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: `1px solid ${selectedPriceName === p.name ? themeColor : '#27272a'}`,
                                        backgroundColor: selectedPriceName === p.name ? `${themeColor}10` : '#09090b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{p.name}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: themeColor }}>₹{p.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Fields */}
                {event.customFields?.map(field => (
                    <div key={field.name}>
                        <label style={labelStyle}>{field.name} {field.required && '*'}</label>
                        {field.type === 'dropdown' ? (
                            <select
                                required={field.required}
                                style={inputStyle}
                                onChange={e => setFormData(prev => ({ ...prev, customFields: { ...prev.customFields, [field.name]: e.target.value } }))}
                            >
                                <option value="">Select option</option>
                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : field.type === 'info' ? (
                            <div style={{ padding: '12px', backgroundColor: '#18181b', borderRadius: '10px', fontSize: '13px', color: '#a1a1aa', borderLeft: `3px solid ${themeColor}` }}>
                                {field.name}
                            </div>
                        ) : (
                            <input
                                required={field.required}
                                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                style={inputStyle}
                                onChange={e => setFormData(prev => ({ ...prev, customFields: { ...prev.customFields, [field.name]: e.target.value } }))}
                            />
                        )}
                    </div>
                ))}

                {/* Promo Code */}
                {!event.isFree && (
                    <div>
                        <label style={labelStyle}>Promo Code</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                style={inputStyle}
                                placeholder="ENTER CODE"
                                value={promoCode}
                                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromo}
                                style={{ padding: '0 20px', backgroundColor: '#27272a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                            >
                                APPLY
                            </button>
                        </div>
                        {appliedPromo && (
                            <p style={{ fontSize: '12px', color: themeColor, marginTop: '6px', fontWeight: '600' }}>
                                ✓ APPLIED: {appliedPromo.code} (-₹{discountAmount})
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Summary */}
            {!event.isFree && (
                <div style={{ padding: '20px', backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <span style={{ color: '#71717a' }}>Base Ticket Price</span>
                        <span>₹{baseAmount}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: themeColor }}>
                            <span>Discount ({appliedPromo?.code})</span>
                            <span>-₹{discountAmount}</span>
                        </div>
                    )}
                    {platformFeeAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#71717a' }}>Vihaya Service Fee</span>
                            <span>₹{platformFeeAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{ height: '1px', backgroundColor: '#27272a', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.125rem' }}>
                        <span>Total Pay</span>
                        <span style={{ color: themeColor }}>₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={submitting || (event.hasSpecialPrices && !selectedPriceName && !event.isFree)}
                style={{
                    marginTop: '8px',
                    padding: '16px',
                    backgroundColor: themeColor,
                    color: '#000',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: (submitting || (event.hasSpecialPrices && !selectedPriceName && !event.isFree)) ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: `0 10px 15px -3px ${themeColor}40`,
                    fontSize: '15px'
                }}
            >
                {submitting ? 'Processing...' : (event.isFree ? 'Complete Registration' : `Confirm & Pay ₹${totalAmount.toFixed(0)}`)}
            </button>

            {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '8px', fontWeight: '500' }}>{error}</p>}

            {/* Rich Content Sections */}
            {(event.agendaList?.length || 0) > 0 && (
                <div style={{ marginTop: '32px', borderTop: '1px solid #18181b', paddingTop: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>Event Agenda</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {event.agendaList?.map((item, idx) => (
                            <div key={idx} style={{ padding: '16px', backgroundColor: '#18181b', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '700' }}>{item.title}</span>
                                    <span style={{ color: themeColor, fontSize: '12px', fontWeight: '700' }}>{item.time}</span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#71717a', margin: '0' }}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(event.speakerList?.length || 0) > 0 && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>Speakers</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                        {event.speakerList?.map((speaker, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                {speaker.imageUrl && <img src={speaker.imageUrl} style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '8px', objectFit: 'cover' }} />}
                                <div style={{ fontWeight: '700', fontSize: '14px' }}>{speaker.name}</div>
                                <div style={{ fontSize: '12px', color: '#71717a' }}>{speaker.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(event.faqList?.length || 0) > 0 && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>FAQs</h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {event.faqList?.map((faq, idx) => (
                            <details key={idx} style={{ backgroundColor: '#18181b', borderRadius: '12px', padding: '12px' }}>
                                <summary style={{ fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>{faq.question}</summary>
                                <p style={{ marginTop: '8px', fontSize: '13px', color: '#71717a' }}>{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            )}
        </form>
    );
};
