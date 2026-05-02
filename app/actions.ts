'use server';

import type { Notification, NotificationAPIResponse, NotificationQueryParams } from '@/notification_app_fe/types';

const NOTIFICATION_API_URL = 'http://20.207.122.201/evaluation-service/notifications';
const LOG_API_URL = 'http://20.207.122.201/evaluation-service/logs';

function buildQueryString(params: NotificationQueryParams): string {
  const queryParts: string[] = [];

  if (params.limit) {
    queryParts.push(`limit=${params.limit}`);
  }
  if (params.page) {
    queryParts.push(`page=${params.page}`);
  }
  if (params.notification_type && params.notification_type !== 'All') {
    queryParts.push(`notification_type=${params.notification_type}`);
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

export async function fetchNotificationsAction(
  params: NotificationQueryParams = {},
  token: string = ''
): Promise<Notification[]> {
  const queryString = buildQueryString(params);
  const url = `${NOTIFICATION_API_URL}${queryString}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: NotificationAPIResponse = await response.json();
    return data.notifications;
  } catch (error) {
    throw error;
  }
}

export async function logAction(
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<{ logID: string; message: string } | null> {
  try {
    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}
