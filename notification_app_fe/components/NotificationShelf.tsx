"use client";

import { useEffect } from "react";
import type { Notification } from "../types";
import styles from "./NotificationShelf.module.css";

export interface ShelfPriorityMeta {
  priorityScore: number;
  weight: number;
  recencyHours: number;
}

export interface ShelfReadControls {
  isRead: boolean;
  onMarkRead: () => void;
  onMarkUnread: () => void;
}

interface NotificationShelfProps {
  open: boolean;
  notification: Notification | null;
  priorityMeta?: ShelfPriorityMeta | null;
  readControls?: ShelfReadControls;
  onClose: () => void;
}

export default function NotificationShelf({
  open,
  notification,
  priorityMeta,
  readControls,
  onClose,
}: NotificationShelfProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !notification) return null;

  const ts = new Date(notification.Timestamp);
  const freshness = priorityMeta
    ? Math.max(0, priorityMeta.priorityScore - priorityMeta.weight * 10)
    : null;

  return (
    <>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close details"
        onClick={onClose}
      />
      <aside
        className={styles.shelf}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shelf-title"
      >
        <div className={styles.shelfHeader}>
          <h2 id="shelf-title" className={styles.shelfTitle}>
            Details
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {readControls ? (
          <div className={styles.readToolbar}>
            <span className={styles.readToolbarLabel} id="shelf-read-label">
              Read status
            </span>
            <div
              className={styles.readSegmented}
              role="group"
              aria-labelledby="shelf-read-label"
            >
              <button
                type="button"
                className={`${styles.readSegBtn} ${!readControls.isRead ? styles.readSegUnreadOn : ""}`}
                aria-pressed={!readControls.isRead}
                onClick={() => {
                  readControls.onMarkUnread();
                }}
              >
                Unread
              </button>
              <button
                type="button"
                className={`${styles.readSegBtn} ${readControls.isRead ? styles.readSegReadOn : ""}`}
                aria-pressed={readControls.isRead}
                onClick={() => {
                  readControls.onMarkRead();
                }}
              >
                Read
              </button>
            </div>
          </div>
        ) : null}

        <div className={styles.shelfBody}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Type</span>
            <span className={styles.typePill}>{notification.Type}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Message</span>
            <p className={styles.description}>{notification.Message}</p>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>When</span>
            <p className={styles.fieldValue}>{ts.toLocaleString()}</p>
            <code className={styles.monoMuted}>{notification.Timestamp}</code>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>ID</span>
            <code className={styles.idBlock}>{notification.ID}</code>
          </div>

          {priorityMeta ? (
            <section className={styles.prioritySection}>
              <h3 className={styles.subheading}>Priority (inbox)</h3>
              <p className={styles.formulaHint}>
                Score = (type weight × 10) + freshness. Freshness is up to 100 for a just-posted
                item, and drops about one point per hour. Placement weight 3 → up to ~130; Result 2 →
                ~120; Event 1 → ~110 when new. Values like 108 or 110 mean a fairly new Event or a
                slightly older Placement/Result.
              </p>
              <ul className={styles.stats}>
                <li>
                  <strong>Score</strong> {priorityMeta.priorityScore.toFixed(1)}
                </li>
                <li>
                  <strong>Type weight</strong> {priorityMeta.weight} (contributes{" "}
                  {priorityMeta.weight * 10})
                </li>
                <li>
                  <strong>Age</strong> {priorityMeta.recencyHours.toFixed(1)} h since timestamp
                </li>
                {freshness !== null ? (
                  <li>
                    <strong>Freshness term</strong> ~{freshness.toFixed(1)} (remainder of score)
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}
