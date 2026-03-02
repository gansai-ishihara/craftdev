"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

// ---------------------------------------------------------------------------
// Pure conversion helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): RGB | null {
  let h = hex.replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0,
    g = 0,
    b = 0;
  switch (i % 6) {
    case 0:
      r = v; g = t; b = p; break;
    case 1:
      r = q; g = v; b = p; break;
    case 2:
      r = p; g = v; b = t; break;
    case 3:
      r = p; g = q; b = v; break;
    case 4:
      r = t; g = p; b = v; break;
    case 5:
      r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatHex(rgb: RGB): string {
  return rgbToHex(rgb).toUpperCase();
}

function formatRgb(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function formatHsl(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function formatHsv(hsv: HSV): string {
  return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
}

// ---------------------------------------------------------------------------
// Clamp utility
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

// ---------------------------------------------------------------------------
// Default color (#00d2ff = accent)
// ---------------------------------------------------------------------------

const DEFAULT_RGB: RGB = { r: 0, g: 210, b: 255 };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ColorConverterTool() {
  const [rgb, setRgb] = useState<RGB>(DEFAULT_RGB);
  const [hexInput, setHexInput] = useState(rgbToHex(DEFAULT_RGB));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Derived values
  const hex = formatHex(rgb);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cssColor = rgbToHex(rgb);

  // --- updaters -----------------------------------------------------------

  const updateFromRgb = useCallback((next: RGB) => {
    const clamped: RGB = {
      r: clamp(next.r, 0, 255),
      g: clamp(next.g, 0, 255),
      b: clamp(next.b, 0, 255),
    };
    setRgb(clamped);
    setHexInput(rgbToHex(clamped));
  }, []);

  const updateFromHex = useCallback(
    (value: string) => {
      setHexInput(value);
      const parsed = hexToRgb(value);
      if (parsed) setRgb(parsed);
    },
    []
  );

  const updateFromPicker = useCallback(
    (value: string) => {
      setHexInput(value);
      const parsed = hexToRgb(value);
      if (parsed) setRgb(parsed);
    },
    []
  );

  const updateFromHsl = useCallback((next: HSL) => {
    const clamped: HSL = {
      h: clamp(next.h, 0, 360),
      s: clamp(next.s, 0, 100),
      l: clamp(next.l, 0, 100),
    };
    const newRgb = hslToRgb(clamped);
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb));
  }, []);

  const updateFromHsv = useCallback((next: HSV) => {
    const clamped: HSV = {
      h: clamp(next.h, 0, 360),
      s: clamp(next.s, 0, 100),
      v: clamp(next.v, 0, 100),
    };
    const newRgb = hsvToRgb(clamped);
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb));
  }, []);

  // --- copy ---------------------------------------------------------------

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // clipboard blocked
    }
  };

  // --- output cards data --------------------------------------------------

  const outputs = [
    { key: "hex", label: "HEX", value: hex },
    { key: "rgb", label: "RGB", value: formatRgb(rgb) },
    { key: "hsl", label: "HSL", value: formatHsl(hsl) },
    { key: "hsv", label: "HSV", value: formatHsv(hsv) },
  ];

  // --- render -------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Color preview + picker + hex input */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Preview box */}
        <div
          className="h-6 w-6 rounded border border-border"
          style={{ backgroundColor: cssColor }}
        />

        {/* Native color picker */}
        <input
          type="color"
          value={cssColor}
          onChange={(e) => updateFromPicker(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border border-border bg-transparent"
        />

        {/* HEX text input */}
        <input
          type="text"
          value={hexInput}
          onChange={(e) => updateFromHex(e.target.value)}
          placeholder="#00d2ff"
          spellCheck={false}
          className="w-32 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:border-accent"
        />
      </div>

      {/* Output format cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {outputs.map(({ key, label, value }) => (
          <button
            key={key}
            onClick={() => handleCopy(key, value)}
            className="group flex flex-col items-start gap-1 rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-accent"
          >
            <span className="text-xs font-medium text-gray-400">{label}</span>
            <div className="flex w-full items-center justify-between gap-2">
              <span className="truncate font-mono text-sm text-gray-200">
                {value}
              </span>
              {copiedKey === key ? (
                <Check size={14} className="shrink-0 text-accent" />
              ) : (
                <Copy
                  size={14}
                  className="shrink-0 text-gray-500 transition-colors group-hover:text-accent"
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* RGB sliders */}
      <SliderGroup
        title="RGB"
        channels={[
          { label: "R", value: rgb.r, min: 0, max: 255 },
          { label: "G", value: rgb.g, min: 0, max: 255 },
          { label: "B", value: rgb.b, min: 0, max: 255 },
        ]}
        onChange={(idx, val) => {
          const next = { ...rgb };
          if (idx === 0) next.r = val;
          else if (idx === 1) next.g = val;
          else next.b = val;
          updateFromRgb(next);
        }}
      />

      {/* HSL sliders */}
      <SliderGroup
        title="HSL"
        channels={[
          { label: "H", value: hsl.h, min: 0, max: 360 },
          { label: "S", value: hsl.s, min: 0, max: 100 },
          { label: "L", value: hsl.l, min: 0, max: 100 },
        ]}
        onChange={(idx, val) => {
          const next = { ...hsl };
          if (idx === 0) next.h = val;
          else if (idx === 1) next.s = val;
          else next.l = val;
          updateFromHsl(next);
        }}
      />

      {/* HSV sliders */}
      <SliderGroup
        title="HSV"
        channels={[
          { label: "H", value: hsv.h, min: 0, max: 360 },
          { label: "S", value: hsv.s, min: 0, max: 100 },
          { label: "V", value: hsv.v, min: 0, max: 100 },
        ]}
        onChange={(idx, val) => {
          const next = { ...hsv };
          if (idx === 0) next.h = val;
          else if (idx === 1) next.s = val;
          else next.v = val;
          updateFromHsv(next);
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SliderGroup sub-component
// ---------------------------------------------------------------------------

interface ChannelDef {
  label: string;
  value: number;
  min: number;
  max: number;
}

function SliderGroup({
  title,
  channels,
  onChange,
}: {
  title: string;
  channels: ChannelDef[];
  onChange: (index: number, value: number) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-3 text-sm font-medium text-accent">{title}</h3>
      <div className="space-y-3">
        {channels.map((ch, idx) => (
          <div key={ch.label} className="flex items-center gap-3">
            <span className="w-4 text-xs font-medium text-gray-400">
              {ch.label}
            </span>
            <input
              type="range"
              min={ch.min}
              max={ch.max}
              value={ch.value}
              onChange={(e) => onChange(idx, parseInt(e.target.value, 10))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-light accent-accent"
            />
            <input
              type="number"
              min={ch.min}
              max={ch.max}
              value={ch.value}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) onChange(idx, clamp(v, ch.min, ch.max));
              }}
              className="w-16 rounded border border-border bg-surface-light px-2 py-1 text-center font-mono text-sm text-gray-200 outline-none transition-colors focus:border-accent"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
