import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "CraftDev.tools terms of service. Free browser-based developer tools provided as-is.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          Acceptance of Terms
        </h2>
        <p className="text-gray-300 leading-relaxed">
          By accessing and using CraftDev.tools, you accept and agree to be
          bound by these Terms of Service. If you do not agree to these terms,
          please do not use this website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          Description of Service
        </h2>
        <p className="text-gray-300 leading-relaxed">
          CraftDev.tools provides free, browser-based developer tools. All
          processing is performed locally in your browser. We make no guarantees
          regarding the availability, accuracy, or reliability of these tools.
          The service is provided free of charge and may be modified or
          discontinued at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Disclaimer</h2>
        <p className="text-gray-300 leading-relaxed">
          This service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without any warranties of any kind, either express or
          implied. CraftDev.tools shall not be liable for any damages arising
          from the use or inability to use these tools, including but not limited
          to data loss, inaccurate output, or interruption of service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          Intellectual Property
        </h2>
        <p className="text-gray-300 leading-relaxed">
          The CraftDev.tools name, logo, and website design are the property of
          CraftDev.tools. The tools themselves are open source and available
          under their respective licenses. You retain all rights to any data you
          process using our tools.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          Changes to Terms
        </h2>
        <p className="text-gray-300 leading-relaxed">
          We reserve the right to modify these terms at any time. Changes will be
          effective immediately upon posting to this page. Your continued use of
          CraftDev.tools after any changes constitutes your acceptance of the
          revised terms.
        </p>
      </section>
    </div>
  );
}
