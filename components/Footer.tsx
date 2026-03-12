import Link from "next/link";
import { Code2 } from "lucide-react";

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
            <p className="text-sm text-slate-400 mb-4">
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

          {/* SEO Category 3: Buyer Intent Keywords */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Buy final year project</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Project report and documentation</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">College project with source code</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Mini project for computer science</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} DevStore by Mohsin Khan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}