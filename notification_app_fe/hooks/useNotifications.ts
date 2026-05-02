'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { NotificationQueryParams, UseNotificationsReturn } from '../types';
import { fetchAndValidateNotifications, fetchAndValidateNotificationsBeyond } from '../lib/api';
import { isInvalidAuthApiError } from '../lib/authSession';
import { clearEvaluationSession, logAction } from '@/app/actions';

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const fetchNotifications = useCallback(async (params: NotificationQueryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAndValidateNotifications(params);
      setNotifications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (isInvalidAuthApiError(errorMessage)) {
        await clearEvaluationSession();
        window.location.assign('/auth');
        return;
      }
      setError(errorMessage);
      await logAction('frontend', 'error', 'hook', `useNotifications: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotificationsAtLeast = useCallback(async (minCount: number) => {
    const prev = notificationsRef.current;
    if (prev.length >= minCount) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAndValidateNotificationsBeyond(prev, minCount);
      setNotifications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (isInvalidAuthApiError(errorMessage)) {
        await clearEvaluationSession();
        window.location.assign('/auth');
        return;
      }
      setError(errorMessage);
      await logAction('frontend', 'error', 'hook', `useNotifications: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    fetchNotificationsAtLeast,
  };
}
