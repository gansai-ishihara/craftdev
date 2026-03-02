import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CraftDev.tools — Free Online Developer Tools",
    template: "%s | CraftDev.tools",
  },
  description:
    "Free online developer tools: JSON formatter, Base64 encoder, regex tester, color converter, and more. All tools run in your browser — fast, private, no sign-up required.",
  keywords: [
    "developer tools",
    "online tools",
    "json formatter",
    "base64 encoder",
    "regex tester",
    "web developer tools",
  ],
  openGraph: {
    type: "website",
    siteName: "CraftDev.tools",
    title: "CraftDev.tools — Free Online Developer Tools",
    description:
      "Free online developer tools: JSON formatter, Base64 encoder, regex tester, color converter, and more. All tools run in your browser.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AdSense script tag can be added here after approval */}
      </head>
      <body className="min-h-screen bg-background font-sans text-gray-200 antialiased">
        <header className="border-b border-border">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a
              href="/"
              className="text-xl font-bold text-white hover:text-accent transition-colors"
            >
              Craft<span className="text-accent">Dev</span>.tools
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="border-t border-border mt-20">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-500">
                © 2026 CraftDev.tools. All tools run entirely in your browser.
              </p>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
