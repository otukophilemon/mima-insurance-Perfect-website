// lib/csv.ts

/**
 * Export an array of objects to a CSV file and trigger a download.
 *
 * @param rows      Array of objects
 * @param filename  Download filename (with or without .csv)
 * @param headers   Optional: ordered list of { key, label } to control columns.
 *                  If omitted, uses all object keys in order.
 */
export function exportToCSV<T extends Record<string, any>>(
  rows: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
): void {
  if (rows.length === 0) {
    alert('No data to export.');
    return;
  }

  const cols = headers || Object.keys(rows[0]).map((k) => ({ key: k as keyof T, label: k }));

  // Build CSV lines
  const lines: string[] = [];
  lines.push(cols.map((c) => escapeCSV(c.label)).join(','));

  for (const row of rows) {
    const values = cols.map((c) => {
      const val = row[c.key];
      return escapeCSV(formatCell(val));
    });
    lines.push(values.join(','));
  }

  const csv = lines.join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format a value for CSV output.
 */
function formatCell(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    // Dates → ISO, other objects → JSON
    if (value instanceof Date) return value.toISOString();
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Escape a CSV cell value: wrap in quotes if it contains comma, quote, or newline.
 */
function escapeCSV(value: string): string {
  if (value === '') return '';
  const needsQuotes = /[",\r\n]/.test(value);
  if (!needsQuotes) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Format an ISO date string for display in CSV.
 */
export function formatDateForCSV(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}