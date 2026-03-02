"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { tools, categories, ToolCategory } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const groupedTools = (Object.keys(categories) as ToolCategory[])
    .map((cat) => ({
      category: cat,
      ...categories[cat],
      tools: filteredTools.filter((t) => t.category === cat),
    }))
    .filter((group) => group.tools.length > 0);

  return (
    <div>
      <section className="px-4 pt-16 pb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Free Online <span className="text-accent">Developer Tools</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
          Fast, private, and free. All tools run entirely in your browser — no
          data is ever sent to a server.
        </p>

        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {groupedTools.map((group) => (
          <div key={group.category} className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {group.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        ))}

        {filteredTools.length === 0 && (
          <p className="text-center text-gray-500">
            No tools found matching &quot;{searchQuery}&quot;
          </p>
        )}
      </section>
    </div>
  );
}
