'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Notification, PriorityScore, NotificationType, UsePriorityReturn } from '../types';
import { getTopNByType } from '../lib/priorityCalculator';
import { logAction } from '@/app/actions';

export function usePriority(
  notifications: Notification[],
  initialTopN: number = 10
): UsePriorityReturn {
  const [topN, setTopN] = useState(initialTopN);
  const [filterType, setFilterType] = useState<NotificationType | 'All'>('All');

  const priorityNotifications = useMemo(() => {
    try {
      const result = getTopNByType(notifications, filterType, topN);
      return result;
    } catch (error) {
      return [];
    }
  }, [notifications, topN, filterType]);

  useEffect(() => {
    logAction('frontend', 'debug', 'hook', `usePriority: Calculating priority for ${notifications.length} notifications, topN: ${topN}, type: ${filterType}`);
    logAction('frontend', 'info', 'state', `Priority recalculated: ${priorityNotifications.length} notifications in top ${topN}`);
  }, [notifications, topN, filterType, priorityNotifications]);

  const handleSetTopN = useCallback((n: number) => {
    logAction('frontend', 'info', 'state', `Priority inbox limit changed: ${topN} -> ${n}`);
    setTopN(n);
  }, [topN]);

  const handleSetFilterType = useCallback((type: NotificationType | 'All') => {
    logAction('frontend', 'info', 'state', `Filter changed to: ${type}`);
    setFilterType(type);
  }, []);

  return {
    priorityNotifications,
    topN: topN,
    setTopN: handleSetTopN,
  };
}
