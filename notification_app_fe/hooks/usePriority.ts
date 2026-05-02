'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Notification, UsePriorityReturn } from '../types';
import { getTopNByType } from '../lib/priorityCalculator';

export function usePriority(
  notifications: Notification[],
  initialTopN: number = 10
): UsePriorityReturn {
  const [topN, setTopN] = useState(initialTopN);

  const priorityNotifications = useMemo(() => {
    try {
      return getTopNByType(notifications, 'All', topN);
    } catch {
      return [];
    }
  }, [notifications, topN]);

  const handleSetTopN = useCallback((n: number) => {
    setTopN(n);
  }, []);

  return {
    priorityNotifications,
    topN: topN,
    setTopN: handleSetTopN,
  };
}
