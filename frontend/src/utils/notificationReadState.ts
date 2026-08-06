import { studentIdentifiers } from './recipientTargeting';

const storageKey = (student: any) => `student_read_notifications_${studentIdentifiers(student)[0] || 'unknown'}`;
const notificationId = (notification: any) => notification.id || notification.notificationId;

const readIdsFor = (student: any): string[] => {
  try {
    const stored = localStorage.getItem(storageKey(student));
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveReadIds = (student: any, ids: string[]) => {
  const existingIds = readIdsFor(student);
  const nextIds = [...new Set(ids)];
  if (nextIds.length === existingIds.length && nextIds.every(id => existingIds.includes(id))) return;
  localStorage.setItem(storageKey(student), JSON.stringify(nextIds));
  window.dispatchEvent(new Event('student_notifications_updated'));
};

export const isNotificationRead = (notification: any, student: any) => {
  const id = notificationId(notification);
  return !!id && readIdsFor(student).includes(id);
};

export const markNotificationsRead = (notifications: any[], student: any) => {
  const ids = notifications.map(notificationId).filter(Boolean);
  if (ids.length) saveReadIds(student, [...readIdsFor(student), ...ids]);
};

export const markReviewRequestNotificationsRead = (campaignId: string | undefined, notifications: any[], student: any) => {
  if (!campaignId) return;
  markNotificationsRead(
    notifications.filter(notification => notification.type === 'review_campaign' && notification.targetId === campaignId),
    student,
  );
};
