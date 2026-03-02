import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CraftDev.tools privacy policy. All tools run entirely in your browser — no data is ever sent to our servers.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          Data Processing
        </h2>
        <p className="text-gray-300 leading-relaxed">
          All tools on CraftDev.tools run entirely in your browser. No user
          input data is ever transmitted to our servers or any third party. Your
          data stays on your device at all times.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Analytics</h2>
        <p className="text-gray-300 leading-relaxed">
          We use{" "}
          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Vercel Analytics
          </a>{" "}
          to collect anonymous usage data. This service does not use cookies and
          does not collect personally identifiable information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Advertising</h2>
        <p className="text-gray-300 leading-relaxed">
          We use Google AdSense to display advertisements. Google may use cookies
          to personalize ads based on your browsing history. You can manage your
          ad personalization preferences in your{" "}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Google Ads Settings
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
        <p className="text-gray-300 leading-relaxed">
          CraftDev.tools itself does not set any cookies. However, third-party
          services such as Google AdSense may set cookies on your device. Please
          refer to their respective privacy policies for more information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
        <p className="text-gray-300 leading-relaxed">
          If you have any questions about this privacy policy, please open an
          issue on our{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            GitHub repository
          </a>
          .
        </p>
      </section>
    </div>
  );
}
