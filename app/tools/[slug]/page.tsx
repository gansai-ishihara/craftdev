import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import JsonFormatterTool from "@/tools-impl/json-formatter";
import Base64Tool from "@/tools-impl/base64";
import UrlEncoderTool from "@/tools-impl/url-encoder";
import RegexTesterTool from "@/tools-impl/regex-tester";
import HtmlFormatterTool from "@/tools-impl/html-formatter";
import CssFormatterTool from "@/tools-impl/css-formatter";
import ColorConverterTool from "@/tools-impl/color-converter";
import TimestampTool from "@/tools-impl/timestamp";
import MarkdownPreviewTool from "@/tools-impl/markdown-preview";
import WordCounterTool from "@/tools-impl/word-counter";

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatterTool,
  base64: Base64Tool,
  "url-encoder": UrlEncoderTool,
  "regex-tester": RegexTesterTool,
  "html-formatter": HtmlFormatterTool,
  "css-formatter": CssFormatterTool,
  "color-converter": ColorConverterTool,
  timestamp: TimestampTool,
  "markdown-preview": MarkdownPreviewTool,
  "word-counter": WordCounterTool,
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} | CraftDev.tools`,
      description: tool.description,
    },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];
  if (!ToolComponent) notFound();

  return (
    <ToolLayout tool={tool}>
      <ToolComponent />
    </ToolLayout>
  );
}
