'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { PriorityScore } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { usePriority } from '../hooks/usePriority';
import styles from './PriorityInbox.module.css';
import NotificationItem from './NotificationItem';
import NotificationShelf from './NotificationShelf';

const TOP_N_OPTIONS = [10, 15, 20];

export default function PriorityInbox() {
  const { notifications, loading, error, fetchNotificationsAtLeast } = useNotifications();
  const { priorityNotifications, setTopN } = usePriority(notifications, 10);
  const [selectedTopN, setSelectedTopN] = useState(10);
  const [shelfScore, setShelfScore] = useState<PriorityScore | null>(null);

  useEffect(() => {
    void fetchNotificationsAtLeast(selectedTopN);
  }, [fetchNotificationsAtLeast, selectedTopN]);

  const handleTopNChange = useCallback(
    (n: number) => {
      setSelectedTopN(n);
      setTopN(n);
    },
    [setTopN]
  );

  const openShelfById = useCallback(
    (id: string) => {
      const row = priorityNotifications.find((p) => p.notification.ID === id);
      if (row) setShelfScore(row);
    },
    [priorityNotifications]
  );

  const closeShelf = useCallback(() => setShelfScore(null), []);

  const shelfMeta = useMemo(
    () =>
      shelfScore
        ? {
            priorityScore: shelfScore.priorityScore,
            weight: shelfScore.weight,
            recencyHours: shelfScore.recencyHours,
          }
        : null,
    [shelfScore]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Priority Inbox</h2>
        <p className={styles.subtitle}>
          Top {selectedTopN} most important unread notifications
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          <span>Error: {error}</span>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.topNButtons}>
          {TOP_N_OPTIONS.map((n) => (
            <button
              key={n}
              className={`${styles.topNButton} ${selectedTopN === n ? styles.active : ''}`}
              onClick={() => handleTopNChange(n)}
              disabled={loading}
            >
              Top {n}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading priority notifications...</div>
      ) : priorityNotifications.length === 0 ? (
        <div className={styles.empty}>
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {priorityNotifications.map((item, index) => (
            <NotificationItem
              key={item.notification.ID}
              notification={item.notification}
              priority={item.priorityScore}
              weight={item.weight}
              position={index + 1}
              onOpenDetail={openShelfById}
            />
          ))}
        </div>
      )}
      <NotificationShelf
        open={shelfScore !== null}
        notification={shelfScore?.notification ?? null}
        priorityMeta={shelfMeta}
        onClose={closeShelf}
      />
    </div>
  );
}
