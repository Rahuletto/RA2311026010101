'use client';

import type { Notification } from '../types';
import { memo, useCallback, type MouseEvent } from 'react';
import styles from './NotificationItemAll.module.css';

export interface NotificationItemAllProps {
  notification: Notification;
  isRead: boolean;
  onToggleRead: (id: string) => void;
  onOpenDetail?: (id: string) => void;
}

function NotificationItemAllInner({
  notification,
  isRead,
  onToggleRead,
  onOpenDetail,
}: NotificationItemAllProps) {
  const timestamp = new Date(notification.Timestamp);
  const formattedTime = timestamp.toLocaleString();

  const activate = useCallback(() => {
    onOpenDetail?.(notification.ID);
  }, [onOpenDetail, notification.ID]);

  const markRead = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!isRead) onToggleRead(notification.ID);
    },
    [isRead, onToggleRead, notification.ID]
  );

  const markUnread = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isRead) onToggleRead(notification.ID);
    },
    [isRead, onToggleRead, notification.ID]
  );

  return (
    <div
      className={`${styles.item} ${isRead ? styles.read : styles.unread} ${onOpenDetail ? styles.itemInteractive : ''}`}
      data-type={notification.Type}
      data-state={isRead ? 'read' : 'unread'}
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
      aria-label={
        isRead
          ? `Read notification: ${notification.Type}. ${notification.Message.slice(0, 120)}`
          : `Unread notification: ${notification.Type}. ${notification.Message.slice(0, 120)}`
      }
    >
      <p className={styles.message}>{notification.Message}</p>

      <div
        className={styles.statusRow}
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <span className={styles.statusLabel}>Read status</span>
        <div className={styles.segmented} role="group" aria-label="Mark read or unread">
          <button
            type="button"
            className={`${styles.segBtn} ${!isRead ? styles.segUnreadOn : ''}`}
            aria-pressed={!isRead}
            onClick={markUnread}
          >
            Unread
          </button>
          <button
            type="button"
            className={`${styles.segBtn} ${isRead ? styles.segReadOn : ''}`}
            aria-pressed={isRead}
            onClick={markRead}
          >
            Read
          </button>
        </div>
      </div>

      <div className={styles.line}>
        <div className={styles.lineStart}>
          {!isRead ? (
            <span className={styles.newMark}>New</span>
          ) : (
            <span className={styles.openedMark}>Opened</span>
          )}
          <span className={styles.tag}>{notification.Type}</span>
          <span className={styles.dim}>·</span>
          <time className={styles.date} dateTime={notification.Timestamp}>
            {formattedTime}
          </time>
        </div>
      </div>

      <code className={styles.mono} title={notification.ID}>
        {notification.ID}
      </code>
    </div>
  );
}

function propsEqual(prev: NotificationItemAllProps, next: NotificationItemAllProps) {
  return (
    prev.notification === next.notification &&
    prev.isRead === next.isRead &&
    prev.onToggleRead === next.onToggleRead &&
    prev.onOpenDetail === next.onOpenDetail
  );
}

const NotificationItemAll = memo(NotificationItemAllInner, propsEqual);
export default NotificationItemAll;
