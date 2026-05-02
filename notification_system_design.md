# Notification System Design

## Overview
Campus notification platform displaying real-time updates for Placements, Events, and Results with intelligent priority sorting.

## Architecture

### Data Flow
1. **Fetch**: GET `/evaluation-service/notifications` with query params (limit, page, notification_type)
2. **Process**: Calculate priority score based on notification type and recency
3. **Display**: Two views - All Notifications and Priority Inbox
4. **Track**: Log all user interactions and API calls

### Notification Data Model
```typescript
Notification {
  ID: string (UUID)
  Type: "Result" | "Placement" | "Event"
  Message: string
  Timestamp: ISO datetime string
}
```

## Priority Algorithm

### Weight Assignment
- **Placement**: Weight = 3 (highest priority)
- **Result**: Weight = 2 (medium priority)
- **Event**: Weight = 1 (lower priority)

### Priority Score Calculation
```
Priority Score = (Weight × 10) + Recency Score
Recency Score = (Current Time - Notification Timestamp) in hours (older = lower score)
```

### Sorting
- Notifications sorted by Priority Score (descending)
- Top n notifications displayed (user configurable: 10, 15, 20)

## Frontend Implementation

### Pages
1. **All Notifications Page**
   - Display all notifications with pagination
   - Filter by notification type (Event, Result, Placement, All)
   - Mark notifications as read/unread
   - Responsive design (desktop + mobile)

2. **Priority Inbox Page**
   - Display top n most important unread notifications
   - Configurable limit (10, 15, 20)
   - Same filtering options as All Notifications
   - Visual distinction between read and unread

### Components
- **NotificationList**: Renders list of notifications
- **NotificationItem**: Individual notification display
- **FilterControls**: Type and limit filters
- **PaginationControls**: Page navigation
- **PriorityInbox**: Priority-sorted view

### Features
- Real-time notification fetching
- Client-side priority calculation
- Read/unread state management
- Responsive UI (vanilla CSS/Material UI)
- Comprehensive logging integration
- Error handling and fallbacks

## Logging Strategy

### Log Points
- **API Fetch**: stack=frontend, level=info, package=api
- **Component Mount**: stack=frontend, level=debug, package=component
- **Filter Changes**: stack=frontend, level=info, package=state
- **Error Events**: stack=frontend, level=error, package=component
- **User Actions**: stack=frontend, level=info, package=page

### Logging Format
```typescript
Log(stack, level, package, message)
// Example:
Log("frontend", "info", "api", "Fetching notifications - limit: 10, page: 1")
Log("frontend", "debug", "component", "PriorityInbox component mounted")
Log("frontend", "error", "component", "Failed to fetch notifications - Error: 500")
```

## Efficiency Considerations

### Top N Maintenance
- Single pass through sorted array O(n)
- Memory efficient - only store displayed notifications
- Recalculate on new data fetch (not continuous polling)

### Performance
- Client-side sorting (avoiding database queries)
- Pagination for large datasets
- Lazy loading consideration for future expansion

## API Integration

### Notification API
**Endpoint**: `GET http://20.207.122.201/evaluation-service/notifications`

**Query Parameters**:
- `limit`: Number of notifications per page (10, 15, 20)
- `page`: Page number for pagination (1-indexed)
- `notification_type`: Filter by type (Event, Result, Placement)

**Response**:
```json
{
  "notifications": [
    {
      "ID": "uuid",
      "Type": "Result|Placement|Event",
      "Message": "string",
      "Timestamp": "ISO datetime"
    }
  ]
}
```

## UI/UX Guidelines

### Visual Hierarchy
- Placement notifications prominently displayed
- Read/unread distinction (bold vs normal)
- Clear timestamp and type indicators

### Responsiveness
- Mobile: Single column layout, simplified controls
- Tablet: Two column option
- Desktop: Full feature set

### Error Handling
- Graceful degradation on API failure
- User-friendly error messages
- Retry mechanisms

## State Management

### Local State
- Current notifications list
- Filter selections (type, limit)
- Current page number
- Read/unread status (client-side only)

### No Backend State
- All state managed on frontend
- Read/unread status stored in localStorage
- Stateless API calls

## Security & Constraints

### API Protection
- Requires valid Bearer token from registration
- Protected route validation

### Logging
- No sensitive data in logs
- All actions properly tracked
- Error details logged for debugging

## Maintenance Strategy

### New Notifications
- Fetch on component mount
- Refresh on user action (filter change, pagination)
- No continuous polling (efficient)

### Top N Algorithm
- Recalculate on each fetch
- O(n) complexity - suitable for most datasets
- Could be optimized with heap for larger sets

---

**Last Updated**: Stage 2 Frontend Development
**Status**: Implementation Ready
