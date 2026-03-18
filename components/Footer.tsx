import Link from "next/link";
import { Code2, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-6 w-6 text-blue-500" />
              <span className="font-extrabold text-xl text-white tracking-tight">
                Dev<span className="text-blue-500">Store</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Premium ready-made final year projects, complete with documentation and source code download for engineering and computer science students.
            </p>
          </div>

          {/* SEO Category 1: Tech Stack Projects */}
          <div>
            <h3 className="text-white font-semibold mb-4">Browse by Tech Stack</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Python final year project with source code</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">PHP MySQL project for students</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Android app project for students</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Java final year project with source code</Link></li>
            </ul>
          </div>

          {/* SEO Category 2: Popular Project Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Top Project Ideas</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Machine learning project for students</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Hospital management system project</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Library management system PHP project</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Face recognition attendance system</Link></li>
            </ul>
          </div>

          {/* 🔥 NAYA UPDATE: Support, Legal & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="hover:text-blue-400 transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/request" className="hover:text-blue-400 transition-colors font-bold text-blue-500">Request Custom Project</Link></li>
            </ul>

            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Shop No. 01, Commercial Orchid Bldg, Next to Laxmi Park, Beverly Park, Mira Road (E), Thane - 401107</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>mohsin.mohsin6@gmail.com</span>
              </p>
            </div>
          </div>

        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} DevStore. A digital initiative operated by <strong>Mak Tutorials</strong>. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}