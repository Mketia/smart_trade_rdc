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

### 4.1 Testing Strategy

Static checks (`tsc --noEmit`, `next build`) were run on every change, plus manual functional testing performed by me — I ran the app locally against the live MongoDB database and walked through each feature by hand in the browser and via direct HTTP requests (clicking through the actual navigation, submitting real forms, logging in as admin), checking the DevTools console for errors along the way rather than only reading the code diff. Testing was organized into the levels below, from isolated logic up to full acceptance.

### 4.2 Testing Levels

#### 4.2.3 Unit testing outputs

Unit-level checks exercised individual pieces of logic in isolation, before layering the UI or other modules on top:

- **Type-level units:** `npx tsc --noEmit` compiles every function signature, component prop, and model field with **0 errors**, catching type-contract mistakes at the smallest unit of code.
- **Business-logic unit trace:** the Estimator's duty calculation (`src/components/Estimator.tsx`) was hand-traced for a $1,000 beans shipment, Gisenyi→Goma, registered taxpayer, against the live tax rates (`baseDutyBeans = 0.24`, `vatDrc = 16%`, `whRegDrc = 1.5%`, `occFeeDrc = 1.5%`):
  ```
  cifValue        = 1000 × 1.05        = 1050.00
  importDutyAmount= 1050 × 0.24        = 252.00
  vatAmount       = (1050+252) × 0.16  = 208.32
  withholding     = 1050 × 0.015       = 15.75
  otherFees       = 1050×0.015 + 5     = 20.75
  totalTax        = 252+208.32+15.75+20.75 = 496.82
  totalCost       = 1000 + 496.82      = 1496.82
  ```
  This confirms the formula in the code produces the expected figure for a known input before it is ever wired to the UI.
- **Schema unit check:** `POST /api/incentives` with only `{"authority":"DRC (DGDA)"}` is rejected by the Mongoose schema in isolation, before touching any other module:
  ```
  {"message":"Error creating incentive","error":"Incentive validation failed: benefits: Path `benefits` is required., description: Path `description` is required., title: Path `title` is required."}
  ```

#### 4.2.4 Validation testing outputs

Validation testing confirmed the system rejects invalid input at both the client and server:

| Input | Expected rule | Actual response |
|---|---|---|
| Register with only an email, no name/password | All three fields required | `{"message":"Name, email, and password are required"}` |
| Register with an email already in use (`admin@smarttrade.cd`) | Reject duplicate accounts | `{"message":"User already exists"}` |
| Login with a valid email but wrong password | Reject invalid credentials | `{"message":"Invalid credentials"}` |
| Create an Incentive missing `title`/`description`/`benefits` | Reject incomplete records | Mongoose `ValidationError` listing every missing path (above) |

Client-side, the Auth form, and every Admin Panel add-form (Products, Users, Professionals, Incentives, Agencies) use HTML `required` attributes on their core fields, and the password-reset flow enforces a 6-character minimum before submission — consistent with the server-side rules they front.

#### 4.2.5 Integration testing outputs

Integration testing exercises how modules work together (frontend ↔ API ↔ database ↔ real-time layer) rather than any one in isolation. This pass surfaced one genuine, previously-undetected bug:

> **Bug found and fixed:** registering a new account crashed with `Cannot read properties of undefined (reading 'role')`. Root cause: `/api/auth/register` returned only `{message, userId}`, but `Auth.tsx` calls `onLogin(data.token, data.user)` after a successful sign-up (matching what `/api/auth/login` returns), so `page.tsx`'s `handleLogin` tried to read `.role` off an `undefined` user object. Fixed by having the register endpoint issue a JWT and return the same `{message, token, user}` shape as login. Re-tested after the fix: registration now logs the new user straight in and shows their name in the navbar.

Other integration paths verified together:

