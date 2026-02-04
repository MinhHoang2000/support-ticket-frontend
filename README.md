# Tickets — Frontend

Web frontend for the Tickets support system. Users can sign up, sign in, create and manage their support tickets. Agents and admins get a dedicated dashboard to list, filter, and resolve tickets with AI-assisted drafts.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Ant Design** — UI components
- **TanStack React Query** — server state and caching
- **Axios** — API client
- **Sonner** — toasts

## Prerequisites

- Node.js 18+
- Yarn (or npm / pnpm)
- Backend API running and reachable (see [Environment](#environment))

## Getting started

### Install

```bash
yarn install
# or: npm install
```

### Environment

Create a `.env.local` in the project root (optional):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Full API base URL (e.g. `https://api.example.com/api/v1`). If unset, the app uses same-origin `/api/v1`. |

### Run

```bash
yarn dev
```

Open [http://localhost:8080](http://localhost:8080).

### Build & start

```bash
yarn build
yarn start
```

### Lint

```bash
yarn lint
```

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Sign-in, sign-up (public)
│   ├── (protected)/        # Authenticated routes
│   │   ├── agent/          # Agent/admin: tickets list, detail, resolve
│   │   └── tickets/       # User: my tickets, create, detail
│   ├── globals.css
│   └── layout.tsx
├── components/             # Shared UI and layout
│   ├── ui/                 # Reusable inputs, pagination, etc.
│   └── ...
├── contexts/               # Auth context
├── lib/                    # API client, auth, tickets API, filters
├── providers/              # Ant Design, React Query
└── types/                  # Shared TypeScript types
```

## Features

- **Auth** — Sign up, sign in, sign out; JWT stored and sent as `Authorization: Bearer <token>`.
- **User** — List “my tickets”, create ticket, view ticket detail, close/delete own tickets. Response visible when status is `RESOLVED` or `CLOSED`.
- **Agent/Admin** — List all tickets with filters (status, category, sentiment, urgency, search), pagination, sort; view full ticket; edit AI draft; resolve ticket (copy draft to response).

## API

The app talks to a backend at `/api/v1` (or `NEXT_PUBLIC_API_URL`). See [docs/API.md](docs/API.md) for endpoints, auth, and response shapes.

## Deploy

Build with `yarn build` and run with `yarn start`, or use [Vercel](https://vercel.com) (or any Node host). Set `NEXT_PUBLIC_API_URL` in the deployment environment to point at your API.
