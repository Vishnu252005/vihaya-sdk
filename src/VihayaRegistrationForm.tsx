"use client";

import React, { useState, useEffect } from 'react';
import { VihayaClient, VihayaEvent, RegisterData, VihayaError } from './index';

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
    themeColor = '#3b82f6',
    showOnlyCustomFields = false,
    initialData = {}
}) => {
    const [event, setEvent] = useState<VihayaEvent | undefined>(initialEvent);
    const [loading, setLoading] = useState(!initialEvent);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<RegisterData>>({
        name: '',
        email: '',
        phone: '',
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

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading event details...</div>;
    }

    if (error || !event) {
        return (
            <div style={{ padding: '20px', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
                <strong>Error:</strong> {error || 'Event not found'}
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const data = formData as RegisterData;
            const result = await client.events.register(eventId, data);

            if (result.orderId) {
                // Initialize Razorpay if needed
                if (!(window as any).Razorpay) {
                    throw new Error('Razorpay SDK not loaded. Please include <script src="https://checkout.razorpay.com/v1/checkout.js"></script>');
                }

                const options = {
                    key: result.key,
                    amount: result.amount,
                    currency: result.currency,
                    name: 'Vihaya Events',
                    description: `Registration for ${event.title}`,
                    order_id: result.orderId,
                    handler: async (response: any) => {
                        try {
                            // Confirm payment
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

    const handleInputChange = (field: keyof RegisterData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCustomFieldChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            customFields: { ...prev.customFields, [name]: value }
        }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '24px',
                backgroundColor: '#111827',
                color: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #374151',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>Register for {event.title}</h2>

            {!showOnlyCustomFields && (
                <>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Full Name</label>
                        <input
                            required
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#030712', color: 'white' }}
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'grid', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Email</label>
                        <input
                            required
                            type="email"
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#030712', color: 'white' }}
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'grid', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Phone</label>
                        <input
                            required
                            type="tel"
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#030712', color: 'white' }}
                            value={formData.phone}
                            onChange={e => handleInputChange('phone', e.target.value)}
                        />
                    </div>
                </>
            )}

            {/* Custom Fields */}
            {event.customFields?.map(field => (
                <div key={field.name} style={{ display: 'grid', gap: '8px' }}>
                    <label style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{field.name} {field.required && '*'}</label>
                    {field.type === 'dropdown' ? (
                        <select
                            required={field.required}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#030712', color: 'white' }}
                            onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                        >
                            <option value="">Select option</option>
                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <input
                            required={field.required}
                            type={field.type === 'number' ? 'number' : 'text'}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#030712', color: 'white' }}
                            onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={submitting}
                style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: themeColor,
                    color: 'white',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'opacity 0.2s'
                }}
            >
                {submitting ? 'Processing...' : (event.isFree ? 'Register' : `Pay ₹${event.price}`)}
            </button>

            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '8px' }}>{error}</p>}
        </form>
    );
};
