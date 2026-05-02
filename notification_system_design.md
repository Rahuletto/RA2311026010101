# Notification system design

This doc describes how the campus notification UI is supposed to work: placements, events, and results, with a priority view on top of the same API.

## What it does

Users see updates from an evaluation service. The app can show everything with paging and filters, or a shorter priority inbox of the most important unread items. Interactions and API calls are logged so you can trace behavior in staging or production.

## Data flow

1. Load notifications with `GET /evaluation-service/notifications` and query params for limit, page, and optional type.
2. On the client, assign each row a priority score from its type and age.
3. Render either the full list (with paging) or the priority inbox (top N unread after sort).
4. Log fetches, filters, errors, and meaningful UI actions.

## Shape of a notification

Roughly:

```typescript
interface Notification {
  ID: string; // UUID
  Type: "Result" | "Placement" | "Event";
  Message: string;
  Timestamp: string; // ISO datetime
}
```

## Priority scoring

Types get fixed weights: Placement 3, Result 2, Event 1 (placement matters most).

Score formula:

```
priorityScore = (weight * 10) + recencyScore
```

`recencyScore` is basically how many hours ago `Timestamp` was. Older rows get a smaller bump, so fresh items float up within the same type.

Sort descending by `priorityScore`. The inbox shows the top N rows (N is something like 10, 15, or 20 and should match whatever limit the user picked).

## Frontend layout

The shell switches between two views: priority inbox and all notifications. Navigation toggles that mode.

All notifications loads pages from the API, lets you filter by type, tracks read and unread on the client, and should stay usable on small screens.

Priority inbox applies the sort, shows only the top N unread, and reuses the same filtering ideas as the full list where that helps.

Exact component names in the repo might drift from early mocks; treat this section as the behavior we care about, not a file checklist.

## Logging

Use a small helper along the lines of `Log(stack, level, package, message)`:

- API calls: `stack=frontend`, `level=info`, `package=api`
- Mount / lifecycle noise: `level=debug`, `package=component`
- Filter or pagination changes: `level=info`, `package=state`
- Failures: `level=error`, `package=component`
- Important clicks or navigation: `level=info`, `package=page`

Do not log tokens, passwords, or raw PII. Enough detail to debug status codes and flow is enough.

## Performance notes

Sorting is O(n) over the current page or fetched set. No need to poll forever; refetch on mount, when filters change, or when the user changes page. If lists get huge later, you could move sorting server-side or use a heap; for typical campus volumes this is fine.

## API

**Base URL (example):** `GET http://20.207.122.201/evaluation-service/notifications`

**Query:**

- `limit`: page size (10 / 15 / 20 or whatever you agree with backend)
- `page`: 1-based page index
- `notification_type`: optional filter (Event, Result, or Placement)

**Body shape (typical):**

```json
{
  "notifications": [
    {
      "ID": "uuid",
      "Type": "Result",
      "Message": "string",
      "Timestamp": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

Real deployments should use HTTPS and env-based URLs; the IP above is illustrative.

## UX expectations

Placements should read as more urgent than results or events (weighting handles ranking; styling can reinforce it). Read vs unread should be obvious (weight, opacity, or icon). Show type and time clearly. On errors, show a short message and a way to retry instead of a blank screen.

## State

Lists, filters, current page, and read/unread flags live in the browser. Read/unread can persist in `localStorage` until the backend grows a real read model. The notification API stays stateless from the client's perspective aside from auth.

## Auth

Calls expect a valid Bearer token from your registration/auth flow. Guard routes that load notifications the same way you guard the rest of the app.

## Keeping this doc honest

Last touched during frontend stage work. When you rename components or change the URL, update this file in the same PR so newcomers are not chasing ghosts.
