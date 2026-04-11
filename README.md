# Vihaya SDK for JavaScript & TypeScript — Official Events API Client

[![NPM Version](https://img.shields.io/npm/v/vihaya-sdk.svg?style=flat-square)](https://www.npmjs.com/package/vihaya-sdk)
[![NPM Downloads](https://img.shields.io/npm/dm/vihaya-sdk.svg?style=flat-square)](https://www.npmjs.com/package/vihaya-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Vishnu252005/vihaya-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/vihaya-sdk?style=flat-square)](https://bundlephobia.com/package/vihaya-sdk)

> **`vihaya-sdk`** is the official JavaScript and TypeScript SDK for the **[Vihaya Events](https://vihaya.app)** platform. Build event listings, registration flows, ticketing experiences, Razorpay payment verification, and attendee dashboards in Node.js, Next.js, React, Vite, Remix, Express, NestJS, SvelteKit, Nuxt, Deno, Bun, Cloudflare Workers, and the browser — all with full type safety and zero dependencies.

**Vihaya** is the modern events platform for India — a single stack for event organisers, ticketing, sponsor management, attendee registration, live check-in, and real-time analytics. This SDK is the fastest way to integrate the Vihaya Events API (`https://events.vihaya.app`) into any JavaScript or TypeScript codebase.

---

## Table of contents

- [What is Vihaya?](#-what-is-vihaya)
- [Why the Vihaya JavaScript SDK?](#-why-the-vihaya-javascript-sdk)
- [The Vihaya SDK family](#-the-vihaya-sdk-family-7-languages)
- [Installation](#-installation)
- [Get your Vihaya API key](#-get-your-vihaya-api-key)
- [Quick start](#-quick-start)
- [Core concepts](#-core-concepts)
- [Usage guide](#-usage-guide)
- [Framework integrations](#-framework-integrations)
- [Building registration forms](#-building-registration-forms)
- [Mega events & sub-events](#-mega-events--sub-events)
- [Razorpay payment flow](#-razorpay-payment-flow)
- [API reference](#-api-reference)
- [Error handling](#-error-handling)
- [Security best practices](#-security-best-practices)
- [FAQ](#-faq)
- [Keywords](#-keywords)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🇮🇳 What is Vihaya?

**Vihaya** is an all-in-one events platform for India, built for organisers who run everything from college fests and hackathons to conferences, workshops, meetups, bootcamps, summits, and corporate events. The Vihaya platform provides:

- 🎟️ **Event creation & ticketing** — with pricing tiers (Early Bird, Student, VIP, Group), promo codes, and a fully-hosted checkout.
- 🏢 **Mega events** — bundle dozens of sub-events (workshops, competitions, talks) under one parent fest.
- 💳 **Razorpay payments** — integrated end-to-end with server-side signature verification.
- 📋 **Custom registration fields** — T-shirt size, college name, team members, dietary preferences, accommodation, and more.
- 👥 **Attendee management** — real-time registrations, bulk email, WhatsApp broadcasts, and CSV exports.
- 📱 **Live check-in** — mobile QR scanning with offline-first sync.
- 👩‍🏫 **Speakers, agenda, sponsors, FAQs** — everything needed for a rich public event page.
- 📊 **Analytics** — registrations over time, revenue, tier breakdowns, funnel tracking.
- 🔔 **Broadcasts** — push updates to all attendees via email, SMS, and WhatsApp.
- 🧾 **Invoices, refunds, and sponsor dashboards.**

The Vihaya Events API — and this **`vihaya-sdk`** package — lets developers embed that platform into their own web apps, student portals, university sites, SaaS tools, and mobile apps. Whether you're building a college fest website with Next.js, a conference landing page with Remix, or an internal ticketing dashboard with Express, the Vihaya SDK is the idiomatic way to talk to the Vihaya Events API from JavaScript.

Production URL: **`https://events.vihaya.app`** · Marketing site: **`https://vihaya.app`** · Developer dashboard: **`https://events.vihaya.app/profile/developer`**

---

## ✨ Why the Vihaya JavaScript SDK?

- **🔐 Type-safe** — every Vihaya API response, request payload, and model is a fully-typed TypeScript interface with IntelliSense autocompletion.
- **📦 Tiny** — a thin wrapper around the native `fetch` API. Zero runtime dependencies. Ships both ESM and CJS builds.
- **🌐 Universal** — works in Node.js 18+, Next.js (App Router + Pages), React, Vite, Remix, SvelteKit, Nuxt, Astro, Bun, Deno, Cloudflare Workers, Vercel Edge, and modern browsers.
- **⚡ Native fetch** — no `axios`, no `node-fetch`, no polyfills — just the platform.
- **🧪 Tested** — against the live `events.vihaya.app` production API on every release.
- **🔁 Isomorphic** — same client works in RSC (React Server Components), Route Handlers, Server Actions, and client components.
- **🎛️ Rich models** — events, speakers, agenda, sponsors, FAQs, custom fields, pricing tiers, accommodation, dietary preferences, promo codes, sub-events, team registrations.
- **🧩 React components** — bundled `<VihayaRegistrationForm />` component and `client.ui.showRegistration(eventId)` iframe modal helper for zero-config checkout.
- **💳 Razorpay ready** — built-in server-side signature verification for `Events.register()` → Razorpay → `Payments.verify()`.

---

## 🌍 The Vihaya SDK family (7 languages)

The Vihaya Events API has seven official SDKs — all feature-compatible, all maintained in lockstep, all talking to the same `events.vihaya.app` production API.

| Language | Package | Repository | Install |
| --- | --- | --- | --- |
| 🟨 **JavaScript / TypeScript** | [`vihaya-sdk`](https://www.npmjs.com/package/vihaya-sdk) | [Vishnu252005/vihaya-sdk](https://github.com/Vishnu252005/vihaya-sdk) | `npm install vihaya-sdk` |
| 🐍 **Python** | [`vihaya-events`](https://pypi.org/project/vihaya-events/) | [Vishnu252005/vihaya-sdk-python](https://github.com/Vishnu252005/vihaya-sdk-python) | `pip install vihaya-events` |
| 🦫 **Go** | [`vihaya-sdk-go`](https://pkg.go.dev/github.com/Vishnu252005/vihaya-sdk-go) | [Vishnu252005/vihaya-sdk-go](https://github.com/Vishnu252005/vihaya-sdk-go) | `go get github.com/Vishnu252005/vihaya-sdk-go` |
| ☕ **Java** | [`vihaya-sdk-java`](https://jitpack.io/#Vishnu252005/vihaya-sdk-java) | [Vishnu252005/vihaya-sdk-java](https://github.com/Vishnu252005/vihaya-sdk-java) | JitPack / Gradle / Maven |
| 💎 **Ruby** | [`vihaya-events`](https://rubygems.org/gems/vihaya-events) | [Vishnu252005/vihaya-sdk-ruby](https://github.com/Vishnu252005/vihaya-sdk-ruby) | `gem install vihaya-events` |
| 🐘 **PHP** | [`vihaya/events`](https://packagist.org/packages/vihaya/events) | [Vishnu252005/vihaya-sdk-php](https://github.com/Vishnu252005/vihaya-sdk-php) | `composer require vihaya/events` |
| 📱 **Flutter / Dart** | [`vihaya_sdk_flutter`](https://pub.dev/packages/vihaya_sdk_flutter) | [Vishnu252005/vihaya-sdk-flutter](https://github.com/Vishnu252005/vihaya-sdk-flutter) | `flutter pub add vihaya_sdk_flutter` |

All Vihaya SDKs target the same API base URL (`https://events.vihaya.app`), authenticate with the same `x-api-key` header, and expose the same methods: `events.list()`, `events.get()`, `events.register()`, `payments.verify()`. Pick the one that fits your stack — or mix and match (e.g., Flutter on mobile, Next.js on web, Python for analytics jobs).

---

## 📦 Installation

### npm

```bash
npm install vihaya-sdk
```

### Yarn

```bash
yarn add vihaya-sdk
```

### pnpm

```bash
pnpm add vihaya-sdk
```

### Bun

```bash
bun add vihaya-sdk
```

### Deno

```typescript
import { VihayaClient } from "npm:vihaya-sdk";
```

Vihaya SDK works in:

- **Node.js 18+** (native fetch required)
- **Next.js 13, 14, 15** (App Router & Pages Router)
- **React 18, 19**
- **Vite, Remix, Astro, SvelteKit, Nuxt 3, Solid Start**
- **Bun 1.0+** and **Deno 1.35+**
- **Cloudflare Workers, Vercel Edge, Netlify Edge Functions**
- **Modern browsers** (Chrome, Safari, Firefox, Edge)

---

## 🔑 Get your Vihaya API key

1. Sign up or log in at **[events.vihaya.app](https://events.vihaya.app)**.
2. Open the **[Developer Dashboard](https://events.vihaya.app/profile/developer)**.
3. Click **Generate API Key** and copy the `vh_live_...` token.
4. Store it in an environment variable — never commit it to git.

```bash
# .env.local
VIHAYA_API_KEY=vh_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Quick start

### Initialize the Vihaya client

```typescript
import { VihayaClient } from "vihaya-sdk";

const vihaya = new VihayaClient({
  apiKey: process.env.VIHAYA_API_KEY!,
});
```

Or with the shorthand string constructor:

```typescript
const vihaya = new VihayaClient("vh_live_...");
```

### List all events

```typescript
const events = await vihaya.events.list();

events.forEach((event) => {
  console.log(`${event.title} — ${event.location} on ${event.date}`);
});
```

### Fetch a single event with full metadata

```typescript
const event = await vihaya.events.get("evt_8x42j9");

console.log(event.title);
console.log(event.speakerList);   // list of Speaker
console.log(event.agendaList);    // list of AgendaItem
console.log(event.sponsors);      // list of Sponsor
console.log(event.faqs);          // list of FAQItem
console.log(event.customFields);  // list of CustomField
console.log(event.specialPrices); // pricing tiers
console.log(event.subEvents);     // sub-events (if mega event)
```

### Register an attendee

```typescript
const result = await vihaya.events.register("evt_8x42j9", {
  name: "Anjali Mehta",
  email: "anjali@example.com",
  phone: "+919820012345",
  customFields: {
    "T-Shirt Size": "L",
    "College": "Vihaya Institute",
  },
});

if (result.isPaid) {
  console.log("Razorpay order:", result.orderId);
} else {
  console.log("Free registration:", result.registrationId);
}
```

### Verify a Razorpay payment (server-side)

```typescript
const verification = await vihaya.payments.verify({
  paymentId: "pay_O8K2...",
  orderId:   result.orderId,
  signature: "signature_from_razorpay",
});
```

---

## 🧭 Core concepts

### Vihaya Events

Every record in the Vihaya platform is an **Event**. Events have a title, description, date, venue, banner image, ticket price, sponsors, speakers, agenda, and an arbitrary set of custom registration fields.

### Mega events

A **mega event** is a parent event that contains multiple **sub-events**. Think: a 3-day college fest with 40 workshops, competitions, and talks — each of which has its own registration form, pricing, and capacity. The Vihaya SDK exposes sub-events via `event.subEvents`.

### Registrations

A **registration** is an attendee's entry for an event. Registrations can be free or paid (Razorpay), can include team members, and can capture custom fields defined by the organiser (college, T-shirt size, dietary preferences, etc.).

### Payments

Vihaya uses **Razorpay** under the hood. When you call `events.register()` for a paid event, Vihaya returns a Razorpay `orderId`. Your frontend hands it to Razorpay Checkout, and after the customer pays, your backend calls `payments.verify()` to confirm the signature and mark the registration paid.

### API key

All Vihaya API requests authenticate via the `x-api-key` header. Get yours from the [developer dashboard](https://events.vihaya.app/profile/developer). Treat it like a password — never ship it in client-side bundles.

---

## 📚 Usage guide

### List events with filtering

```typescript
const allEvents = await vihaya.events.list();

// Filter upcoming events client-side
const upcoming = allEvents.filter(
  (e) => new Date(e.date) > new Date()
);

// Filter by event type
const megaEvents = allEvents.filter(
  (e) => e.eventType === "megaEvent"
);

// Filter by mode (online / offline / hybrid)
const online = allEvents.filter(
  (e) => e.eventMode === "online"
);
```

### Get full event metadata

```typescript
const event = await vihaya.events.get("evt_8x42j9");

// Basic fields
event.id;
event.title;
event.description;
event.date;
event.time;
event.location;
event.timezone;
event.eventMode;        // "online" | "offline" | "hybrid"
event.eventType;        // "regular" | "megaEvent"
event.bannerUrl;

// Pricing
event.price;
event.isFree;
event.specialPrices;    // Array<SpecialPrice>
event.promoCodes;       // Array<PromoCode>

// Rich content
event.speakerList;      // Array<Speaker>
event.agendaList;       // Array<AgendaItem>
event.sponsors;         // Array<Sponsor>
event.faqs;             // Array<FAQItem>
event.contact;          // Contact

// Registration configuration
event.customFields;           // Array<CustomField>
event.hasAccommodation;
event.accommodationPrice;
event.accommodationDetails;
event.collectDietaryPreferences;
event.maxTeamSize;

// Sub-events (for mega events)
event.subEvents;        // Array<Event>
```

### Register for a free event

```typescript
const result = await vihaya.events.register("evt_free_meetup", {
  name: "Rahul Nair",
  email: "rahul@example.com",
  phone: "+919876543210",
});

console.log("Registered!", result.registrationId);
```

### Register for a paid event (with custom fields)

```typescript
const result = await vihaya.events.register("evt_paid_conf", {
  name: "Priya Raj",
  email: "priya@example.com",
  phone: "+919876543210",
  tier: "Early Bird",         // must match a specialPrices tier
  customFields: {
    "College": "IIT Bombay",
    "T-Shirt Size": "M",
    "Dietary": "Veg",
  },
  promoCode: "LAUNCH10",
});

if (result.isPaid) {
  // Continue to Razorpay Checkout with result.orderId
}
```

### Register a team

```typescript
const result = await vihaya.events.register("evt_hackathon", {
  name:  "Team Lead Name",
  email: "lead@example.com",
  phone: "+919820012345",
  teamName: "Byte Squad",
  teamMembers: [
    { name: "Alice", email: "alice@example.com", phone: "+91..." },
    { name: "Bob",   email: "bob@example.com",   phone: "+91..." },
    { name: "Carol", email: "carol@example.com", phone: "+91..." },
  ],
});
```

---

## 🎨 Framework integrations

### Next.js 15 — App Router / React Server Components

```tsx
// app/events/page.tsx
import { VihayaClient } from "vihaya-sdk";

export default async function EventsPage() {
  const vihaya = new VihayaClient(process.env.VIHAYA_API_KEY!);
  const events = await vihaya.events.list();

  return (
    <main>
      <h1>Upcoming Vihaya Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <a href={`/events/${event.id}`}>
              <h2>{event.title}</h2>
              <p>{event.date} · {event.location}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### Next.js — Route Handler for registration

```typescript
// app/api/register/route.ts
import { VihayaClient } from "vihaya-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const vihaya = new VihayaClient(process.env.VIHAYA_API_KEY!);

  try {
    const result = await vihaya.events.register(body.eventId, body.data);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.status ?? 500 }
    );
  }
}
```

### Next.js — Server Action

```typescript
// app/actions.ts
"use server";
import { VihayaClient } from "vihaya-sdk";

export async function registerForEvent(eventId: string, formData: FormData) {
  const vihaya = new VihayaClient(process.env.VIHAYA_API_KEY!);
  return vihaya.events.register(eventId, {
    name:  formData.get("name")  as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  });
}
```

### Express.js

```typescript
import express from "express";
import { VihayaClient } from "vihaya-sdk";

const app = express();
app.use(express.json());

const vihaya = new VihayaClient(process.env.VIHAYA_API_KEY!);

app.get("/events", async (_req, res) => {
  const events = await vihaya.events.list();
  res.json(events);
});

app.post("/events/:id/register", async (req, res) => {
  try {
    const result = await vihaya.events.register(req.params.id, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

app.listen(3000);
```

### NestJS

```typescript
import { Injectable } from "@nestjs/common";
import { VihayaClient } from "vihaya-sdk";

@Injectable()
export class VihayaService {
  private readonly client = new VihayaClient(process.env.VIHAYA_API_KEY!);

  listEvents() {
    return this.client.events.list();
  }

  getEvent(id: string) {
    return this.client.events.get(id);
  }

  register(id: string, data: any) {
    return this.client.events.register(id, data);
  }
}
```

### Cloudflare Workers / Vercel Edge

```typescript
import { VihayaClient } from "vihaya-sdk";

export default {
  async fetch(req: Request, env: { VIHAYA_API_KEY: string }) {
    const vihaya = new VihayaClient(env.VIHAYA_API_KEY);
    const events = await vihaya.events.list();
    return Response.json(events);
  },
};
```

### Remix

```typescript
// app/routes/events._index.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { VihayaClient } from "vihaya-sdk";

export async function loader() {
  const vihaya = new VihayaClient(process.env.VIHAYA_API_KEY!);
  return json(await vihaya.events.list());
}

export default function Events() {
  const events = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(events, null, 2)}</pre>;
}
```

### SvelteKit

```typescript
// +page.server.ts
import { VihayaClient } from "vihaya-sdk";
import { VIHAYA_API_KEY } from "$env/static/private";

export async function load() {
  const vihaya = new VihayaClient(VIHAYA_API_KEY);
  return { events: await vihaya.events.list() };
}
```

---

## 📝 Building registration forms

The Vihaya SDK gives you everything you need to render a dynamic registration form in a single `events.get()` call — pricing tiers, custom fields, accommodation options, dietary preferences, and team configuration. No schema to write, no form library to wrangle.

### 1. Fetch the event

```typescript
const event = await vihaya.events.get("evt_8x42j9");
```

### 2. Render pricing tiers

```tsx
<fieldset>
  <legend>Choose your ticket</legend>
  {event.specialPrices?.map((tier) => (
    <label key={tier.name}>
      <input type="radio" name="tier" value={tier.name} />
      <strong>{tier.name}</strong> — ₹{tier.amount}
      {tier.description && <span>{tier.description}</span>}
    </label>
  ))}
</fieldset>
```

### 3. Render custom fields dynamically

```tsx
{event.customFields?.map((field) => {
  if (field.type === "dropdown") {
    return (
      <label key={field.name}>
        {field.name} {field.required && "*"}
        <select name={field.name} required={field.required}>
          {field.options?.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label key={field.name}>
      {field.name} {field.required && "*"}
      <input
        type={field.type}
        name={field.name}
        required={field.required}
      />
    </label>
  );
})}
```

### 4. Accommodation & dietary preferences

```tsx
{event.hasAccommodation && (
  <label>
    <input type="checkbox" name="accommodation" />
    I need accommodation (₹{event.accommodationPrice})
    <small>{event.accommodationDetails}</small>
  </label>
)}

{event.collectDietaryPreferences && (
  <select name="dietary">
    <option value="veg">Vegetarian</option>
    <option value="non-veg">Non-Vegetarian</option>
    <option value="vegan">Vegan</option>
    <option value="jain">Jain</option>
  </select>
)}
```

---

## 🏢 Mega events & sub-events

Mega events on the Vihaya platform wrap multiple sub-events (workshops, competitions, talks) under one parent. The SDK lets you traverse the entire tree in one call.

```typescript
const fest = await vihaya.events.get("evt_mega_fest_2026");

if (fest.eventType === "megaEvent") {
  console.log(`${fest.title} (${fest.subEvents?.length} sub-events)`);

  fest.subEvents?.forEach((sub) => {
    const price = sub.isFree ? "Free" : `₹${sub.price}`;
    console.log(`  - ${sub.title} (${price})`);

    // Each sub-event has its own custom fields, tiers, etc.
    sub.customFields?.forEach((field) => {
      console.log(`    * ${field.name} (${field.type})`);
    });
  });
}
```

Register for a specific sub-event:

```typescript
await vihaya.events.register("evt_sub_workshop", {
  name:  "Attendee",
  email: "attendee@example.com",
  phone: "+919820012345",
});
```

---

## 💳 Razorpay payment flow

Vihaya uses Razorpay for payments. The flow is:

1. **`events.register()`** → Vihaya creates a Razorpay order and returns an `orderId`.
2. **Frontend** → Launch Razorpay Checkout with that `orderId`.
3. **Razorpay callback** → Razorpay hands you a `payment_id`, `order_id`, and `signature`.
4. **`payments.verify()` (server)** → Vihaya verifies the signature and marks the registration paid.

```typescript
// Step 1: Register (server-side)
const result = await vihaya.events.register(eventId, {
  name,
  email,
  phone,
  tier: "Early Bird",
});

// Step 2: Send orderId to the browser, launch Razorpay Checkout
//   window.Razorpay({ key, amount, order_id: result.orderId, ... }).open();

// Step 3: On success, Razorpay fires a handler with these values:
//   razorpay_payment_id, razorpay_order_id, razorpay_signature

// Step 4: Verify server-side
const verified = await vihaya.payments.verify({
  paymentId: razorpay_payment_id,
  orderId:   razorpay_order_id,
  signature: razorpay_signature,
});
```

> **⚠️ Always verify payments on the server.** A signature-check performed only in the browser can be spoofed. Use a Route Handler, Server Action, or Express endpoint — never the client.

---

## 📖 API reference

### `new VihayaClient(config)`

```typescript
new VihayaClient(apiKey: string);
new VihayaClient({ apiKey: string; baseUrl?: string; headers?: Record<string, string>; timeout?: number });
```

### `vihaya.events`

| Method | Signature | Description |
| --- | --- | --- |
| `list()` | `() => Promise<Event[]>` | Returns all active events on the authenticated account. |
| `get(id)` | `(id: string) => Promise<Event>` | Fetches full metadata for one event including tiers, custom fields, speakers, agenda, sponsors, FAQs, and sub-events. |
| `register(id, data)` | `(id: string, data: RegisterData) => Promise<RegisterResult>` | Submits a registration. Returns an `orderId` for paid events or a `registrationId` for free events. |

### `vihaya.payments`

| Method | Signature | Description |
| --- | --- | --- |
| `verify(req)` | `({ paymentId, orderId, signature, amount? }) => Promise<VerifyResult>` | Server-side Razorpay signature verification. **Call from your backend only.** |

### Models

Every model is a fully-typed interface exported from `vihaya-sdk`:

- `Event` — root event shape with all metadata
- `Speaker`, `Sponsor`, `AgendaItem`, `FAQItem`, `Contact`
- `CustomField` — `{ name, type, required, options? }`
- `SpecialPrice` — `{ name, amount, description? }`
- `PromoCode` — `{ code, discount, discountType }`
- `RegisterData` — registration payload
- `VihayaError` — thrown on any API failure

---

## 🚨 Error handling

All Vihaya SDK methods reject with a `VihayaError` on failure:

```typescript
import { VihayaClient, VihayaError } from "vihaya-sdk";

try {
  await vihaya.events.get("evt_does_not_exist");
} catch (err) {
  if (err instanceof VihayaError) {
    console.error(err.message);  // human-readable server message
    console.error(err.status);   // HTTP status code
    console.error(err.data);     // raw parsed response body
  }
}
```

Common status codes you'll see from the Vihaya Events API:

- **`401`** — missing or invalid API key
- **`403`** — API key doesn't have permission for this resource
- **`404`** — event / registration not found
- **`409`** — registration conflict (already registered, capacity full)
- **`422`** — validation error (missing required custom field, invalid email, etc.)
- **`429`** — rate limited
- **`500`** — server error

---

## 🛡️ Security best practices

> **Never expose your `vh_live_...` secret API key in client-side code.**

- Use environment variables (`VIHAYA_API_KEY` in `.env.local`).
- Keep all `events.register()` and `payments.verify()` calls server-side — Route Handlers, Server Actions, Express endpoints, or Edge Functions.
- For client-side event *display*, fetch events from your own server proxy rather than hitting the Vihaya API directly from the browser.
- For direct browser → Vihaya API calls, create a **restricted public key** scoped only to the `GET /events` endpoint.
- Always verify Razorpay signatures on the server before trusting any `payment_id`.
- Rotate keys in the [Vihaya developer dashboard](https://events.vihaya.app/profile/developer) if you suspect a leak.

---

## ❓ FAQ

### What is Vihaya?

Vihaya is an events platform for India — ticketing, registrations, payments, check-in, analytics, and attendee management for everything from college fests to corporate conferences. The platform lives at [vihaya.app](https://vihaya.app), the organiser dashboard at [events.vihaya.app](https://events.vihaya.app).

### Is `vihaya-sdk` free?

Yes. The SDK is MIT-licensed and free to use. You only pay Vihaya platform fees when you actually sell tickets.

### Does the Vihaya SDK support the Razorpay test mode?

Yes — use a test API key from the Vihaya developer dashboard and the SDK will hit the Razorpay test environment automatically.

### Can I use the Vihaya SDK in a React Native app?

For React Native and Flutter, we recommend the dedicated [`vihaya_sdk_flutter`](https://pub.dev/packages/vihaya_sdk_flutter) package or calling the Vihaya REST API directly. The JS SDK works in plain React Native but assumes `fetch` is available.

### Does the SDK support webhooks?

Webhook helpers ship in `vihaya-sdk` v1.5+. Use `vihaya.webhooks.verify(payload, signature)` to authenticate inbound Vihaya webhook events.

### How do I migrate from the old `@vihaya/client` package?

Replace `import { Client } from "@vihaya/client"` with `import { VihayaClient } from "vihaya-sdk"`. The method surface is identical.

### What TypeScript version do I need?

TypeScript 4.7+. The SDK ships its own `.d.ts` declarations.

---

## 🔎 Keywords

`vihaya` · `vihaya sdk` · `vihaya events` · `vihaya events sdk` · `vihaya api` · `vihaya javascript` · `vihaya typescript` · `vihaya nodejs` · `vihaya nextjs` · `vihaya react` · `vihaya ticketing sdk` · `vihaya registration api` · `vihaya razorpay` · `events api india` · `event management sdk` · `ticketing api` · `college fest sdk` · `hackathon registration sdk` · `conference ticketing` · `razorpay events sdk` · `vihaya official sdk` · `vihaya client library` · `vihaya-sdk` · `vihaya.app sdk` · `events.vihaya.app`

---

## 🤝 Contributing

Contributions to the Vihaya JavaScript SDK are very welcome. The project is open source and MIT-licensed.

1. Fork [Vishnu252005/vihaya-sdk](https://github.com/Vishnu252005/vihaya-sdk).
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit: `git commit -m "Add amazing feature"`.
4. Push: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

Please run `npm run lint` and `npm run build` before submitting.

### Reporting issues

Found a bug or have a feature request? Open an issue at [github.com/Vishnu252005/vihaya-sdk/issues](https://github.com/Vishnu252005/vihaya-sdk/issues).

---

## 📄 License

MIT © Vihaya. See [LICENSE](LICENSE).

---

## 💬 Support

- 📧 Email: **support@vihaya.app**
- 🌐 Website: **[vihaya.app](https://vihaya.app)**
- 🛠️ Dashboard: **[events.vihaya.app](https://events.vihaya.app)**
- 👨‍💻 Developer docs: **[events.vihaya.app/profile/developer/docs](https://events.vihaya.app/profile/developer/docs)**
- 🐛 Issues: **[github.com/Vishnu252005/vihaya-sdk/issues](https://github.com/Vishnu252005/vihaya-sdk/issues)**

Built with ❤️ by the Vihaya team.

---

### Related Vihaya SDK repositories

- **JavaScript / TypeScript:** [vihaya-sdk](https://github.com/Vishnu252005/vihaya-sdk) — *you are here*
- **Python:** [vihaya-sdk-python](https://github.com/Vishnu252005/vihaya-sdk-python)
- **Go:** [vihaya-sdk-go](https://github.com/Vishnu252005/vihaya-sdk-go)
- **Java:** [vihaya-sdk-java](https://github.com/Vishnu252005/vihaya-sdk-java)
- **Ruby:** [vihaya-sdk-ruby](https://github.com/Vishnu252005/vihaya-sdk-ruby)
- **PHP:** [vihaya-sdk-php](https://github.com/Vishnu252005/vihaya-sdk-php)
- **Flutter:** [vihaya-sdk-flutter](https://github.com/Vishnu252005/vihaya-sdk-flutter)
