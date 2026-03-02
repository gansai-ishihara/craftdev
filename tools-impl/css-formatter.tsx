"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function formatCss(css: string): string {
  let result = "";
  let indent = 0;
  const indentStr = "  ";
  let i = 0;
  let inString: string | null = null;

  while (i < css.length) {
    const ch = css[i];

    // Handle string literals so we don't process characters inside them
    if (inString) {
      result += ch;
      if (ch === inString && css[i - 1] !== "\\") {
        inString = null;
      }
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      result += ch;
      i++;
      continue;
    }

    // Skip CSS comments in formatting (preserve but tidy them)
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      const comment = end === -1 ? css.slice(i) : css.slice(i, end + 2);
      result += indentStr.repeat(indent) + comment.trim() + "\n";
      i = end === -1 ? css.length : end + 2;
      continue;
    }

    if (ch === "{") {
      // Trim trailing whitespace before the brace
      result = result.replace(/\s+$/, "");
      result += " {\n";
      indent++;
      i++;
      // Skip whitespace after {
      while (i < css.length && /\s/.test(css[i])) i++;
      continue;
    }

    if (ch === "}") {
      // Trim trailing whitespace/newlines before the brace
      result = result.replace(/\s+$/, "");
      result += "\n";
      indent = Math.max(0, indent - 1);
      result += indentStr.repeat(indent) + "}\n";
      i++;
      // Skip whitespace after }
      while (i < css.length && /\s/.test(css[i])) i++;
      // Add extra newline between rule blocks at top level
      if (indent === 0 && i < css.length && css[i] !== "}") {
        result += "\n";
      }
      continue;
    }

    if (ch === ";") {
      result = result.replace(/\s+$/, "");
      result += ";\n";
      i++;
      // Skip whitespace after ;
      while (i < css.length && /\s/.test(css[i])) i++;
      // Add indent for next property if not closing
      if (i < css.length && css[i] !== "}") {
        result += indentStr.repeat(indent);
      }
      continue;
    }

    // Collapse runs of whitespace into a single space
    if (/\s/.test(ch)) {
      if (result.length > 0 && !/\s/.test(result[result.length - 1]) && result[result.length - 1] !== "\n") {
        result += " ";
      }
      i++;
      continue;
    }

    // If we're at the start of a line (after a newline), add indent
    if (result.length === 0 || result[result.length - 1] === "\n") {
      result += indentStr.repeat(indent);
    }

    result += ch;
    i++;
  }

  return result.trim() + "\n";
}

function minifyCss(css: string): string {
  let result = css;
  // Remove CSS comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse whitespace
  result = result.replace(/\s+/g, " ");
  // Remove spaces around { } : ; ,
  result = result.replace(/\s*\{\s*/g, "{");
  result = result.replace(/\s*\}\s*/g, "}");
  result = result.replace(/\s*:\s*/g, ":");
  result = result.replace(/\s*;\s*/g, ";");
  result = result.replace(/\s*,\s*/g, ",");
  // Remove trailing semicolons before }
  result = result.replace(/;}/g, "}");
  return result.trim();
}

export default function CssFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleFormat() {
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Input is empty. Please enter some CSS.");
      setOutput("");
      return;
    }
    try {
      setOutput(formatCss(trimmed));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }

  function handleMinify() {
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Input is empty. Please enter some CSS.");
      setOutput("");
      return;
    }
    try {
      setOutput(minifyCss(trimmed));
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
            placeholder="Paste your CSS here..."
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
