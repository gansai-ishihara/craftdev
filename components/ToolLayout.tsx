import { Tool } from "@/lib/tools";
import { AdBanner } from "./AdBanner";

export function ToolLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
          {tool.name}
        </h1>
        <p className="text-lg leading-relaxed text-gray-400">
          {tool.description}
        </p>
      </div>

      <div className="mb-12">{children}</div>

      <AdBanner slot="tool-bottom" />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-white">How to use</h2>
        <ol className="list-inside list-decimal space-y-2 text-gray-300">
          {tool.howToUse.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-white">FAQ</h2>
        <div className="space-y-6">
          {tool.faq.map((item, i) => (
            <div key={i}>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {item.question}
              </h3>
              <p className="leading-relaxed text-gray-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <AdBanner slot="tool-footer" />
    </div>
  );
}
