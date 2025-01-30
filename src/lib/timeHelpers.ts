import moment from 'moment-timezone';

export function parseDateTime(dateStr: string, timeStr: string, timezone: string): Date {
  const dateTimeStr = `${dateStr} ${timeStr}`;
  const momentDate = moment.tz(dateTimeStr, 'YYYY-MM-DD HH:mm', timezone);
  return momentDate.toDate();
}

export function convertTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
  const momentDate = moment.tz(date, fromTimezone).tz(toTimezone);
  return momentDate.toDate();
}

export function formatDateTime(date: Date, timezone: string): string {
  return moment.tz(date, timezone).format('YYYY-MM-DD HH:mm');
}