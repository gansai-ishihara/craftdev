"use client";

import { useState, useMemo } from "react";

function formatTime(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} sec`;
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours} hr ${mins} min`;
}

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    const lines = text === "" ? 0 : text.split("\n").length;

    const readingTime = words / 200;
    const speakingTime = words / 130;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    };
  }, [text]);

  const statCards = [
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
  ];

  return (
    <div className="space-y-4">
      {/* Time estimates */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <span>
          Reading time:{" "}
          <span className="font-medium text-accent">
            {formatTime(stats.readingTime)}
          </span>
        </span>
        <span>
          Speaking time:{" "}
          <span className="font-medium text-white">
            {formatTime(stats.speakingTime)}
          </span>
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface px-4 py-4"
          >
            <span className="text-2xl font-bold text-white">
              {card.value.toLocaleString()}
            </span>
            <span className="mt-1 text-xs text-gray-400">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        spellCheck={false}
        className="h-64 w-full resize-y rounded-lg border border-border bg-surface p-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
