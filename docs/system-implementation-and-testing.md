# System Implementation & Testing

## 1. Overview

SmartTrade RDC is a full-stack web application giving cross-border traders and investors in the Goma–Gisenyi corridor (DRC/Rwanda) transparent, real-time information on customs duties, tax incentives, and trusted trade-facilitation contacts, plus an admin panel for managing that data. This document summarizes how it was built, the tools used, and how each part was verified.

## 2. Tools & Technologies

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 | Pages, client components, API routes, and styling in one codebase |
| Backend | Next.js Route Handlers (`src/app/api/**/route.ts`) | REST endpoints for every resource |
| Database | MongoDB + Mongoose | Persistence for users, products, professionals, tax settings, incentives, agencies |
| Real-time | Socket.IO (`server.js`) | Pushes admin updates (e.g. tax rates) to all connected clients live |
| Auth | JWT + bcrypt | Login sessions and password hashing; `role` field (`admin` / `corporate` / `small_trader`) gates the Admin Panel |
| AI | Google Gemini API | Floating chatbot assistant |
| Testing tools | `tsc --noEmit`, `next build`, manual browser testing (Chrome DevTools console) | Static type/build checks plus hands-on functional testing of the live application |

## 3. Implementation

### 3.1 Architecture

Every feature follows the same three-layer pattern: **Mongoose model → REST route handler (`GET`/`POST`/`DELETE`) → React component that fetches on mount**. Example, the incentives feature added this cycle:

```ts
// src/models/Incentive.ts
const IncentiveSchema = new mongoose.Schema({
  title: String, authority: String, description: String,
  benefits: String, requirements: [String],
}, { timestamps: true });
```

```ts
// src/app/api/incentives/route.ts — auto-seeds on first empty read
export async function GET() {
  await connectToDatabase();
  let incentives = await Incentive.find({}).sort({ createdAt: 1 });
  if (incentives.length === 0) incentives = await Incentive.insertMany(SEED_INCENTIVES);
  return NextResponse.json({ incentives });
}
```

```tsx
// src/components/Incentives.tsx — replaced a hardcoded array with a live fetch
useEffect(() => {
  fetch('/api/incentives').then(r => r.json()).then(d => setIncentives(d.incentives || []));
}, []);
```

The same pattern (model → route → component) was used to add the **Recommended Clearing Agencies** feature, seeded with the real agences en douane at the corridor (Agence en Douane Continental, CCI, Uhuru Clearing, Volcano Clearing, BRAD, Kivu Clearing, Kivu Swift Clearing).

### 3.2 Admin Panel — the admin's duties in the system

`AdminPanel.tsx` (rendered at `/dashboard`, gated to `role === 'admin'`) is the operator console for the whole platform. From it, an admin:

- **Sets tax rates** (duties by product, VAT, withholding, handling fees) — pushed live to every connected browser via Socket.IO.
- **Manages the Products Registry** — add/remove importable products (HS code, category, base duty, STR eligibility).
- **Manages Users** — create accounts, edit name/email/role, delete accounts.
- **Manages the Professional Network** — add/remove customs agents and logistics companies.
- **Publishes Tax Incentives** — add/remove entries in the public Incentives Directory (new this cycle).
- **Manages Clearing Agencies** — add/remove entries in the public Agencies directory (new this cycle).

Each of these is a thin form + table bound to its resource's REST route, following the same `fetch` → `setState` → optimistic update pattern, so admin edits are reflected immediately both in the panel and (on next load) to public visitors.

### 3.3 Other changes this cycle

- **Portal content alignment** — the Portal's "Core Platform Services" only listed 2 of the 4 real tools; extended to list all four (Estimator, Incentives, Professional Network, Clearing Agencies).
- **WhatsApp contact button** — floating, site-wide, links to `https://wa.me/250798263372`.
- **Contact page phone number** — corrected to `+250 798 263 372` as a `tel:` link.
- **Dark-mode removed site-wide** — `dark:` was gated on OS `prefers-color-scheme` with no opt-out, making parts of the site render black/near-black; now gated behind a `.dark` class that is never applied, and a few hardcoded near-black banners were recolored to the brand palette.
- **Bug fix** — `Professionals.tsx` keyed its list on a field (`prof.id`) that doesn't exist on the model, causing a React "missing key" warning; fixed to key on `prof._id`.

