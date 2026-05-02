'use client';

import type { Notification } from '../types';
import { memo, useCallback } from 'react';
import styles from './NotificationCard.module.css';

export interface NotificationItemProps {
  notification: Notification;
  priority: number;
  weight: number;
  position: number;
  onOpenDetail?: (id: string) => void;
}

function NotificationItemInner({
  notification,
  priority,
  weight,
  position,
  onOpenDetail,
}: NotificationItemProps) {
  const timestamp = new Date(notification.Timestamp);
  const formattedTime = timestamp.toLocaleString();

  const activate = useCallback(() => {
    onOpenDetail?.(notification.ID);
  }, [onOpenDetail, notification.ID]);

  return (
    <div
      className={`${styles.item} ${onOpenDetail ? styles.itemInteractive : ''}`}
      data-type={notification.Type}
      onClick={onOpenDetail ? activate : undefined}
      onKeyDown={
        onOpenDetail
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
              }
            }
          : undefined
      }
      tabIndex={onOpenDetail ? 0 : undefined}
      aria-label={`Priority ${position}: ${notification.Type}. ${notification.Message.slice(0, 100)}`}
    >
      <p className={styles.message}>{notification.Message}</p>

      <div className={styles.meta}>
        <span className={styles.tag}>{notification.Type}</span>
        <span className={styles.sep} aria-hidden>
          ·
        </span>
        <span className={styles.rank} title="Inbox order">
          #{position}
        </span>
        <span className={styles.sep} aria-hidden>
          ·
        </span>
        <time className={styles.date} dateTime={notification.Timestamp}>
          {formattedTime}
        </time>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerStats}>
          {priority.toFixed(2)} pts · W{weight}
        </span>
        <code className={styles.mono}>{notification.ID.substring(0, 8)}…</code>
      </div>
    </div>
  );
}

function propsEqual(prev: NotificationItemProps, next: NotificationItemProps) {
  return (
    prev.notification === next.notification &&
    prev.priority === next.priority &&
    prev.weight === next.weight &&
    prev.position === next.position &&
    prev.onOpenDetail === next.onOpenDetail
  );
}

const NotificationItem = memo(NotificationItemInner, propsEqual);
export default NotificationItem;
