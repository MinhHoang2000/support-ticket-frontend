# Tickets API — Frontend Reference

Base URL: **`/api/v1`**  
All responses are JSON. Success responses use the shape below unless noted.

---

## Response format

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "message": "User-facing error message",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2026-02-03T12:00:00.000Z"
}
```

**Common `errorCode` values:** `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, `BAD_REQUEST`, `CONFLICT`, `INTERNAL_ERROR`, `RATE_LIMIT_EXCEEDED`, `SERVICE_UNAVAILABLE`.

---

## Authentication

- **Protected routes** (tickets, health) require:  
  `Authorization: Bearer <JWT>`
- **Auth routes** (signup, login, logout) do **not** require a token.
- After login, send the returned `token` in the `Authorization` header for all ticket and health requests.
- Logout: call `POST /auth/logout` (optionally with the current Bearer token). The client should then discard the token.

---

## Endpoints

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/health` | No | Server, DB, and Redis status |

**Response (200 OK or 503 Service Unavailable)**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 123.45,
    "environment": "development",
    "version": "v1",
    "database": "ok",
    "redis": "ok"
  },
  "message": "Server is healthy"
}
```

Use `status: "degraded"` and `database`/`redis: "error"` when DB or Redis is down (503).

---

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/signup` | No | Create account |
| `POST` | `/api/v1/auth/login` | No | Log in, get user + JWT |
| `POST` | `/api/v1/auth/logout` | No | Log out (client discards token) |

**Rate limit:** 20 requests per minute per IP for signup and login.

#### POST `/api/v1/auth/signup`

**Request body**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email |
| `password` | string | Yes | 8–128 characters |
| `firstName` | string | Yes | Max 100 characters |
| `lastName` | string | Yes | Max 100 characters |

**Responses**

- **201** – User created. `data`: `{ id, email, firstName, lastName, createdAt, updatedAt }` (no password).
- **400** – Validation error (`errorCode: VALIDATION_ERROR`).
- **409** – Email already registered (`errorCode: CONFLICT`).

#### POST `/api/v1/auth/login`

**Request body**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Responses**

- **200** – `data`: `{ user: { id, email, firstName, lastName, createdAt, updatedAt }, token: "<JWT>" }`. Use `token` in `Authorization: Bearer <token>`.
- **400** – Validation error.
- **401** – Invalid email or password.

#### POST `/api/v1/auth/logout`

No body. **200** – Logged out; client should discard the token.

---

### Tickets

All ticket endpoints require **`Authorization: Bearer <JWT>`**.  
Create-ticket and list endpoints are rate-limited (see below).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/tickets` | List tickets (paginated, filterable, sortable) |
| `GET` | `/api/v1/tickets/:id` | Get one ticket by ID |
| `POST` | `/api/v1/tickets` | Create a ticket |
| `PATCH` | `/api/v1/tickets/:id/draft` | Update AI draft (ai_reply_message) |
| `DELETE` | `/api/v1/tickets/:id` | Delete a ticket |

**Create ticket rate limit:** 20 requests per minute per IP.

#### GET `/api/v1/tickets`

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number (≥ 1) |
| `limit` | integer | 20 | Items per page: `10`, `20`, `50`, or `100` |
| `status` | string | — | Filter: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `category` | string | — | Filter by category (max 200 chars) |
| `sentiment` | integer | — | Filter by sentiment |
| `urgency` | string | — | Filter by urgency (max 200 chars) |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `title` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `search` | string | — | Full-text search in title (max 500 chars) |

**Response (200)**

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": 1,
        "title": "Login page not loading",
        "content": "...",
        "status": "OPEN",
        "category": null,
        "tag": null,
        "sentiment": null,
        "urgency": null,
        "replyMadeBy": null,
        "createdAt": "2026-02-03T12:00:00.000Z",
        "updatedAt": "2026-02-03T12:00:00.000Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "message": "Tickets retrieved successfully"
}
```

Ticket list items match DB shape; color-coding by urgency can be done on the frontend.  
**400** – Invalid `page`, `limit`, `status`, `sortBy`, `sortOrder`, or `sentiment`.

#### GET `/api/v1/tickets/:id`

**Response (200)** – Single ticket (full detail, same fields as list plus `responseDraft`, `replyMadeBy` as in schema).

**400** – Invalid ID. **404** – Ticket not found.

#### POST `/api/v1/tickets`

**Request body**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 1–255 characters |
| `content` | string | Yes | 1–50,000 characters |

**Response (201)** – `data`: created ticket (same shape as GET by id).

**400** – Validation error.

#### PATCH `/api/v1/tickets/:id/draft`

Updates only the AI draft (`ai_reply_message`) for the latest worker process for this ticket.

**Request body**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `aiReplyMessage` | string | Yes | Max 50,000 characters |

**Response (200)** – `data`: updated worker process (includes `id`, `ticketId`, `aiReplyMessage`, etc.).

**400** – Invalid ticket ID or validation error. **404** – Ticket or worker process not found.

#### DELETE `/api/v1/tickets/:id`

**Response (200)** – `data`: `{ "id": <deleted_id> }`.

**400** – Invalid ID. **404** – Ticket not found.

---

## Ticket and enum reference

**Ticket status:** `OPEN` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`  

**Reply origin:** `AI` | `HUMAN_AI` (who last produced the reply: AI only vs human-edited AI)

**Ticket object (detail)** – Fields as in list, plus:

- `responseDraft` (string | null) – AI-generated response draft (detail view).
- `replyMadeBy` (`AI` | `HUMAN_AI` | null).

---

## CORS and JSON

- CORS is enabled; frontend can call the API from a browser.
- Request/response JSON body size limit: **200kb** (covers ticket content and draft sizes).

---

## Quick checklist for frontend

1. **Base URL:** `/api/v1` (or full origin, e.g. `https://api.example.com/api/v1`).
2. **Auth:** After login, set `Authorization: Bearer <token>` on all requests to `/api/v1/tickets` and `/api/v1/health`.
3. **Errors:** Check `success === false`, use `message` and `errorCode` for UX; use HTTP status for retries/redirects (e.g. 401 → re-login).
4. **Pagination:** `GET /tickets` returns `tickets`, `total`, `page`, `limit`, `totalPages`.
5. **Validation:** Use the same constraints (lengths, enums) as in this doc to avoid 400s.
