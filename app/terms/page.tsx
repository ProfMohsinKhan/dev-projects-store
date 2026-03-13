import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | DevStore",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms and Conditions</h1>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Introduction</h2>
            <p>Welcome to DevStore. By accessing and downloading source code from our platform, you agree to these Terms and Conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. License and Usage</h2>
            <p>The source code, database files, and documentation provided are intended for educational purposes, learning, and final year project submissions. You are granted a non-exclusive license to use and modify the code.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Intellectual Property</h2>
            <p>You may not resell, redistribute, or claim original ownership of the unmodified source code provided by DevStore.</p>
          </section>
        </div>
      </div>
    </main>
  );
}