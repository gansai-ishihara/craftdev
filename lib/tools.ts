export type ToolCategory =
  | "encoding"
  | "formatting"
  | "color"
  | "text"
  | "datetime";

export type Tool = {
  slug: string;
  name: string;
  description: string; // SEO description 150-160 chars
  shortDescription: string; // Card display, 50 chars or less
  category: ToolCategory;
  keywords: string[];
  icon: string; // lucide-react icon name
  howToUse: string[];
  faq: { question: string; answer: string }[];
};

export const categories: Record<
  ToolCategory,
  { label: string; icon: string }
> = {
  formatting: { label: "Formatting", icon: "Code2" },
  encoding: { label: "Encoding", icon: "Lock" },
  text: { label: "Text", icon: "Type" },
  color: { label: "Color", icon: "Palette" },
  datetime: { label: "Date & Time", icon: "Clock" },
};

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    description:
      "Format, validate, and beautify JSON data online. Instantly detect syntax errors, pretty-print nested objects, and minify JSON with this free browser-based tool.",
    shortDescription: "Format, validate, and beautify JSON",
    category: "formatting",
    keywords: [
      "json formatter",
      "json validator",
      "json beautifier",
      "json pretty print",
      "json minifier",
    ],
    icon: "Braces",
    howToUse: [
      "Paste your raw JSON data into the input editor on the left side.",
      "Click Format to pretty-print the JSON or Minify to compress it.",
      "Review any validation errors highlighted inline with line numbers.",
      "Copy the formatted output or download it as a .json file.",
    ],
    faq: [
      {
        question: "Is my JSON data sent to a server for formatting?",
        answer:
          "No. All formatting and validation happens entirely in your browser. Your data stays on your device and is never transmitted to any server.",
      },
      {
        question: "What size JSON can this tool handle?",
        answer:
          "The tool processes JSON of several megabytes comfortably since all parsing runs client-side in your browser. Very large files may depend on your device memory.",
      },
      {
        question: "Can I validate JSON with comments or trailing commas?",
        answer:
          "Standard JSON does not allow comments or trailing commas, so the validator will flag them as errors. All processing stays in the browser, letting you fix issues instantly.",
      },
    ],
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    description:
      "Encode text or files to Base64 and decode Base64 strings back to plain text instantly. A free, private browser-based Base64 conversion tool for developers.",
    shortDescription: "Encode and decode Base64 strings",
    category: "encoding",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "base64 converter",
      "encode base64",
      "decode base64",
    ],
    icon: "Lock",
    howToUse: [
      "Choose whether you want to encode or decode using the toggle switch.",
      "Paste your plain text or Base64-encoded string into the input area.",
      "The converted output appears instantly in the output panel.",
      "Click Copy to copy the result to your clipboard for use elsewhere.",
    ],
    faq: [
      {
        question: "Is it safe to encode sensitive data with this tool?",
        answer:
          "Yes. All encoding and decoding happens entirely in your browser. Your data stays on your device and is never sent to any external server.",
      },
      {
        question: "Does this tool support file-to-Base64 conversion?",
        answer:
          "Yes. You can drag and drop or select a file to convert it to a Base64-encoded string. Everything is processed locally in your browser for privacy.",
      },
      {
        question: "What character encoding does this tool use?",
        answer:
          "The tool uses UTF-8 encoding by default, which supports all Unicode characters. Since processing stays in the browser, the conversion is instant and private.",
      },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode and decode URLs and query string parameters online. Safely escape special characters for valid URLs with this free, private browser-based encoding tool.",
    shortDescription: "Encode and decode URL components",
    category: "encoding",
    keywords: [
      "url encoder",
      "url decoder",
      "percent encoding",
      "uri encode",
      "query string encoder",
    ],
    icon: "Link",
    howToUse: [
      "Select the Encode or Decode mode with the toggle at the top.",
      "Paste a URL or text string with special characters into the input field.",
      "View the encoded or decoded result instantly in the output panel.",
      "Copy the result to your clipboard or clear the input to start over.",
    ],
    faq: [
      {
        question: "What is the difference between encodeURI and encodeURIComponent?",
        answer:
          "encodeURI encodes a full URI but preserves characters like colons and slashes, while encodeURIComponent encodes every special character. This tool supports both modes, and all processing stays in the browser.",
      },
      {
        question: "Can I encode entire URLs with query parameters?",
        answer:
          "Yes. You can paste a full URL and the tool will properly encode the query string values. All encoding happens in your browser, so your data remains private.",
      },
      {
        question: "Does URL encoding affect the length of my string?",
        answer:
          "Yes. Each special character is replaced by a percent sign and two hex digits, which increases the string length. The conversion runs locally in the browser with no size restrictions.",
      },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description:
      "Test and debug regular expressions with real-time matching and group highlighting. A free browser-based regex tester with instant feedback for developers.",
    shortDescription: "Test and debug regular expressions",
    category: "text",
    keywords: [
      "regex tester",
      "regular expression",
      "regex debugger",
      "pattern matching",
      "regex validator",
    ],
    icon: "Regex",
    howToUse: [
      "Enter your regular expression pattern in the pattern input field.",
      "Set regex flags such as global, case-insensitive, or multiline as needed.",
      "Type or paste test strings in the text area below to see matches highlighted.",
      "Review matched groups and capture results in the details panel on the right.",
    ],
    faq: [
      {
        question: "Which regex flavor does this tester use?",
        answer:
          "It uses JavaScript's built-in RegExp engine, which follows the ECMAScript specification. All pattern matching executes in your browser, so your test data stays completely private.",
      },
      {
        question: "Can I see capture groups and named groups?",
        answer:
          "Yes. The tool highlights each capture group with a distinct color and lists all matched groups including named groups. Everything runs locally in the browser with no server calls.",
      },
      {
        question: "Is there a limit on the length of test input?",
        answer:
          "There is no hard limit since matching runs in your browser. Very long inputs may take slightly more time depending on pattern complexity, but your data never leaves the browser.",
      },
    ],
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    description:
      "Format and beautify HTML code with proper indentation online. Clean up minified or messy HTML markup instantly with this free, privacy-focused browser tool.",
    shortDescription: "Beautify and indent HTML code",
    category: "formatting",
    keywords: [
      "html formatter",
      "html beautifier",
      "html indenter",
      "html pretty print",
      "format html",
    ],
    icon: "FileCode",
    howToUse: [
      "Paste your unformatted or minified HTML code into the input editor.",
      "Choose your preferred indentation style such as 2 spaces or 4 spaces.",
      "Click Format to beautify the HTML with proper nesting and indentation.",
      "Copy the formatted output or download it as an HTML file for your project.",
    ],
    faq: [
      {
        question: "Does this tool fix broken HTML tags?",
        answer:
          "The formatter focuses on indentation and readability rather than error correction. It will format the HTML as-is, and all processing happens entirely in your browser.",
      },
      {
        question: "Can I format HTML that contains embedded CSS or JavaScript?",
        answer:
          "Yes. The tool recognizes style and script blocks and formats them appropriately within the HTML structure. All formatting stays in the browser, keeping your code private.",
      },
      {
        question: "Is there a maximum file size for formatting?",
        answer:
          "There is no strict limit since formatting runs client-side in your browser. Performance depends on your device, but typical HTML documents are handled instantly and your data stays local.",
      },
    ],
  },
  {
    slug: "css-formatter",
    name: "CSS Formatter / Minifier",
    description:
      "Format, beautify, or minify CSS code online. Improve readability or reduce file size with proper indentation using this free, browser-based CSS formatting tool.",
    shortDescription: "Format or minify CSS stylesheets",
    category: "formatting",
    keywords: [
      "css formatter",
      "css minifier",
      "css beautifier",
      "css pretty print",
      "minify css",
    ],
    icon: "Paintbrush",
    howToUse: [
      "Paste your CSS code into the input editor on the left panel.",
      "Select Format to beautify or Minify to compress the CSS output.",
      "Adjust indentation preferences like tab size if needed.",
      "Copy the result to your clipboard or download the formatted CSS file.",
    ],
    faq: [
      {
        question: "Does minifying CSS remove comments and whitespace?",
        answer:
          "Yes. The minifier strips all comments and unnecessary whitespace to produce the smallest possible output. All processing runs in your browser, so your stylesheets stay private.",
      },
      {
        question: "Will the formatter change my CSS property order?",
        answer:
          "No. The tool only adjusts whitespace and indentation without reordering or modifying your CSS properties. Everything is processed locally in the browser.",
      },
      {
        question: "Can I format SCSS or LESS with this tool?",
        answer:
          "This tool is designed for standard CSS. SCSS and LESS syntax may not format correctly due to their extended syntax. All formatting happens in your browser with no data sent externally.",
      },
    ],
  },
  {
    slug: "color-converter",
    name: "Color Code Converter",
    description:
      "Convert colors between HEX, RGB, HSL, and HSB formats instantly. Preview colors in real time with this free browser-based color code converter for designers.",
    shortDescription: "Convert HEX, RGB, HSL, and HSB colors",
    category: "color",
    keywords: [
      "color converter",
      "hex to rgb",
      "rgb to hsl",
      "color picker",
      "color code",
    ],
    icon: "Palette",
    howToUse: [
      "Enter a color value in any supported format such as HEX, RGB, or HSL.",
      "See the color preview update in real time alongside all converted formats.",
      "Click on any output format value to copy it directly to your clipboard.",
      "Use the visual color picker to select a color and get all code values at once.",
    ],
    faq: [
      {
        question: "What color formats are supported?",
        answer:
          "The tool supports HEX, RGB, HSL, and HSB color formats with alpha channel support. All conversions happen instantly in your browser with no server communication.",
      },
      {
        question: "Can I use the color picker on mobile devices?",
        answer:
          "Yes. The color picker is fully responsive and works on touch devices. Since everything runs in the browser, you get the same private experience on any device.",
      },
      {
        question: "How accurate are the color conversions?",
        answer:
          "Conversions are mathematically precise following standard color space formulas. All calculations run locally in your browser, ensuring both accuracy and complete data privacy.",
      },
    ],
  },
  {
    slug: "timestamp",
    name: "Unix Timestamp Converter",
    description:
      "Convert Unix timestamps to readable dates and vice versa. Supports seconds and milliseconds with timezone handling in this free browser-based converter tool.",
    shortDescription: "Convert Unix timestamps to dates",
    category: "datetime",
    keywords: [
      "unix timestamp",
      "epoch converter",
      "timestamp to date",
      "date to timestamp",
      "epoch time",
    ],
    icon: "Clock",
    howToUse: [
      "Enter a Unix timestamp in seconds or milliseconds in the input field.",
      "View the converted human-readable date and time with timezone details.",
      "Alternatively, pick a date and time to convert it to a Unix timestamp.",
      "Copy the result in your preferred format for use in your application.",
    ],
    faq: [
      {
        question: "What is the difference between seconds and milliseconds timestamps?",
        answer:
          "Unix timestamps in seconds are 10 digits while milliseconds are 13 digits. The tool auto-detects the format. All conversions run in your browser, keeping your data private.",
      },
      {
        question: "Does this tool handle timezone conversions?",
        answer:
          "Yes. The tool displays the converted date in your local timezone and UTC. You can also select a specific timezone. Everything is processed in your browser with no external requests.",
      },
      {
        question: "What date range does the converter support?",
        answer:
          "It supports the full range of JavaScript Date objects, from the year 1970 through 275760. All calculations happen locally in the browser, so your data never leaves your device.",
      },
    ],
  },
  {
    slug: "markdown-preview",
    name: "Markdown Previewer",
    description:
      "Write and preview Markdown with live rendering side by side. Supports GitHub Flavored Markdown with syntax highlighting in this free browser-based tool.",
    shortDescription: "Write and preview Markdown live",
    category: "text",
    keywords: [
      "markdown preview",
      "markdown editor",
      "markdown renderer",
      "github markdown",
      "markdown to html",
    ],
    icon: "FileText",
    howToUse: [
      "Type or paste your Markdown content into the editor on the left.",
      "See the rendered HTML preview update in real time on the right panel.",
      "Use the toolbar for quick formatting like headings, bold, and links.",
      "Copy the rendered HTML output or export your Markdown as a file.",
    ],
    faq: [
      {
        question: "Does the previewer support GitHub Flavored Markdown?",
        answer:
          "Yes. It supports tables, task lists, strikethrough, and fenced code blocks from the GFM specification. All rendering happens in your browser, so your documents remain private.",
      },
      {
        question: "Can I use syntax highlighting in code blocks?",
        answer:
          "Yes. Fenced code blocks with a language identifier are syntax-highlighted automatically. The highlighting library runs locally in the browser with no server-side processing.",
      },
      {
        question: "Is my Markdown content saved anywhere?",
        answer:
          "No. Your content exists only in your browser session and is not stored or transmitted. All preview rendering stays in the browser to ensure complete privacy of your documents.",
      },
    ],
  },
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description:
      "Count words, characters, sentences, and paragraphs in your text instantly. Track reading time and keyword density with this free browser-based analysis tool.",
    shortDescription: "Count words, characters, and more",
    category: "text",
    keywords: [
      "word counter",
      "character counter",
      "letter count",
      "reading time",
      "text analysis",
    ],
    icon: "LetterText",
    howToUse: [
      "Paste or type your text into the input area at the top of the page.",
      "View live statistics for words, characters, sentences, and paragraphs.",
      "Check the estimated reading time and speaking time below the stats.",
      "Review keyword density and most frequent words in the analysis section.",
    ],
    faq: [
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time is based on an average reading speed of 200-250 words per minute. The calculation runs instantly in your browser, and your text is never sent to any server.",
      },
      {
        question: "Does the counter include spaces in the character count?",
        answer:
          "The tool shows both character counts with and without spaces. All counting happens in your browser, so your writing stays completely private on your device.",
      },
      {
        question: "Can I analyze text in languages other than English?",
        answer:
          "Yes. The counter works with any language that uses space-separated words and Unicode text. All processing is done locally in the browser, ensuring privacy for all your content.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}
