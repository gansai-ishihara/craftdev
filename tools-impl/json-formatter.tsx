"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const SAMPLE_JSON = JSON.stringify(
  {
    name: "CraftDev Tools",
    version: "1.0.0",
    description: "A collection of developer utilities",
    features: ["JSON Formatter", "Base64 Encoder", "URL Encoder"],
    settings: {
      theme: "dark",
      indentSize: 2,
      autoValidate: true,
    },
    stats: {
      users: 12500,
      tools: 10,
      rating: 4.8,
    },
  },
  null,
  2
);

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function parseInput(): unknown {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error("Input is empty. Please enter some JSON.");
    }
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : String(e);
      // Try to extract position information from the error message
      const posMatch = msg.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const before = trimmed.slice(0, pos);
        const line = before.split("\n").length;
        const lastNewline = before.lastIndexOf("\n");
        const col = pos - (lastNewline === -1 ? 0 : lastNewline + 1) + 1;
        throw new Error(`Invalid JSON at line ${line}, column ${col}: ${msg}`);
      }
      throw new Error(`Invalid JSON: ${msg}`);
    }
  }

  function handleFormat() {
    setError(null);
    try {
      const parsed = parseInput();
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }

  function handleMinify() {
    setError(null);
    try {
      const parsed = parseInput();
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }

  function handleValidate() {
    setError(null);
    try {
      parseInput();
      setOutput("Valid JSON");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }

  function handleLoadSample() {
    setError(null);
    setInput(SAMPLE_JSON);
    setOutput("");
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: some browsers block clipboard in insecure contexts
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleFormat}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
        >
          Validate
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-md border border-border bg-surface-light px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-surface"
        >
          Load Sample
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-md border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Split panes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-400">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            spellCheck={false}
            className={`h-80 w-full resize-y rounded-lg border bg-surface-light p-4 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:border-accent ${
              error ? "border-red-500" : "border-border"
            }`}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">Output</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:text-accent disabled:opacity-40 disabled:hover:text-gray-400"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            spellCheck={false}
            className="h-80 w-full resize-y rounded-lg border border-border bg-surface-light p-4 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
