"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface ConversionResult {
  utc: string;
  iso: string;
  local: string;
  unixSeconds: number;
  unixMilliseconds: number;
}

function formatResult(date: Date): ConversionResult {
  return {
    utc: date.toUTCString(),
    iso: date.toISOString(),
    local: date.toLocaleString(),
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMilliseconds: date.getTime(),
  };
}

function ResultDisplay({
  result,
  onCopy,
}: {
  result: ConversionResult;
  onCopy: (text: string) => void;
}) {
  const rows = [
    { label: "UTC", value: result.utc },
    { label: "ISO 8601", value: result.iso },
    { label: "Local", value: result.local },
    { label: "Unix (s)", value: String(result.unixSeconds) },
    { label: "Unix (ms)", value: String(result.unixMilliseconds) },
  ];

  return (
    <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface p-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4"
        >
          <span className="shrink-0 text-sm font-medium text-gray-400">
            {row.label}
          </span>
          <div className="flex items-center gap-2">
            <span className="break-all font-mono text-sm text-gray-200">
              {row.value}
            </span>
            <button
              onClick={() => onCopy(row.value)}
              className="shrink-0 text-gray-400 transition-colors hover:text-accent"
              title={`Copy ${row.label}`}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TimestampTool() {
  const [now, setNow] = useState<number>(Date.now());
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsResult, setTsResult] = useState<ConversionResult | null>(null);
  const [dateResult, setDateResult] = useState<ConversionResult | null>(null);
  const [tsError, setTsError] = useState("");
  const [dateError, setDateError] = useState("");
  const [copied, setCopied] = useState(false);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentUnix = Math.floor(now / 1000);
  const currentIso = new Date(now).toISOString();

  function handleCopyLive() {
    navigator.clipboard.writeText(String(currentUnix)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleCopyValue(text: string) {
    navigator.clipboard.writeText(text);
  }

  function handleTimestampToDate() {
    setTsError("");
    setTsResult(null);

    const trimmed = timestampInput.trim();
    if (!trimmed) {
      setTsError("Please enter a Unix timestamp.");
      return;
    }

    const num = Number(trimmed);
    if (isNaN(num) || !isFinite(num)) {
      setTsError("Invalid timestamp. Please enter a numeric value.");
      return;
    }

    // Auto-detect seconds (10 digits) vs milliseconds (13 digits)
    const digits = trimmed.replace(/^-/, "").length;
    const ms = digits <= 10 ? num * 1000 : num;

    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setTsError("Invalid timestamp. Could not parse the value as a date.");
      return;
    }

    setTsResult(formatResult(date));
  }

  function handleDateToTimestamp() {
    setDateError("");
    setDateResult(null);

    if (!dateInput) {
      setDateError("Please select a date and time.");
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setDateError("Invalid date. Could not parse the selected value.");
      return;
    }

    setDateResult(formatResult(date));
  }

  return (
    <div className="space-y-6">
      {/* Live clock */}
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-3xl font-bold text-accent">
            {currentUnix}
          </span>
          <button
            onClick={handleCopyLive}
            className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:text-accent"
            title="Copy current timestamp"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 font-mono text-sm text-gray-400">{currentIso}</p>
      </div>

      {/* Converter sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Timestamp -> Date */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">
            Timestamp &rarr; Date
          </h3>
          <input
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTimestampToDate()}
            placeholder="e.g. 1700000000 or 1700000000000"
            className="w-full rounded-lg border border-border bg-surface p-3 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:border-accent"
            spellCheck={false}
          />
          <button
            onClick={handleTimestampToDate}
            className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-black transition-colors hover:bg-accent-hover"
          >
            Convert to Date
          </button>
          {tsError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {tsError}
            </div>
          )}
          {tsResult && (
            <ResultDisplay result={tsResult} onCopy={handleCopyValue} />
          )}
        </div>

        {/* Date -> Timestamp */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">
            Date &rarr; Timestamp
          </h3>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDateToTimestamp()}
            className="w-full rounded-lg border border-border bg-surface p-3 font-mono text-sm text-gray-200 outline-none transition-colors [color-scheme:dark] focus:border-accent"
          />
          <button
            onClick={handleDateToTimestamp}
            className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-black transition-colors hover:bg-accent-hover"
          >
            Convert to Timestamp
          </button>
          {dateError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {dateError}
            </div>
          )}
          {dateResult && (
            <ResultDisplay result={dateResult} onCopy={handleCopyValue} />
          )}
        </div>
      </div>
    </div>
  );
}
