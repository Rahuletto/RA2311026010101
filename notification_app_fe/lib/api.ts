import type { Notification, NotificationQueryParams } from '../types';
import { fetchNotificationsAction, logAction } from '@/app/actions';

export async function fetchNotifications(
  params: NotificationQueryParams = {}
): Promise<Notification[]> {
  await logAction(
    'frontend',
    'info',
    'api',
    `Fetching notifications - limit: ${params.limit || 'default'}, page: ${params.page || 1}, type: ${params.notification_type || 'All'}`
  );

  try {
    const data = await fetchNotificationsAction(params);
    await logAction(
      'frontend',
      'info',
      'api',
      `Successfully fetched ${data.length} notifications`
    );
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
