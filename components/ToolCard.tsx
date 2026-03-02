import Link from "next/link";
import * as Icons from "lucide-react";
import { Tool } from "@/lib/tools";

type LucideIcon = React.ComponentType<{ className?: string; size?: number }>;

export function ToolCard({ tool }: { tool: Tool }) {
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[tool.icon] || Icons.Wrench;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/50 hover:bg-surface-light hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
        <IconComponent size={24} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-accent">
        {tool.name}
      </h3>
      <p className="text-sm leading-relaxed text-gray-400">
        {tool.shortDescription}
      </p>
    </Link>
  );
}
