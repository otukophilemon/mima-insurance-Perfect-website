// lib/dateRange.ts

/**
 * Filter an array of objects by a date field within a range.
 * Returns the original array if no range is set.
 *
 * @param items    Array to filter
 * @param dateKey  Key holding the ISO date string
 * @param from     Start date (inclusive), 'YYYY-MM-DD' or ''
 * @param to       End date (inclusive), 'YYYY-MM-DD' or ''
 */
export function filterByDateRange<T extends Record<string, any>>(
  items: T[],
  dateKey: keyof T,
  from: string,
  to: string
): T[] {
  if (!from && !to) return items;

  // Convert from/to to comparable timestamps
  const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity;
  const toTs = to ? new Date(`${to}T23:59:59.999`).getTime() : Infinity;

  return items.filter((item) => {
    const value = item[dateKey];
    if (!value) return false;
    const ts = new Date(value as string).getTime();
    return ts >= fromTs && ts <= toTs;
  });
}

/**
 * Format a Date or ISO string to 'YYYY-MM-DD' for HTML date inputs.
 */
export function toDateInputValue(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the first day of the current month.
 */
export function startOfMonth(): string {
  const now = new Date();
  return toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
}

/**
 * Get today.
 */
export function today(): string {
  return toDateInputValue(new Date());
}