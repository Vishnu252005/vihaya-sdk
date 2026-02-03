"use client";

/**
 * Vihaya SDK - Official Client
 * The official JavaScript/TypeScript SDK for the Vihaya Events platform.
 */

/**
 * Configuration for the VihayaClient.
 */
export interface VihayaConfig {
    /** Your Vihaya API Key. Get this from the Developer Dashboard. */
    apiKey: string;
    /** Optional: Override the base API URL (e.g., for local testing). */
    baseUrl?: string;
    /** Optional: Additional headers to send with every request. */
    /** Optional: Custom headers to include in every request. */
    headers?: Record<string, string>;
}

/**
 * Represents a custom field in a registration form.
 */
export interface CustomField {
    id?: string;
    name: string;
    type: 'text' | 'email' | 'phone' | 'dropdown' | 'number' | 'date' | 'textarea' | 'info' | 'file';
    required: boolean;
    options?: string[];
    replacesDefault?: string;
}

/**
 * Represents a special pricing tier for an event.
 */
export interface SpecialPrice {
    name: string;
    amount: number;
    earlyBirdAmount?: number;
    requiresValidId?: boolean;
    validIds?: string[];
    /** Custom fields specific to this pricing tier. */
    customFields?: CustomField[];
}

/**
 * Comprehensive details for a Vihaya Event.
 */
export interface VihayaEvent {
    id: string;
    /** Title of the event. */
    title: string;
    /** Type of event: a single event or a parent 'mega' event with sub-events. */
    eventType?: 'singleEvent' | 'megaEvent';
    /** Markdown description of the event. */
    description: string;
    /** ISO date string for the event start. */
    date: string;
    /** Venue name or basic location info. */
    location: string;
    /** The base price of the event in INR. */
    price: number;
    /** Whether the event is free to join. */
    isFree: boolean;
    /** User ID of the event creator. */
    creatorId: string;
    /** ISO date string or server timestamp of when the event was created. */
    createdAt?: string;

    // Registration Form Metadata
    /** List of global custom fields for registration. */
    customFields?: CustomField[];
    /** List of special pricing tiers. */
    specialPrices?: SpecialPrice[];
    /** Whether the event has special prices enabled. */
    hasSpecialPrices?: boolean;

    // Default Collection Flags
    collectDietaryPreferences?: boolean;
    collectAccessibilityNeeds?: boolean;
    collectEmergencyContact?: boolean;
    collectAffiliation?: boolean;
    collectResearchInterests?: boolean;
    collectTShirtSize?: boolean;

    // Accommodation & Food
    /** Whether accommodation is offered for this event. */
    hasAccommodation?: boolean;
    /** Price for accommodation in INR. */
    accommodationPrice?: number;
    /** Details about the accommodation offered. */
    accommodationDetails?: string;
    /** Whether food coupons are available for purchase. */
    hasFoodCoupons?: boolean;
    /** Price for food coupons in INR. */
    foodCouponPrice?: number;

    // Team Registration
    /** Whether this event requires registration as a team. */
    isTeamEvent?: boolean;
    /** Minimum allowed team size. */
    minTeamSize?: number;
    /** Maximum allowed team size. */
    maxTeamSize?: number;

    // Other Details
    venueName?: string;
    fullAddress?: string;
    city?: string;
    country?: string;
    googleMapLink?: string;
    contactPhone?: string;
    contactEmail?: string;
    contactPersonName?: string;

    // Mega Events (Parent Events)
    /** List of sub-events if this is a mega event. */
    subEvents?: VihayaEvent[];
}

/**
 * Data required to register for an event.
 */
export interface RegisterData {
    /** Full name of the primary attendee. */
    name: string;
    /** Email address of the primary attendee. */
    email: string;
    /** Phone number of the primary attendee. */
    phone: string;

    /** Optional: The Razorpay payment ID (for confirmation phase). */
    paymentId?: string;
    /** Optional: The Razorpay order ID (for confirmation phase). */
    orderId?: string;
    /** Optional: Existing registration ID if confirming a pending record. */
    registrationId?: string;

