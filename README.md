# Vihaya API SDK (Official)

[![npm version](https://img.shields.io/npm/v/vihaya-sdk.svg?style=flat-square)](https://www.npmjs.com/package/vihaya-sdk)
[![license](https://img.shields.io/npm/l/vihaya-sdk.svg?style=flat-square)](https://github.com/your-username/vihaya-sdk/blob/main/LICENSE)

The official JavaScript/TypeScript SDK for the Vihaya Events platform. Easily integrate event listings, registration, and payment verification into any website.

## Features

- **Type-safe**: Built with TypeScript for a superior developer experience.
- **Universal**: Works in Next.js, React, Node.js, and directly in the browser.
- **Lightweight**: Zero dependencies, using native `fetch`.

## Installation

```bash
npm install vihaya-sdk
# or
yarn add vihaya-sdk
```

## Quick Start

```typescript
import { VihayaClient } from 'vihaya-sdk';

// 1. Initialize the client
const vihaya = new VihayaClient('your_api_key_here');

// 2. Fetch all platform events
const events = await vihaya.events.list();

// 3. Register a user for an event
await vihaya.events.register('event_id', {
  name: 'Vishnu',
  email: 'vishnu@example.com',
  phone: '9876543210'
});
```

## API Reference

### `events.list()`
Returns a promise with an array of all active events.

### `events.get(id: string)`
Returns details for a single event.

### `events.register(id: string, data: RegisterData)`
Registers an attendee. Note: For paid events, a `paymentId` must be provided in the data.

### `payments.verify(data: PaymentVerifyData)`
Verifies a Razorpay payment signature from the server side.

## Security

> [!IMPORTANT]
> Never expose your API Key on the client-side (browser) if it has write permissions. Use environment variables like `VIHAYA_API_KEY` in your server-side code or Next.js API routes.

## License

MIT © [Vihaya Team](https://vihaya.app)
