import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Contact Us | DevStore",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-slate-600 mb-8">Have any questions about our final year projects or need help with setup? Reach out to us!</p>
          
          <div className="space-y-4 text-slate-700">
            <p><strong>Email:</strong> mohsin.mohsin6@gmail.com</p>
            <p><strong>Address:</strong> Mira Road (East), Thane - 401107, Maharashtra, India</p>
          </div>
        </div>
      </div>
    </main>
  );
}