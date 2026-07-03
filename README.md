# Smart Trade RDC

Smart Trade RDC is a Next.js web application for trade, customs, and tax decision support in the Goma–Gisenyi corridor and the wider DRC/Rwanda trade environment. It includes a landing experience, an estimator for import duties, an admin dashboard, and an AI-powered chatbot.

## Features

- Trade and customs information for cross-border operations
- Import duty and tax estimation tools
- Admin panel for managing products, professionals, and tax settings
- AI assistant for trade-related questions
- MongoDB-backed data storage

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
- `src/components/` — Reusable UI components such as the estimator, chatbot, navbar, and dashboard
- `src/context/` — Shared application state
- `src/lib/` — Utility helpers including MongoDB connection logic and currency formatting
- `src/models/` — Mongoose models for users, products, professionals, and tax settings
- `server.js` — Custom server setup for Next.js and Socket.IO
- `create-admin.ts` — Script to create the default admin account
- `tradeData.ts` — Static trade and incentive data used by the app

## Related Files

- `package.json` — Scripts and dependencies
- `tsconfig.json` — TypeScript configuration
- `next.config.mjs` — Next.js configuration
- `src/app/api/` — Backend API routes for auth, chat, products, professionals, taxes, and users
- `src/components/AdminPanel.tsx` — Admin dashboard UI
- `src/components/Estimator.tsx` — Duty calculator interface
- `src/components/Chatbot.tsx` — AI chatbot UI

## Notes

- The chatbot will show a fallback message if `GEMINI_API_KEY` is not configured.
- The app depends on MongoDB for user and admin data, so a valid `MONGODB_URI` is required for authentication and admin features.
