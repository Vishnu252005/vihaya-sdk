// Vihaya SDK - Official Client

export interface VihayaConfig {
    apiKey: string;
    baseUrl?: string;
}

export interface VihayaEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    isFree: boolean;
    creatorId: string;
    createdAt?: any;
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    paymentId?: string;
}

export class VihayaClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(config: VihayaConfig | string) {
        if (typeof config === 'string') {
            this.apiKey = config;
            this.baseUrl = 'https://events.vihaya.app';
        } else {
            this.apiKey = config.apiKey;
            this.baseUrl = (config.baseUrl || 'https://events.vihaya.app').replace(/\/$/, '');
        }
    }

    private async request(path: string, options: RequestInit = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
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
