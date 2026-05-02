import type { Notification, NotificationQueryParams } from '../types';
import { fetchNotificationsAction, logAction } from '@/app/actions';

export const NOTIFICATIONS_PAGE_SIZE = 10;

export async function fetchNotifications(
  params: NotificationQueryParams = {}
): Promise<Notification[]> {
  try {
    const data = await fetchNotificationsAction(params);
    return data;
  } catch (e) {
    await logAction('frontend', 'error', 'api', `Fetch failed: ${e instanceof Error ? e.message : String(e)}`);
    throw e instanceof Error ? e : new Error('Failed to fetch notifications');
  }
}

export function validateNotification(notification: any): notification is Notification {
  return (
    notification &&
    typeof notification.ID === 'string' &&
    ['Result', 'Placement', 'Event'].includes(notification.Type) &&
    typeof notification.Message === 'string' &&
    typeof notification.Timestamp === 'string'
  );
}

export async function fetchAndValidateNotifications(
  params: NotificationQueryParams = {}
): Promise<Notification[]> {
  const notifications = await fetchNotifications(params);

  const validated = notifications.filter((n) => {
    return validateNotification(n);
  });

  return validated;
}

/**
 * Loads enough pages (10 per request) to reach `minCount` items, or until the API returns a short page.
 */
export async function fetchAndValidateNotificationsUpTo(
  minCount: number
): Promise<Notification[]> {
  return fetchAndValidateNotificationsBeyond([], minCount);
}

/**
 * Appends pages after `existing` until there are at least `minCount` notifications (deduped by ID).
 */
export async function fetchAndValidateNotificationsBeyond(
  existing: Notification[],
  minCount: number
): Promise<Notification[]> {
  const perPage = NOTIFICATIONS_PAGE_SIZE;
  const target = Math.max(0, Math.ceil(minCount));
  const merged: Notification[] = [...existing];
  const seen = new Set(existing.map((n) => n.ID));
  let page = Math.floor(existing.length / perPage) + 1;
  const maxPages = 30;

  if (merged.length >= target) return merged;

  while (merged.length < target && page <= maxPages) {
    const batch = await fetchNotifications({ limit: perPage, page });
    const validated = batch.filter(validateNotification);

    for (const n of validated) {
      if (!seen.has(n.ID)) {
        seen.add(n.ID);
        merged.push(n);
        if (merged.length >= target) break;
      }
    }

    if (validated.length < perPage) break;
    page++;
  }

  return merged;
}
