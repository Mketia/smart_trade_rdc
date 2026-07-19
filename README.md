# Smart Trade RDC

Smart Trade RDC is a Next.js web application for trade, customs, and tax decision support in the Goma–Gisenyi corridor and the wider DRC/Rwanda trade environment. It includes a marketing/landing experience, a customs cost estimator, a tax incentives directory, a professional and clearing-agency network, an admin dashboard, and an AI-powered chatbot — all backed by MongoDB with real-time updates via Socket.IO.

## Features

### Public-facing site

- **Landing page & Portal overview** — introduces the platform and links to every tool below.
- **Customs Cost Estimator** — calculates import duties, VAT, withholding tax, and administrative fees for cargo crossing the Goma–Gisenyi border, in either direction, with automatic EAC Simplified Trade Regime (STR) duty-free detection based on cargo value and product eligibility.
- **Tax Incentives & Exemptions Directory** — browsable, searchable, filterable catalog of DRC/Rwanda/EAC tax incentives, stored in and served from MongoDB (not hardcoded), plus an interactive eligibility checklist per incentive.
- **Professional Network Directory** — searchable directory of verified customs agents and logistics companies, filterable by type, with one-click email/call actions.
- **Recommended Clearing Agencies** — DB-backed directory of trusted agences en douane (customs clearing agencies) operating at the Goma-Gisenyi corridor.
- **Dashboard** — live usage stats, border-crossing status, and a quick currency converter (USD/RWF/CDF) with live exchange rate reference table.
- **Contact page** — contact form plus direct email, phone, and office details.
- **WhatsApp quick-contact button** — floating site-wide button that opens a WhatsApp chat with the support line.
- **AI chatbot assistant** — floating widget (Gemini-powered) that answers trade, tax, and customs questions.
- **Authentication** — email/password login and registration, JWT-based sessions persisted client-side.

### Admin panel (`/dashboard`, admin role only)

- Tax rate configuration (duties by product, VAT, withholding tax, handling fees) with real-time push to connected clients via Socket.IO.
- Products registry: create/delete importable product definitions (HS code, category, base duty rate, STR eligibility).
- Users management: create, edit, and delete user accounts and roles.
- Professionals directory management: create/delete customs agents and logistics companies.
- Tax incentives management: publish/delete incentives shown in the public Incentives Directory.
- Clearing agencies management: add/delete recommended agencies shown in the public Agencies page.

### Data & infrastructure

- MongoDB-backed persistence for users, products, professionals, tax settings, incentives, and clearing agencies (via Mongoose models).
- Socket.IO real-time sync for tax-rate updates across connected clients.
- Custom Node/Express-style server (`server.js`) hosting both Next.js and Socket.IO.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- A Gemini API key (optional, but required for the chatbot to work)

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd smart_trade_rdc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a environment file named `.env.local` in the project root and add the following values:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/smart_trade_rdc
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

   If you are using MongoDB Atlas, replace the value of `MONGODB_URI` with your connection string.

4. If MongoDB is running locally, make sure it is started before launching the app.

## Running the Application

### Development mode

Run the app with:

```bash
npm run dev
```

Then open your browser at:

```text
http://localhost:3000
```

### Create the initial admin account

After the app is running, create the default admin user with:

```bash
npx tsx create-admin.ts
```

Use the following login details:

- Email: `admin@smarttrade.cd`
- Password: `admin123`

### Production build

To build the app for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

On Windows PowerShell, you can also start the production server manually with:

```powershell
$env:NODE_ENV='production'
node server.js
```

## Project Structure

Here are the main folders and files in this project:

- `src/app/` — Next.js app routes and API endpoints
- `src/components/` — Reusable UI components such as the estimator, incentives directory, professional/agency directories, chatbot, WhatsApp button, navbar, and dashboard
- `src/context/` — Shared application state
- `src/lib/` — Utility helpers including MongoDB connection logic and currency formatting
- `src/models/` — Mongoose models for users, products, professionals, tax settings, incentives, and agencies
- `server.js` — Custom server setup for Next.js and Socket.IO
- `create-admin.ts` — Script to create the default admin account

## Related Files

- `package.json` — Scripts and dependencies
- `tsconfig.json` — TypeScript configuration
- `next.config.mjs` — Next.js configuration
- `src/app/api/` — Backend API routes for auth, chat, products, professionals, taxes, users, incentives, and agencies
- `src/components/AdminPanel.tsx` — Admin dashboard UI (rates, products, users, professionals, incentives, agencies)
- `src/components/Estimator.tsx` — Duty calculator interface
- `src/components/Incentives.tsx` — Tax incentives directory (DB-backed)
- `src/components/Professionals.tsx` — Professional network directory
- `src/components/Agencies.tsx` — Recommended clearing agencies directory
- `src/components/Chatbot.tsx` — AI chatbot UI
- `src/components/WhatsAppButton.tsx` — Floating WhatsApp contact button

## Notes

- The chatbot will show a fallback message if `GEMINI_API_KEY` is not configured.
- The app depends on MongoDB for user and admin data, so a valid `MONGODB_URI` is required for authentication and admin features.

## Further Documentation

- [`docs/system-implementation-and-testing.md`](docs/system-implementation-and-testing.md) — detailed write-up of the implementation process, tools/technologies used, and how each feature was tested, with screenshots and source code excerpts.
