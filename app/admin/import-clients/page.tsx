// app/admin/import-clients/page.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Download,
  X,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ParsedRow {
  full_name: string;
  email: string;
  phone: string;
  _valid: boolean;
  _error?: string;
}

interface ImportResult {
  email: string;
  full_name: string;
  status: 'created' | 'updated' | 'skipped' | 'failed';
  reason?: string;
}

interface ImportSummary {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
}

export default function ImportClientsPage() {
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [onExisting, setOnExisting] = useState<'skip' | 'update'>('skip');
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV
  const parseCsv = (text: string): ParsedRow[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    // Skip header row (assume first line is header)
    const dataLines = lines.slice(1);

    return dataLines
      .filter((l) => l.trim())
      .map((line) => {
        // Naive CSV split — handles basic comma-separated values
        // (Not quoted fields with commas — fine for our simple use case)
        const parts = line.split(',').map((p) => p.trim());
        const full_name = parts[0] || '';
        const email = (parts[1] || '').toLowerCase();
        const phone = parts[2] || '';

        const errors: string[] = [];
        if (!full_name) errors.push('missing name');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          errors.push('invalid email');

        return {
          full_name,
          email,
          phone,
          _valid: errors.length === 0,
          _error: errors.length > 0 ? errors.join(', ') : undefined,
        };
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a .csv file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File too large. Maximum 2 MB.');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || '';
      setCsvText(text);
      const parsed = parseCsv(text);
      if (parsed.length === 0) {
        setError('No valid rows found. Make sure the first row is a header.');
      } else if (parsed.length > 500) {
        setError(`Too many rows (${parsed.length}). Maximum is 500.`);
        setParsedRows([]);
      } else {
        setParsedRows(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const validRows = parsedRows.filter((r) => r._valid);
    if (validRows.length === 0) {
      setError('No valid rows to import');
      return;
    }

    if (!confirm(`Import ${validRows.length} client${validRows.length !== 1 ? 's' : ''}? This will create accounts and send invitation emails.`))
      return;

    setImporting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/import-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: validRows.map((r) => ({
            full_name: r.full_name,
            email: r.email,
            phone: r.phone,
          })),
          onExisting,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setSummary(data.summary);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setCsvText('');
    setParsedRows([]);
    setFileName('');
    setSummary(null);
    setResults([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csv = 'full_name,email,phone\nJohn Kamau,john@example.com,0712345678\nJane Wanjiku,jane@example.com,+254722333444\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mima-client-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedRows.filter((r) => r._valid).length;
  const invalidCount = parsedRows.filter((r) => !r._valid).length;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Upload className="text-[#1e3a8a]" size={28} />
          Import Clients
        </h1>
        <p className="text-gray-600">
          Bulk-create client accounts from a CSV file. New users will receive a
          password reset email to set up their account.
        </p>
      </div>

      {/* Instructions */}
      {!summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">
                CSV Format
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Your CSV file should have the following columns (in this exact order):
              </p>
              <div className="bg-white rounded-lg p-3 font-mono text-xs text-gray-700 overflow-x-auto">
                full_name,email,phone
                <br />
                John Kamau,john@example.com,0712345678
                <br />
                Jane Wanjiku,jane@example.com,+254722333444
              </div>
              <ul className="mt-3 space-y-1 text-xs text-blue-800">
                <li>• <strong>full_name</strong> (required) — full client name</li>
                <li>• <strong>email</strong> (required) — must be unique</li>
                <li>• <strong>phone</strong> (optional) — with or without country code</li>
                <li>• Maximum 500 rows per import</li>
              </ul>
              <button
                onClick={downloadTemplate}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                <Download size={14} />
                Download CSV template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Success summary */}
      {summary && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-lg font-bold text-green-900">
                Import Complete
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatCard label="Total" value={summary.total} color="gray" />
              <StatCard label="Created" value={summary.created} color="green" />
              <StatCard label="Updated" value={summary.updated} color="blue" />
              <StatCard label="Skipped" value={summary.skipped} color="yellow" />
              <StatCard label="Failed" value={summary.failed} color="red" />
            </div>
          </div>

          {/* Detailed results */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Detailed Results</h3>
              <button
                onClick={reset}
                className="text-sm font-semibold text-[#1e3a8a] hover:text-[#1e40af]"
              >
                Import Another File
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-2 text-gray-700">{r.email}</td>
                      <td className="px-4 py-2 text-gray-700">{r.full_name}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            r.status === 'created'
                              ? 'bg-green-100 text-green-700'
                              : r.status === 'updated'
                              ? 'bg-blue-100 text-blue-700'
                              : r.status === 'skipped'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {r.status}
                        </span>
                        {r.reason && (
                          <span className="ml-2 text-xs text-gray-500 italic">
                            {r.reason}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Upload flow */}
      {!summary && (
        <>
          {/* File picker */}
          {!fileName && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-[#1e3a8a] transition cursor-pointer bg-white"
            >
              <Upload className="text-gray-400 mx-auto mb-3" size={48} />
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                Click to upload CSV
              </h3>
              <p className="text-sm text-gray-500">
                Maximum 500 rows · 2 MB file size limit
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Preview */}
          {fileName && parsedRows.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#1e3a8a]" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">{fileName}</div>
                    <div className="text-xs text-gray-500">
                      {parsedRows.length} rows ·{' '}
                      <span className="text-green-600 font-medium">{validCount} valid</span>
                      {invalidCount > 0 && (
                        <>
                          {' · '}
                          <span className="text-red-600 font-medium">
                            {invalidCount} invalid
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="text-gray-400 hover:text-red-600 transition"
                  title="Remove file"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Options */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  What should we do with existing clients?
                </h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      checked={onExisting === 'skip'}
                      onChange={() => setOnExisting('skip')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Skip them</div>
                      <div className="text-xs text-gray-500">
                        Clients who already have an account will be left unchanged
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      checked={onExisting === 'update'}
                      onChange={() => setOnExisting('update')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Update their details</div>
                      <div className="text-xs text-gray-500">
                        Overwrite name and phone with values from the CSV
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview table */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Preview</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.map((r, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-100 ${
                            !r._valid ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-4 py-2">{r.full_name || '—'}</td>
                          <td className="px-4 py-2 text-gray-600">{r.email || '—'}</td>
                          <td className="px-4 py-2 text-gray-600">{r.phone || '—'}</td>
                          <td className="px-4 py-2">
                            {r._valid ? (
                              <span className="text-xs text-green-600 font-semibold">
                                ✓ Valid
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 font-semibold">
                                ✕ {r._error}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import button */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={reset}
                  disabled={importing}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || validCount === 0}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-full transition shadow-lg"
                >
                  {importing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Import {validCount} Client{validCount !== 1 ? 's' : ''}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'gray' | 'green' | 'blue' | 'yellow' | 'red';
}) {
  const colors = {
    gray: 'bg-gray-100 text-gray-900',
    green: 'bg-green-100 text-green-900',
    blue: 'bg-blue-100 text-blue-900',
    yellow: 'bg-yellow-100 text-yellow-900',
    red: 'bg-red-100 text-red-900',
  };
  return (
    <div className={`rounded-xl p-3 ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
    </div>
  );
}