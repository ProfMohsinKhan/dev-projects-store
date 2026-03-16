import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export const metadata = {
  title: "Refund Policy | DevStore",
  description: "Strict No Refund policy for digital downloads.",
};

export default function RefundPage() {
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
            <div className="bg-red-50 p-3 rounded-xl">
              <RefreshCcw className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Cancellation & Refund Policy</h1>
              <p className="text-slate-500 mt-1">Strict policy for digital downloads.</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-red-800 font-bold text-lg text-center shadow-sm">
              All sales are final. We maintain a strict NON-REFUNDABLE policy for all digital products.
            </div>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. No Refunds or Cancellations</h2>
              <p>Because our products are digital goods (Source Codes, PDFs, Database Files) that are delivered instantly upon purchase, they cannot be "returned." Therefore, <strong>we do not offer refunds, exchanges, or cancellations</strong> once a purchase is made and the files have been accessed or downloaded.</p>
              <p className="mt-3">By completing your purchase on DevStore, you acknowledge and agree to this strict no-refund policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Exceptional Cases</h2>
              <p>The only exceptions where a refund or replacement may be considered are strictly limited to the following technical anomalies:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong>Duplicate Transaction:</strong> If your bank account was charged twice for the exact same transaction due to a payment gateway glitch.</li>
                <li><strong>Unusable/Corrupted File:</strong> If the downloaded file is completely corrupted and our technical team is unable to provide a working replacement file within 48 hours of your complaint.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. How to report a technical issue?</h2>
              <p>If you face a duplicate charge or file corruption, you must contact us within <strong>3 days</strong> of the transaction at <strong>mohsin.mohsin6@gmail.com</strong> with your transaction ID and proof. If a refund is approved under these exceptional cases, it will be credited back to your original payment method within 5-7 business days.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Disclaimer</h2>
              <p>Lack of programming knowledge, inability to set up the local environment (like XAMPP, Node.js, etc.), or purchasing the wrong project by mistake are <strong>not valid reasons</strong> for a refund. We strongly advise you to read the project description, tech stack, and features carefully before buying.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}