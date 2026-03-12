import Link from "next/link";
import { Search, Code2, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer">
            <Code2 className="h-8 w-8 text-blue-600" />
            <Link href="/" className="font-extrabold text-xl text-slate-900 tracking-tight">
              Dev<span className="text-blue-600">Store</span>
            </Link>
          </div>

          {/* Search Bar (Future Ready) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-all"
                placeholder="Search for projects, tech stack..."
              />
            </div>
          </div>

          {/* Right Navigation / CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              All Projects
            </Link>
            <a 
              href="https://mohsinoasis25.gumroad.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              My Gumroad
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button className="text-slate-600 hover:text-slate-900 p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}