- **Admin Panel → API → MongoDB → Socket.IO → other clients:** changing the DRC VAT rate in the Admin Panel and saving it fired a live `tax_updated` Socket.IO event that a second, already-open browser tab received and displayed (`alert` message: *"Tax rates have been updated..."*), confirming the full chain from an admin's edit to a real-time push works end-to-end. The rate was reverted to its original value (16%) afterward.
- **Admin Panel → API → MongoDB:** adding a product through the Products Registry form persisted it to MongoDB and it appeared immediately in the admin's own table; deleting it removed it the same way. Test product removed afterward.
- **Admin Panel → public page (cross-session):** an incentive published as admin was immediately visible to a separate, logged-out browser session on the public Incentives Directory (see 4.2.6).

#### 4.2.6 Functional and system testing results

Full end-to-end feature checks, exercised as a real user or admin would use the deployed system:

| # | Scenario | Result | Evidence |
|---|---|---|---|
| 1 | Portal lists all 4 real tools, each linking to a working tab | Pass | [01](screenshots/01-portal-core-services.png) |
| 2 | Incentives Directory renders live DB data + eligibility checklist works | Pass — 4 DB-backed incentives | [02](screenshots/02-incentives-directory.png) |
| 3 | Recommended Agencies renders all 7 seeded agencies | Pass | [03](screenshots/03-recommended-agencies.png) |
| 4 | Professional Network no longer throws the "missing key" console warning | Pass — 0 console errors | [04](screenshots/04-professionals-directory.png) |
| 5 | Contact page shows corrected phone number; WhatsApp button links correctly | Pass — `href` confirmed `wa.me/250798263372` | [05](screenshots/05-contact-whatsapp.png) |
| 6 | Admin logs in, publishes a new incentive from the Admin Panel | Pass — appears instantly in "Published Incentives" table | [06](screenshots/06-admin-publishes-incentive.png) |
| 7 | The incentive an admin just published is immediately visible to a logged-out visitor, with no redeploy | Pass | [07](screenshots/07-public-sees-new-incentive.png) |
| 8 | Site never renders a black/dark theme, even with the OS set to dark mode | Pass, after fixing a stale build-cache regression | *(landing/portal captured under emulated dark mode)* |
| 9 | New user registration → auto-login → correct role-based landing | Pass, after fixing the bug in 4.2.5 | — |
| 10 | Admin changes a tax rate → live push to a second open tab | Pass — `tax_updated` alert received | — |
| 11 | Admin adds/removes a Product Registry entry | Pass | — |

All test data created during these passes (sample incentive, sample product, and the temporary VAT rate change) was removed/reverted afterward so it doesn't pollute the real dataset.

**Still to be walked through** (not yet covered by an executed test in this pass): Admin Users management (create/edit/delete), Admin Professionals directory CRUD, Admin Agencies delete (only publish was verified), the Estimator's full calculation across both trade directions and taxpayer-registration states, the AI Chatbot's reply behavior, and the Dashboard currency converter.

#### 4.2.7 Acceptance testing report

Measured against the system's stated goals — giving traders transparent customs-cost estimation, a real tax-incentive directory, a trusted professional/agency network, and an admin able to keep all of that content current — the system is **accepted** on the criteria actually exercised above: every core public feature renders real, database-backed content; the admin can publish content and see it reflected publicly without a redeploy; input is validated on both client and server; and a genuine registration-blocking bug was found and fixed rather than shipped.

**Conditions / open items carried forward, not blocking acceptance of what was tested:**
- The functionalities listed as "still to be walked through" above should be exercised before final sign-off.
- **Known limitation:** none of the API routes enforce server-side authentication — admin actions are only gated in the client UI, not the backend. This predates this cycle's changes and is recorded here as an honest limitation rather than omitted.

## 5. Analysis

The consistent model → route → component pattern made both new features (Incentives, Agencies) and the Admin Panel additions low-risk and quick to verify. Three genuine issues were caught by testing rather than assumed fixed: the registration bug (4.2.5), a stale Turbopack cache that briefly masked the dark-mode fix, and the React key-prop bug in the Professionals list.
