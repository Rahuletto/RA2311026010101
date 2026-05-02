'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Notification, NotificationType } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import styles from './AllNotifications.module.css';
import NotificationItemAll from './NotificationItemAll';
import NotificationShelf from './NotificationShelf';

const FILTER_TYPES = ['All', 'Placement', 'Result', 'Event'] as const;
const ITEMS_PER_PAGE = 10;

export default function AllNotifications() {
  const { notifications, loading, error, fetchNotifications } = useNotifications();
  const [filterType, setFilterType] = useState<NotificationType | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [readState, setReadState] = useState<Record<string, boolean>>({});
  const [shelfNotification, setShelfNotification] = useState<Notification | null>(null);

  useEffect(() => {
    void fetchNotifications({ limit: 10, page: 1 });
  }, [fetchNotifications]);

  const filteredNotifications = useMemo(
    () =>
      filterType === 'All' ? notifications : notifications.filter((n) => n.Type === filterType),
    [notifications, filterType]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE)),
    [filteredNotifications.length]
  );

  const paginatedNotifications = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);

  const handleFilterChange = useCallback((type: NotificationType | 'All') => {
    setFilterType(type);
    setCurrentPage(1);
  }, []);

  const handleToggleRead = useCallback((id: string) => {
    setReadState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleOpenShelf = useCallback(
    (id: string) => {
      const n = notifications.find((x) => x.ID === id);
      if (n) {
        setShelfNotification(n);
        setReadState((prev) => ({ ...prev, [id]: true }));
      }
    },
    [notifications]
  );

  const closeShelf = useCallback(() => setShelfNotification(null), []);

  const shelfReadControls = useMemo(() => {
    if (!shelfNotification) return undefined;
    const id = shelfNotification.ID;
    return {
      isRead: readState[id] ?? false,
      onMarkRead: () => setReadState((p) => ({ ...p, [id]: true })),
      onMarkUnread: () => setReadState((p) => ({ ...p, [id]: false })),
    };
  }, [shelfNotification, readState]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Notifications</h2>
        <p className={styles.subtitle}>
          Total: {filteredNotifications.length} notifications
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          <span>Error: {error}</span>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.filterButtons}>
          {FILTER_TYPES.map((type) => (
            <button
              key={type}
              className={`${styles.filterButton} ${filterType === type ? styles.active : ''}`}
              onClick={() => handleFilterChange(type as NotificationType | 'All')}
              disabled={loading}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className={styles.empty}>
          <p>No notifications found</p>
        </div>
      ) : (
        <>
          <div className={styles.notificationsList}>
            {paginatedNotifications.map((notification) => (
              <NotificationItemAll
                key={notification.ID}
                notification={notification}
                isRead={readState[notification.ID] ?? false}
                onToggleRead={handleToggleRead}
                onOpenDetail={handleOpenShelf}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <NotificationShelf
        open={shelfNotification !== null}
        notification={shelfNotification}
        onClose={closeShelf}
        readControls={shelfReadControls}
      />
    </div>
  );
}
