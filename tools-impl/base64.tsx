"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Copy, Check, Upload } from "lucide-react";

type Mode = "encode" | "decode";

function encodeBase64(text: string): string {
  return btoa(
    encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

function decodeBase64(text: string): string {
  return decodeURIComponent(
    Array.from(atob(text))
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convert = useCallback(
    (text: string, currentMode: Mode) => {
      if (!text) {
        setOutput("");
        setError("");
        return;
      }

      try {
        const result =
          currentMode === "encode" ? encodeBase64(text) : decodeBase64(text);
        setOutput(result);
        setError("");
      } catch {
        setOutput("");
        setError(
          currentMode === "encode"
            ? "Failed to encode the input."
            : "Invalid Base64 string. Please check your input."
        );
      }
    },
    []
  );

  useEffect(() => {
    convert(input, mode);
  }, [input, mode, convert]);

  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode) return;

    const previousOutput = output;
    setMode(newMode);
    setInput(previousOutput);
    setError("");
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // readAsDataURL returns "data:<mime>;base64,<data>"
      const base64Data = result.split(",")[1] || "";

      if (mode === "encode") {
        setInput(file.name);
        setOutput(base64Data);
        setError("");
      } else {
        setInput(base64Data);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);

    // Reset file input so the same file can be uploaded again
    e.target.value = "";
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleModeChange("encode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-accent text-black"
              : "bg-surface-light text-gray-400 hover:text-white"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => handleModeChange("decode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-accent text-black"
              : "bg-surface-light text-gray-400 hover:text-white"
          }`}
        >
          Decode
        </button>

        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="ml-auto flex items-center gap-2 rounded-lg bg-surface-light px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          <Upload size={16} />
          Upload File
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Split pane: input + output */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input pane */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-400">
            {mode === "encode" ? "Plain Text" : "Base64 Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base64 string to decode..."
            }
            spellCheck={false}
            className="h-64 w-full resize-y rounded-lg border border-border bg-surface p-4 font-mono text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent"
          />
        </div>

        {/* Output pane */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-accent disabled:opacity-40 disabled:hover:text-gray-400"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-64 w-full resize-y rounded-lg border border-border bg-surface p-4 font-mono text-sm text-white placeholder-gray-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
