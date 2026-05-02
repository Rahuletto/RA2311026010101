export type NotificationType = 'Result' | 'Placement' | 'Event';

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationAPIResponse {
  notifications: Notification[];
}

export interface NotificationQueryParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | 'All';
}

export const NotificationWeightMap: Record<NotificationType, number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1,
};

export interface PriorityScore {
  notification: Notification;
  weight: number;
  recencyHours: number;
  priorityScore: number;
}

export interface PriorityInboxConfig {
  topN: number;
  filterType?: NotificationType | 'All';
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogStack = 'backend' | 'frontend';

export type LogPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';

export interface LogEntry {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
  timestamp?: string;
}

export interface LogAPIResponse {
  logID: string;
  message: string;
}

export interface NotificationReadState {
  [notificationID: string]: boolean;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: (params: NotificationQueryParams) => Promise<void>;
}

export interface UsePriorityReturn {
  priorityNotifications: PriorityScore[];
  topN: number;
  setTopN: (n: number) => void;
}

export interface UseLoggerReturn {
  log: (level: LogLevel, pkg: LogPackage, message: string) => Promise<void>;
  logging: boolean;
}
