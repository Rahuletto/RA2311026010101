import type { Notification, PriorityScore, NotificationType } from '../types';
import { NotificationWeightMap } from '../types';

function getRecencyHours(timestamp: string): number {
  try {
    const notificationTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    const diffMs = currentTime - notificationTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(0, diffHours);
  } catch {
    return 0;
  }
}

export function calculatePriorityScore(notification: Notification): PriorityScore {
  const weight = NotificationWeightMap[notification.Type];
  const recencyHours = getRecencyHours(notification.Timestamp);
  const recencyScore = Math.max(0, 100 - recencyHours);
  const priorityScore = weight * 10 + recencyScore;

  return {
    notification,
    weight,
    recencyHours,
    priorityScore,
  };
}

export function getTopNNotifications(
  notifications: Notification[],
  topN: number = 10
): PriorityScore[] {
  const scored = notifications.map(calculatePriorityScore);
  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  return scored.slice(0, topN);
}

export function getTopNByType(
  notifications: Notification[],
  type: NotificationType | 'All',
  topN: number = 10
): PriorityScore[] {
  let filtered = notifications;

  if (type !== 'All') {
    filtered = notifications.filter((n) => n.Type === type);
  }

  return getTopNNotifications(filtered, topN);
}

export function getNotificationWeight(type: NotificationType): number {
  return NotificationWeightMap[type];
}
