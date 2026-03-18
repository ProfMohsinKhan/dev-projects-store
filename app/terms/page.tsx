import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | DevStore",
  description: "Terms and conditions for using DevStore.",
};

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
              <p className="text-slate-500 mt-1">Last updated: March 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
              <p>Welcome to DevStore, a digital initiative exclusively owned and operated by <strong>Mak Tutorials</strong>. By accessing our website and purchasing our digital products (source codes, project files, and documentation), you agree to be bound by these Terms and Conditions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Digital Products & Licensing</h2>
              <p>All products available on DevStore are digital downloads. Upon purchase, you are granted a non-exclusive, non-transferable license to use the source code for educational purposes, final year submissions, and personal learning.</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>You may modify the code for your own projects.</li>
                <li>You may <strong>not</strong> resell, redistribute, or publish the raw source code as your own commercial product.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Payments & Delivery</h2>
              <p>All payments are processed securely via our payment partners (e.g., Cashfree, Gumroad). Once payment is successful, you will receive immediate access to the download links. If you face any issues with delivery, please contact our support team.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Support & Maintenance</h2>
              <p>We provide basic setup instructions with all our projects. However, we do not offer custom development or free code modification services as part of the standard purchase. Advanced support is subject to availability and may incur additional charges.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at <strong>mohsin.mohsin6@gmail.com</strong>.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}