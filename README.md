# task

Next.js app that hosts the campus notification UI: a priority inbox and a full notifications list, backed by the evaluation service API described in `notification_system_design.md`.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript

Most of the notification UI sits in one module next to the app routes; the landing view only switches between the priority inbox and the full list.

## Run it locally

Install dependencies once:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Other package managers work too (`pnpm dev`, `yarn dev`, `bun dev`) if you prefer.

## Scripts

- `npm run dev`: development server with hot reload
- `npm run build`: production build
- `npm run start`: production server (run after `build`)
- `npm run lint`: ESLint with the Next config

## Configuration

Point the app at your real API base URL and auth as your environment expects. The design doc lists example query params and response shapes for notifications; swap in env vars for anything that should not be hardcoded.

## Deploy

Build with `npm run build` and host like any Node Next app (Vercel, your own server, etc.). See https://nextjs.org/docs/app/building-your-application/deploying for Next-specific deployment notes.

## Docs

For scoring, logging, and API details, read `notification_system_design.md`.
