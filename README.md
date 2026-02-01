# Vihaya API SDK

[![NPM Version](https://img.shields.io/npm/v/vihaya-sdk.svg?style=flat-square)](https://www.npmjs.com/package/vihaya-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Vishnu252005/vihaya-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

The official JavaScript/TypeScript SDK for the **Vihaya Events** platform. Build seamless event experiences with a tiny footprint and zero dependencies.

---

## 🚀 Key Features

- **Type-Safe**: Full TypeScript support with auto-completion for all models.
- **Universal**: Optimized for Node.js, Next.js (Server & Client), and browser environments.
- **Modern**: Lightweight wrapper around the native `fetch` API.
- **Secure**: Built-in support for Vihaya API Keys and payment verification.

---

## 📦 Installation

```bash
# Using npm
npm install vihaya-sdk

# Using yarn
yarn add vihaya-sdk

# Using pnpm
pnpm add vihaya-sdk
```

---

## 🛠️ Quick Start

### 1. Initialize the Client
Get your API key from the [Vihaya Developer Dashboard](https://events.vihaya.app/profile/developer).

```typescript
import { VihayaClient } from 'vihaya-sdk';

const vihaya = new VihayaClient({
  apiKey: process.env.VIHAYA_API_KEY as string
});
```

### 2. Fetch Events (Next.js App Router)
Perfect for Server Components.

```typescript
// app/events/page.tsx
import { VihayaClient } from 'vihaya-sdk';

export default async function Page() {
  const vihaya = new VihayaClient(process.env.VIHAYA_API_KEY!);
  const events = await vihaya.events.list();

  return (
    <div>
      {events.map(event => (
        <h2 key={event.id}>{event.title}</h2>
      ))}
    </div>
  );
}
```

### 3. Handle Registrations (Client-side)

```typescript
"use client";
import { VihayaClient } from 'vihaya-sdk';

const vihaya = new VihayaClient('YOUR_PUBLIC_KEY'); // Use a restricted public key for client-side

const register = async (eventId: string) => {
  try {
    const result = await vihaya.events.register(eventId, {
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210"
    });
    console.log("Registered!", result);
  } catch (error) {
    console.error("Registration failed", error);
  }
};
```

---

## 📝 Building Registration Forms

The Vihaya SDK provides all the metadata you need to build dynamic registration forms in a single `events.get(id)` call. This includes custom fields, pricing tiers, accommodation, and food preferences.

### 1. Fetch Event Metadata
```typescript
const event = await vihaya.events.get('event_id');

// event now contains:
// - event.specialPrices: Pricing tiers (Student, Early Bird, etc.)
// - event.customFields: Custom input fields (T-Shirt size, etc.)
// - event.hasAccommodation: Whether accommodation is available
// - event.collectDietaryPreferences: Whether to ask for food preferences
```

### 2. Render Tiers (Radio Buttons/Select)
```tsx
{event.specialPrices?.map(tier => (
  <label key={tier.name}>
    <input type="radio" name="tier" value={tier.name} />
    {tier.name} - ₹{tier.amount}
  </label>
))}
```

### 3. Render Custom Fields
```tsx
{event.customFields?.map(field => (
  <div key={field.name}>
    <label>{field.name} {field.required && '*'}</label>
    {field.type === 'dropdown' ? (
      <select name={field.name}>
        {field.options?.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    ) : (
      <input type={field.type} name={field.name} required={field.required} />
    )}
  </div>
))}
```

### 4. Handle Accommodation & Food
```tsx
{event.hasAccommodation && (
  <div>
    <h4>Accommodation Available (₹{event.accommodationPrice})</h4>
    <p>{event.accommodationDetails}</p>
    <input type="checkbox" name="accommodation" /> I need accommodation
  </div>
)}

{event.collectDietaryPreferences && (
  <select name="food">
    <option value="veg">Veg</option>
    <option value="non-veg">Non-Veg</option>
  </select>
)}
```

### 🏢 Handling Mega Events (Parent Events)

If an event is a "Mega Event", it contains multiple "Sub-Events" (e.g., workshops, competitions inside a fest).

```typescript
const event = await vihaya.events.get('mega_event_id');

if (event.eventType === 'megaEvent') {
  console.log(`Fest Title: ${event.title}`);
  
  // List all sub-events
  event.subEvents?.forEach(sub => {
    console.log(`- ${sub.title} (₹${sub.price})`);
    // Each 'sub' has its own customFields, tiers, etc.
  });
}
```

---

## 📖 API Reference

### `Events`
| Method | Description |
| :--- | :--- |
| `list()` | Returns all active events on the platform. |
| `get(id)` | Fetches comprehensive details (Fields, Tiers, Food, etc.) for an event. |
| `register(id, data)` | Submits registration data (Custom fields go in `customFields`). |

### `Payments`
| Method | Description |
| :--- | :--- |
| `verify(data)` | Verifies Razorpay signatures. Use only on the **Server Side**. |

---

## 🔒 Security Best Practices

> [!WARNING]
> **Never** expose your `Live Secret Key` in client-side code (`browser`, `react-components`). Use environment variables and always perform sensitive operations (like payment verification) in Next.js API routes or Server Actions.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👋 Support

Built with ❤️ by the **Vihaya Team**.  
If you have any questions, feel free to open an issue or contact support@vihaya.app.
