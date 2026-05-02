import type { Notification, NotificationQueryParams } from '../types';
import { fetchNotificationsAction, logAction } from '@/app/actions';

function getAccessToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return localStorage.getItem('accessToken') || '';
}

export async function fetchNotifications(
  params: NotificationQueryParams = {}
): Promise<Notification[]> {
  await logAction(
    'frontend',
    'info',
    'api',
    `Fetching notifications - limit: ${params.limit || 'default'}, page: ${params.page || 1}, type: ${params.notification_type || 'All'}`
  );

  const token = getAccessToken();
  
  if (!token) {
    await logAction('frontend', 'error', 'api', 'No access token available - 401 Unauthorized');
    throw new Error('Authentication required. Please log in.');
  }

  const data = await fetchNotificationsAction(params, token);

  await logAction(
    'frontend',
    'info',
    'api',
    `Successfully fetched ${data.length} notifications`
  );

  return data;
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
