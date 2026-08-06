export const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
export const KOREAN_WEEKDAYS_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * Convert Date object to YYYYMMDD string (e.g. "20260801")
 */
export function formatToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Convert Date object to YYYY-MM-DD string for input[type="date"]
 */
export function formatToInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYYMMDD or YYYY-MM-DD to Date object
 */
export function parseYMDToDate(ymd: string): Date {
  const cleaned = ymd.replace(/-/g, '');
  if (cleaned.length !== 8) return new Date();
  const y = parseInt(cleaned.slice(0, 4), 10);
  const m = parseInt(cleaned.slice(4, 6), 10) - 1;
  const d = parseInt(cleaned.slice(6, 8), 10);
  return new Date(y, m, d);
}

/**
 * Format Date to readable Korean format: "2026년 8월 1일 (토)"
 */
export function formatKoreanDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayOfWeek = KOREAN_WEEKDAYS[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayOfWeek})`;
}

/**
 * Format Date to long Korean format: "2026년 8월 1일 토요일"
 */
export function formatKoreanDateLong(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayOfWeek = KOREAN_WEEKDAYS_FULL[date.getDay()];
  return `${y}년 ${m}월 ${d}일 ${dayOfWeek}`;
}

/**
 * Get Array of Dates for the week containing the target date (Mon - Sun)
 */
export function getWeekDates(targetDate: Date): Date[] {
  const current = new Date(targetDate);
  const day = current.getDay();
  // In JS, Sunday is 0, Monday is 1...
  // Calculate difference to Monday
  const diffToMon = day === 0 ? -6 : 1 - day;

  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMon);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
}

/**
 * Add or subtract days
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if two dates are the same year, month, day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
