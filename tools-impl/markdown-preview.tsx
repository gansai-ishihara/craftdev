"use client";

import { useState, useMemo } from "react";
import { marked } from "marked";
import { Copy, Check } from "lucide-react";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const DEFAULT_MARKDOWN = `# Markdown Previewer

## Getting Started

This is a **real-time** markdown previewer. Type in the editor on the left and see the rendered output on the right.

### Features

- **Bold** and *italic* text
- Ordered and unordered lists
- Code blocks with syntax highlighting
- Blockquotes
- Tables
- And much more!

### Code Example

Inline code: \`const greeting = "Hello, world!";\`

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

### Table

| Feature       | Status    | Priority |
|---------------|-----------|----------|
| Markdown      | Done      | High     |
| Live Preview  | Done      | High     |
| Copy HTML     | Done      | Medium   |
| Dark Theme    | Done      | Low      |

### Links

Visit [Markdown Guide](https://www.markdownguide.org) for more syntax help.

---

*Start editing to see the magic happen!*
`;

export default function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    return marked.parse(markdown) as string;
  }, [markdown]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-gray-400">Editor</h3>
          <h3 className="text-sm font-medium text-gray-400">Preview</h3>
        </div>
        <button
          onClick={handleCopyHtml}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-accent transition-colors hover:bg-surface-light"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy HTML
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Editor Pane */}
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="h-[500px] w-full resize-none rounded-lg border border-border bg-surface p-4 font-mono text-sm text-gray-200 placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Type your markdown here..."
          spellCheck={false}
        />

        {/* Preview Pane */}
        <div
          className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-accent prose-strong:text-white prose-code:text-accent prose-code:bg-surface-light prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-border prose-blockquote:border-accent prose-blockquote:text-gray-400 prose-th:text-white prose-td:text-gray-300 h-[500px] overflow-y-auto rounded-lg border border-border bg-surface p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
