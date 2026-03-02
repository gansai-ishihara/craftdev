"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleEncodeComponent() {
    setError("");
    try {
      setOutput(encodeURIComponent(input));
    } catch {
      setError("Failed to encode input.");
    }
  }

  function handleEncodeURI() {
    setError("");
    try {
      setOutput(encodeURI(input));
    } catch {
      setError("Failed to encode input.");
    }
  }

  function handleDecode() {
    setError("");
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setError("Invalid encoded string. Make sure the input is a valid percent-encoded string.");
    }
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEncodeComponent}
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Encode Component
        </button>
        <button
          onClick={handleEncodeURI}
          className="rounded-lg border border-border bg-surface px-4 py-2 font-semibold text-accent transition-colors hover:bg-surface-light"
        >
          Encode URI
        </button>
        <button
          onClick={handleDecode}
          className="rounded-lg border border-border bg-surface px-4 py-2 font-semibold text-accent transition-colors hover:bg-surface-light"
        >
          Decode
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Split pane */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or encoded string..."
            className="h-64 w-full resize-y rounded-lg border border-border bg-surface p-4 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:border-accent"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">Output</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-gray-400 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              title="Copy output"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-64 w-full resize-y rounded-lg border border-border bg-surface p-4 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