    /** Optional: Selected special pricing tier name. */
    specialPrice?: string;
    /** Optional: Applied promotion code. */
    promoCode?: string;
    /** Optional: Flag indicating early bird price was applied. */
    isEarlyBirdApplied?: boolean;

    /** Optional: Team details for team events. */
    teamName?: string;
    /** Optional: List of team members. */
    teamMembers?: any[];

    /** Convenience: Whether accommodation is requested. */
    accommodation?: boolean;
    /** Convenience: Selected dietary preference. */
    dietaryPreference?: string;

    /** Generic preferences for default collection fields. */
    preferences?: Record<string, any>;
    /** Values for custom fields (key is field name). */
    customFields?: Record<string, any>;

    /** Internal: User ID from your system. */
    userId?: string;
}

/**
 * Custom error class for Vihaya API errors.
 */
export class VihayaError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'VihayaError';
    }
}

export * from './VihayaRegistrationForm';

/**
 * The main Vihaya Client.
 */
export class VihayaClient {
    private apiKey: string;
    private baseUrl: string;
    private extraHeaders: Record<string, string>;

    /**
     * Initialize a new Vihaya Client.
     * @param config VihayaConfig object or just the API Key string.
     */
    constructor(config: VihayaConfig | string) {
        if (typeof config === 'string') {
            this.apiKey = config;
            this.baseUrl = 'https://events.vihaya.app';
            this.extraHeaders = {};
        } else {
            this.apiKey = config.apiKey;
            this.baseUrl = (config.baseUrl || 'https://events.vihaya.app').replace(/\/$/, '');
            this.extraHeaders = config.headers || {};
        }
    }

    private async request(path: string, options: RequestInit = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
                ...this.extraHeaders,
                ...options.headers,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new VihayaError(data.error || 'Vihaya API Error', response.status, data);
        }
        return data;
    }

    /**
     * API methods related to Events.
     */
    ui = {
        /**
         * Open the official Vihaya registration form in a modal/iframe.
         * This uses the design exactly as seen on events.vihaya.app.
         */
        showRegistration: (eventId: string) => {
            const iframe = document.createElement('iframe');
            // We'll use a specific embed route if available, or just the event page with an embed flag
            iframe.src = `${this.baseUrl}/events/${eventId}?embed=true`;
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            iframe.style.zIndex = '999999';
            iframe.style.backgroundColor = 'rgba(0,0,0,0.5)';

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.position = 'fixed';
            closeBtn.style.top = '20px';
            closeBtn.style.right = '20px';
            closeBtn.style.zIndex = '1000000';
            closeBtn.style.backgroundColor = '#ef4444';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '50%';
            closeBtn.style.width = '40px';
            closeBtn.style.height = '40px';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.cursor = 'pointer';

            const remove = () => {
                document.body.removeChild(iframe);
                document.body.removeChild(closeBtn);
            };

            closeBtn.onclick = remove;

            // Listen for success message from iframe
            window.addEventListener('message', (event) => {
                if (event.origin !== this.baseUrl) return;
                if (event.data.type === 'VIHAYA_REGISTRATION_SUCCESS') {
                    setTimeout(remove, 2000);
                }
            });

            document.body.appendChild(iframe);
            document.body.appendChild(closeBtn);
        }
    };

    /**
     * API methods related to Events.
     */
    events = {
        /**
         * List all available events on your account.
         */
        list: async (): Promise<VihayaEvent[]> => {
            const result = await this.request('/api/v1/events');
            return result.data;
        },

        /**
         * Get comprehensive details for a specific event.
         */
        get: async (id: string): Promise<VihayaEvent> => {
            const result = await this.request(`/api/v1/events/${id}`);
            return result.data;
        },

        /**
         * Register an attendee for an event.
         * If the event is paid, this will return an order ID for Razorpay integration.
         */
        register: async (id: string, data: RegisterData) => {
            return this.request(`/api/v1/events/${id}/register`, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
    };

    /**
     * API methods related to Payments.
     */
    payments = {
        /**
         * Verify a Razorpay payment signature on the server side.
         */
        verify: async (data: { paymentId: string; orderId: string; signature: string }) => {
            return this.request('/api/v1/payments/verify', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
    };
}