## 4. Testing

**Method:** static checks (`tsc --noEmit`, `next build`) on every change, plus manual functional testing performed by me — I ran the app locally against the live MongoDB database and walked through each feature by hand in the browser (clicking through the actual navigation, submitting real forms, logging in as admin), checking the DevTools console for errors along the way rather than only reading the code diff.

| # | Scenario | Result | Evidence |
|---|---|---|---|
| 1 | Portal lists all 4 real tools, each linking to a working tab | Pass | [01](screenshots/01-portal-core-services.png) |
| 2 | Incentives Directory renders live DB data + eligibility checklist works | Pass — 4 DB-backed incentives | [02](screenshots/02-incentives-directory.png) |
| 3 | Recommended Agencies renders all 7 seeded agencies | Pass | [03](screenshots/03-recommended-agencies.png) |
| 4 | Professional Network no longer throws the "missing key" console warning | Pass — 0 console errors | [04](screenshots/04-professionals-directory.png) |
| 5 | Contact page shows corrected phone number; WhatsApp button links correctly | Pass — `href` confirmed `wa.me/250798263372` | [05](screenshots/05-contact-whatsapp.png) |
| 6 | **Admin duty:** admin logs in, publishes a new incentive from the Admin Panel | Pass — appears instantly in "Published Incentives" table | [06](screenshots/06-admin-publishes-incentive.png) |
| 7 | **Admin duty, end-to-end:** the incentive an admin just published is immediately visible to a logged-out visitor on the public Incentives Directory, with no redeploy | Pass | [07](screenshots/07-public-sees-new-incentive.png) |
| 8 | Site never renders a black/dark theme, even with the OS set to dark mode | Pass, after fixing a stale build-cache regression (see below) | *(landing/portal captured under emulated dark mode)* |

Test data created for scenario 6–7 (the sample incentive) was deleted afterward using the Admin Panel's delete action so it doesn't pollute the real dataset.

## 5. Other Functionalities Still to Be Tested

The scenarios above cover the changes made this cycle. The following existing functionalities have not yet been walked through in this testing pass and are left here as an explicit to-do list:

| # | Functionality | What to check |
|---|---|---|
| 9 | Login / Registration | A new user can register, log in, and is redirected correctly based on role (`admin` vs `corporate`/`small_trader`) |
| 10 | Admin: Tax Rate configuration | Saving new rates in the Admin Panel updates the Estimator's calculations and pushes live to a second open tab via Socket.IO |
| 11 | Admin: Products Registry | Adding/deleting a product in the Admin Panel is reflected in the Estimator's product dropdown and the Portal's product showcase |
| 12 | Admin: Users management | Creating, editing, and deleting a user account works end-to-end, including role changes |
| 13 | Admin: Professionals directory | Adding/deleting a professional from the Admin Panel is reflected on the public Professional Network page |
| 14 | Admin: Agencies directory (add/delete) | Only "publish" was tested this cycle; deleting an agency from the Admin Panel and confirming it disappears from the public Agencies page still needs checking |
| 15 | Customs Cost Estimator | Full duty/VAT/withholding calculation for both directions (Goma→Gisenyi and Gisenyi→Goma) and for a registered vs. non-registered taxpayer |
| 16 | AI Chatbot | Sending a question and receiving a real Gemini-powered reply (and the fallback message when `GEMINI_API_KEY` is missing) |
| 17 | Dashboard currency converter | Converting between USD, RWF, and CDF returns the expected values and the swap button works |

## 6. Analysis

The consistent model → route → component pattern made both new features (Incentives, Agencies) and the Admin Panel additions low-risk and quick to verify. Two genuine issues were caught by testing rather than assumed fixed: a stale Turbopack cache that briefly masked the dark-mode fix, and the React key-prop bug in the Professionals list.

**Known limitation:** none of the API routes enforce server-side authentication — admin actions are only gated in the client UI, not on the backend. This predates this cycle's changes and is noted here as an honest limitation rather than omitted.
