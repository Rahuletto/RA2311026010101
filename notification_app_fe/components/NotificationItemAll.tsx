'use client';

import type { Notification } from '../types';
import { memo, useCallback, type MouseEvent } from 'react';
import { MdCheck, MdCircle } from 'react-icons/md';
import styles from './NotificationCard.module.css';

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

  const toggleRead = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onToggleRead(notification.ID);
    },
    [onToggleRead, notification.ID]
  );

  return (
    <div
      className={`${styles.item} ${styles.itemWithToggle} ${isRead ? styles.read : styles.unread} ${onOpenDetail ? styles.itemInteractive : ''}`}
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
      tabIndex={onOpenDetail ? 0 : undefined}
      aria-label={
        isRead
          ? `Read: ${notification.Type}. ${notification.Message.slice(0, 120)}`
          : `Unread: ${notification.Type}. ${notification.Message.slice(0, 120)}`
      }
    >
      <button
        type="button"
        className={styles.readToggleBtn}
        onClick={toggleRead}
        title={isRead ? 'Mark unread' : 'Mark read'}
        aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
        aria-pressed={isRead}
      >
        {isRead ? (
          <MdCheck className={styles.iconRead} aria-hidden />
        ) : (
          <MdCircle className={styles.iconUnread} aria-hidden />
        )}
      </button>

      <p className={styles.message}>{notification.Message}</p>

      <div className={styles.meta}>
        <span className={styles.tag}>{notification.Type}</span>
        <span className={styles.sep} aria-hidden>
          ·
        </span>
        <time className={styles.date} dateTime={notification.Timestamp}>
          {formattedTime}
        </time>
      </div>

      <div className={`${styles.footer} ${styles.footerIdOnly}`}>
        <code className={styles.mono} title={notification.ID}>
          {notification.ID}
        </code>
      </div>
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
