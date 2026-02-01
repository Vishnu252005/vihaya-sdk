// Vihaya SDK - Official Client

export interface VihayaConfig {
    apiKey: string;
    baseUrl?: string;
    headers?: Record<string, string>;
}

export interface CustomField {
    id?: string;
    name: string;
    type: 'text' | 'email' | 'phone' | 'dropdown' | 'number' | 'date' | 'textarea' | 'info' | 'file';
    required: boolean;
    options?: string[];
    replacesDefault?: string;
}

export interface SpecialPrice {
    name: string;
    amount: number;
    earlyBirdAmount?: number;
    requiresValidId?: boolean;
    validIds?: string[];
    customFields?: CustomField[];
}

export interface VihayaEvent {
    id: string;
    title: string;
    eventType?: 'singleEvent' | 'megaEvent';
    description: string;
    date: string;
    location: string;
    price: number;
    isFree: boolean;
    creatorId: string;
    createdAt?: any;

    // Registration Form Metadata
    customFields?: CustomField[];
    specialPrices?: SpecialPrice[];
    hasSpecialPrices?: boolean;

    // Default Collection Flags
    collectDietaryPreferences?: boolean;
    collectAccessibilityNeeds?: boolean;
    collectEmergencyContact?: boolean;
    collectAffiliation?: boolean;
    collectResearchInterests?: boolean;
    collectTShirtSize?: boolean;

    // Accommodation & Food
    hasAccommodation?: boolean;
    accommodationPrice?: number;
    accommodationDetails?: string;
    hasFoodCoupons?: boolean;
    foodCouponPrice?: number;

    // Team Registration
    isTeamEvent?: boolean;
    minTeamSize?: number;
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
    subEvents?: VihayaEvent[];
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    paymentId?: string;
    orderId?: string;
    preferences?: Record<string, any>;
    customFields?: Record<string, any>;
}

export class VihayaClient {
    private apiKey: string;
    private baseUrl: string;
    private extraHeaders: Record<string, string>;

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
            throw new Error(data.error || 'Vihaya API Error');
        }
        return data;
    }

    /**
     * Events API Methods
     */
    events = {
        /**
         * List all available events
         */
        list: async (): Promise<VihayaEvent[]> => {
            const result = await this.request('/api/v1/events');
            return result.data;
        },

        /**
         * Get details for a specific event
         */
        get: async (id: string): Promise<VihayaEvent> => {
            const result = await this.request(`/api/v1/events/${id}`);
            return result.data;
        },

        /**
         * Register an attendee for an event
         */
        register: async (id: string, data: RegisterData) => {
            return this.request(`/api/v1/events/${id}/register`, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
    };

    /**
     * Payments API Methods
     */
    payments = {
        /**
         * Verify a Razorpay payment signature
         */
        verify: async (data: { paymentId: string; orderId: string; signature: string }) => {
            return this.request('/api/v1/payments/verify', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
    };
}
