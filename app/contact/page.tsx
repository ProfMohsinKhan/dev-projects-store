import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us | DevStore",
  description: "Get in touch with the DevStore team.",
};

export default function ContactPage() {
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
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Contact Us</h1>
              <p className="text-slate-500 mt-1">We're here to help you with your projects.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you have a question about a source code, need help setting up your project, or want to request a custom app, our team is ready to assist you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email Support</p>
                    <a href="mailto:mohsin.mohsin6@gmail.com" className="text-slate-600 hover:text-blue-600 transition-colors">mohsin.mohsin6@gmail.com</a>
                    <p className="text-xs text-slate-400 mt-1">We usually reply within 24 hours.</p>
                  </div>
                  
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    {/* Yahan aap PhoneIcon import kar sakte hain lucide-react se */}
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">WhatsApp Support</p>
                    <a href="https://wa.me/918369286385" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-green-600 transition-colors font-medium">
                      +91 8369286385
                    </a>
                    <p className="text-xs text-slate-400 mt-1">Available during operating hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Office Address</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Shop No. 01, Commercial Orchid Bldg, <br/>
                      Wing A & B, Next to Laxmi Park, <br/>
                      Type-A-18A-2, Beverly Park, <br/>
                      Mira Road (East), Thane - 401107
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Operating Hours</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-slate-900">10:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Saturday</span>
                  <span className="font-medium text-slate-900">10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-red-500">Closed</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/request" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  Request Custom Project
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}