import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Refund Policy | DevStore",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Refund and Cancellation Policy</h1>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <p className="font-semibold text-blue-900">Digital Product Nature</p>
            <p className="mt-1 text-blue-800">DevStore deals exclusively in downloadable digital products (source code, database files, and documentation).</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">No Refund Policy</h2>
            <p>Due to the irreversible nature of digital downloads, **all sales are final**. Once a purchase is made and the download link is provided or the file is downloaded, we cannot offer refunds, returns, or exchanges.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Support</h2>
            <p>If you encounter technical issues with downloading the file or if the file is corrupted, please contact us immediately so we can resolve the issue and provide a working copy of your purchased project.</p>
          </section>
        </div>
      </div>
    </main>
  );
}