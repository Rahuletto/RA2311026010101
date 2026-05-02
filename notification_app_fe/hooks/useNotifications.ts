'use client';

import { useState, useCallback } from 'react';
import type { Notification, NotificationQueryParams, UseNotificationsReturn } from '../types';
import { fetchAndValidateNotifications } from '../lib/api';
import { logAction } from '@/app/actions';

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (params: NotificationQueryParams = {}) => {
      setLoading(true);
      setError(null);

      try {
        await logAction('frontend', 'debug', 'hook', 'useNotifications: Fetching started');
        const data = await fetchAndValidateNotifications(params);
        setNotifications(data);
        await logAction('frontend', 'debug', 'hook', `useNotifications: Successfully fetched ${data.length} notifications`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        await logAction('frontend', 'error', 'hook', `useNotifications: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
  };
}
