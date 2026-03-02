"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type IndentStyle = "2" | "4" | "tab";

function getIndentString(style: IndentStyle): string {
  switch (style) {
    case "2":
      return "  ";
    case "4":
      return "    ";
    case "tab":
      return "\t";
  }
}

function formatHtml(html: string, indentStyle: IndentStyle): string {
  const indent = getIndentString(indentStyle);
  const tokens = html.match(/(<[^>]+>|[^<]+)/g);
  if (!tokens) return html;

  let level = 0;
  const lines: string[] = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    // Check if it's a tag
    if (trimmed.startsWith("<")) {
      // Comment
      if (trimmed.startsWith("<!")) {
        lines.push(indent.repeat(level) + trimmed);
        continue;
      }

      // Processing instruction
      if (trimmed.startsWith("<?")) {
        lines.push(indent.repeat(level) + trimmed);
        continue;
      }

      // Closing tag
      if (trimmed.startsWith("</")) {
        level = Math.max(0, level - 1);
        lines.push(indent.repeat(level) + trimmed);
        continue;
      }

      // Extract the tag name
      const tagNameMatch = trimmed.match(/^<(\w[\w-]*)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : "";

      // Self-closing tag (explicit /> or void element)
      const isSelfClosing = trimmed.endsWith("/>") || VOID_ELEMENTS.has(tagName);

      lines.push(indent.repeat(level) + trimmed);

      if (!isSelfClosing) {
        level++;
      }
    } else {
      // Text content
      const text = trimmed;
      if (text) {
        lines.push(indent.repeat(level) + text);
      }
    }
  }

  return lines.join("\n");
}

function minifyHtml(html: string): string {
  let result = html;
  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  // Collapse whitespace
  result = result.replace(/\s+/g, " ");
  // Remove whitespace between tags
  result = result.replace(/>\s+</g, "><");
  return result.trim();
}

export default function HtmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentStyle, setIndentStyle] = useState<IndentStyle>("2");

  function handleFormat() {
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Input is empty. Please enter some HTML.");
      setOutput("");
      return;
    }
    try {
      setOutput(formatHtml(trimmed, indentStyle));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }

  function handleMinify() {
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Input is empty. Please enter some HTML.");
      setOutput("");
      return;
    }
    try {
      setOutput(minifyHtml(trimmed));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
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

  const indentOptions: { value: IndentStyle; label: string }[] = [
    { value: "2", label: "2 spaces" },
    { value: "4", label: "4 spaces" },
    { value: "tab", label: "Tab" },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="rounded-md border border-border bg-surface-light px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-surface"
        >
          Minify
        </button>

        {/* Indent toggle buttons */}
        <div className="ml-2 flex rounded-md border border-border">
          {indentOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setIndentStyle(opt.value)}
              className={`px-3 py-2 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
                indentStyle === opt.value
                  ? "bg-accent text-black"
                  : "bg-surface-light text-gray-400 hover:text-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
            placeholder="Paste your HTML here..."
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
