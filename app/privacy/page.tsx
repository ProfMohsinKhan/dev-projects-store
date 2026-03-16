import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | DevStore",
  description: "Privacy policy and data handling practices for DevStore.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="bg-blue-50 p-3 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
              <p className="text-slate-500 mt-1">How we collect, use, and protect your data.</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
              <p>When you purchase a project or contact us on DevStore, we may collect personal information such as your Name, Email Address, and Phone Number. Payment details are securely processed by our payment partners (e.g., Cashfree) and are not stored on our servers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
              <p>We use your information solely to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Process your transactions and deliver the digital products.</li>
                <li>Send you important updates regarding your purchase.</li>
                <li>Provide customer support and respond to your queries.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Security & Sharing</h2>
              <p>We do not sell, trade, or rent your personal identification information to others. We adopt appropriate data collection, storage, and processing practices to protect against unauthorized access or disclosure of your personal information.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Cookies</h2>
              <p>Our website may use "cookies" to enhance user experience. You can choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contacting Us</h2>
              <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <strong>mohsin.mohsin6@gmail.com</strong> or via WhatsApp at <strong>+91 8369286385</strong>.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}