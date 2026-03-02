"use client";

import { useState, useMemo } from "react";

interface MatchResult {
  fullMatch: string;
  index: number;
  groups: string[];
}

const FLAG_OPTIONS = [
  { flag: "g", label: "g", description: "Global" },
  { flag: "i", label: "i", description: "Case Insensitive" },
  { flag: "m", label: "m", description: "Multiline" },
  { flag: "s", label: "s", description: "DotAll" },
  { flag: "u", label: "u", description: "Unicode" },
] as const;

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [testString, setTestString] = useState("");

  const toggleFlag = (flag: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) {
        next.delete(flag);
      } else {
        next.add(flag);
      }
      return next;
    });
  };

  const flagString = FLAG_OPTIONS.map((f) => f.flag)
    .filter((f) => flags.has(f))
    .join("");

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, highlighted: testString };
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flagString);
    } catch (e) {
      return {
        matches: [],
        error: e instanceof Error ? e.message : "Invalid regular expression",
        highlighted: testString,
      };
    }

    const results: MatchResult[] = [];

    if (flags.has("g")) {
      let match: RegExpExecArray | null;
      regex.lastIndex = 0;
      while ((match = regex.exec(testString)) !== null) {
        results.push({
          fullMatch: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        // Handle zero-length matches to avoid infinite loop
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        results.push({
          fullMatch: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    // Build highlighted string as an array of segments
    let highlightedText = testString;
    if (results.length > 0) {
      const segments: string[] = [];
      let lastEnd = 0;

      for (const m of results) {
        const start = m.index;
        const end = start + m.fullMatch.length;
        if (start > lastEnd) {
          segments.push(escapeHtml(testString.slice(lastEnd, start)));
        }
        segments.push(
          `<mark class="bg-accent/30 text-accent rounded-sm">${escapeHtml(m.fullMatch)}</mark>`
        );
        lastEnd = end;
      }
      if (lastEnd < testString.length) {
        segments.push(escapeHtml(testString.slice(lastEnd)));
      }
      highlightedText = segments.join("");
    } else {
      highlightedText = escapeHtml(testString);
    }

    return { matches: results, error: null, highlighted: highlightedText };
  }, [pattern, flagString, testString, flags]);

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Pattern
        </label>
        <div className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 font-mono">
          <span className="text-gray-500">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="enter regex pattern"
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-600"
            spellCheck={false}
          />
          <span className="text-gray-500">/</span>
          <span className="text-accent">{flagString}</span>
        </div>
      </div>

      {/* Flag Toggle Buttons */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <label className="mb-3 block text-sm font-medium text-gray-300">
          Flags
        </label>
        <div className="flex flex-wrap gap-2">
          {FLAG_OPTIONS.map(({ flag, description }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`rounded-md px-3 py-1.5 font-mono text-sm font-medium transition-colors ${
                flags.has(flag)
                  ? "bg-accent text-black"
                  : "border border-border text-gray-400 hover:border-gray-500 hover:text-gray-300"
              }`}
            >
              {flag}{" "}
              <span
                className={`font-sans text-xs ${flags.has(flag) ? "text-black/70" : "text-gray-500"}`}
              >
                {description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter test string..."
          rows={6}
          className="w-full rounded-md border border-border bg-background p-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-accent"
          spellCheck={false}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Highlighted Results */}
      {testString && !error && (
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Highlighted Matches
            </label>
            <span className="text-sm text-gray-400">
              {matches.length} match{matches.length !== 1 ? "es" : ""} found
            </span>
          </div>
          <pre
            className="whitespace-pre-wrap break-words rounded-md border border-border bg-background p-3 font-mono text-sm text-white"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {/* Capture Groups */}
      {matches.length > 0 && matches.some((m) => m.groups.length > 0) && (
        <div className="rounded-lg border border-border bg-surface p-6">
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Capture Groups
          </label>
          <div className="space-y-3">
            {matches.map((m, mi) => (
              <div key={mi}>
                {m.groups.length > 0 && (
                  <div className="rounded-md border border-border bg-background p-3">
                    <div className="mb-2 text-xs text-gray-400">
                      Match {mi + 1}:{" "}
                      <span className="font-mono text-accent">
                        {m.fullMatch}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {m.groups.map((group, gi) => (
                        <div
                          key={gi}
                          className="flex gap-3 font-mono text-sm"
                        >
                          <span className="text-gray-500">
                            Group {gi + 1}:
                          </span>
                          <span className="text-accent">
                            {group ?? "undefined"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Details */}
      {matches.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-6">
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Match Details
          </label>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
              >
                <span className="text-gray-500">#{i + 1}</span>
                <span className="text-accent">{m.fullMatch}</span>
                <span className="text-gray-500">
                  index: {m.index}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
