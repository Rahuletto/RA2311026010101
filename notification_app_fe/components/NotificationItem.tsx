'use client';

import type { Notification } from '../types';
import { memo, useCallback } from 'react';
import styles from './NotificationItem.module.css';

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
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <p className={styles.message}>{notification.Message}</p>

      <div className={styles.line}>
        <div className={styles.lineStart}>
          <span className={styles.tag}>{notification.Type}</span>
          <span className={styles.dim}>·</span>
          <span className={styles.rank} title="Inbox order">
            {position}
          </span>
          <span className={styles.dim}>·</span>
          <time className={styles.date} dateTime={notification.Timestamp}>
            {formattedTime}
          </time>
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          Score {priority.toFixed(2)}
          <span className={styles.dim}> · </span>
          Weight {weight}
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
