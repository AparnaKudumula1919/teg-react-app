# TEG Events App

A complete React + TypeScript app built for the TEG coding challenge.  
Shows events for a selected venue using the provided public JSON API with defensive handling and a fallback.

## Features / Acceptance criteria met

- Uses React + TypeScript (Vite).
- Hosted-ready: instructions included for GitHub Pages / Vercel / Netlify deployment.
- Handles outage / invalid remote data by falling back to a bundled JSON (`public/event-data-fallback.json`).
- Fully responsive UI (desktop / tablet / mobile).
- Error handling for network issues, timeouts, and malformed data.
- Simple accessibility: keyboard-selectable cards, ARIA on modal.
- Code organized into `src/` with components, types, utils, and api service.
- README and instructions included.

## How to run locally

1. Ensure Node.js (18+) and npm installed.
2. Clone the repo (or extract this zip).
3. Install dependencies:

```bash
npm install
```

4. Run dev server:

```bash
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## 🧩 Project Overview

```
/
├─ public/
│  └─ fallback/event-data.json      # Fallback local data (always bundled)
├─ src/
│  ├─ api.ts                        # Fetch + mapping logic
│  ├─ App.tsx
│  ├─ components/                   # CalendarView, EventList, EventDetails
│  └─ __tests__/                    # Vitest unit tests
├─ e2e/
│  └─ playlist.spec.ts              # Playwright tests
├─ vitest.config.ts
├─ playwright.config.ts
├─ package.json
└─ README.md
```

## 🧠 Data Handling

The app loads event data from an external API defined by:
```
VITE_EVENT_DATA_URL=https://teg-coding-challenge.s3.ap-southeast-2.amazonaws.com/events/event-data.json
```
If the API fails, it automatically falls back to `public/fallback/event-data.json`.

You can configure this source in `.env`:
```
VITE_EVENT_DATA_URL=https://your-remote-source/events.json
```

---

## 🧪 Testing

### Unit (Vitest + React Testing Library)
```bash
npm run test
npm run test:watch
```

### E2E (Playwright)
```bash
npx playwright install --with-deps
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:report
```

Playwright tests use a mocked API to ensure deterministic runs.

---

## ☁️ Deploying to Vercel

### 1. Push repo to GitHub
```bash
git init
git add .
git commit -m "ready for deploy"
git push origin main
```

### 2. Import Project into Vercel
- Visit [Vercel Dashboard](https://vercel.com)
- Click **New Project → Import Git Repository**
- Confirm detected settings:
  - Framework: **Vite**
  - Build Command: `npm run build`
  - Output Directory: `dist`

### 3. Configure Environment Variable
In the Vercel dashboard, add under **Settings → Environment Variables**:

| Key | Value |
| --- | --- |
| `VITE_EVENT_DATA_URL` | `https://teg-coding-challenge.s3.ap-southeast-2.amazonaws.com/events/event-data.json` |

### 4. (Optional) Add SPA Rewrite File
Create a `vercel.json` file in project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 5. Deploy
Push changes to `main` — Vercel automatically builds and deploys.
Your app will be live at:  
👉 `https://<your-project>.vercel.app`

---

## 🛠️ Troubleshooting

- **Blank events / CORS error**: Ensure S3 bucket allows GET requests from your domain.
- **Fallback not used**: Verify `/fallback/event-data.json` exists and loads locally.
- **404 on refresh**: Ensure `vercel.json` SPA rewrite is included.

---

## 🧰 CI / Automation (Optional)

Example GitHub Action (`.github/workflows/ci.yml`):
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

Vercel automatically handles CI/CD after GitHub integration.

---

## 🔐 Security Notes

- Never include secrets in `VITE_` prefixed variables — they’re public.
- For restricted APIs, use a proxy backend or serverless function.
- HTTPS is automatically enforced by Vercel.

---

## Notes on defensive coding & missing data

- Remote fetch uses a timeout (8s) and aborts if slow.
- Remote JSON is minimally validated; if shape is unexpected, fallback to bundled JSON.
- UI displays sensible defaults when fields are missing:
  - `Untitled event`, `Location TBA`, `Date TBA`, `No description available`.
- Errors are surfaced to the user and logged in console.

## What I'd add with more time

- Better UX: filtering, pagination, calendar view option.
- Caching + stale-while-revalidate strategy for offline support.
- CI pipeline and automated deploy previews.