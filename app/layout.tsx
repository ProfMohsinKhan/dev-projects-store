import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import the new SEO Footer

const inter = Inter({ subsets: ["latin"] });

// Broad SEO Keywords placed here
export const metadata: Metadata = {
  title: {
    default: "Final Year Project With Source Code | DevStore",
    template: "%s | DevStore"
  },
  description: "Download ready-made engineering and BSc IT final year projects. Get complete source code, database, and documentation for Python, PHP, Android, and Java.",
  keywords: ["final year project with source code", "engineering final year project", "buy final year project", "ready made final year project", "project report and source code download"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-slate-900 flex flex-col min-h-screen`}>
        <Navbar />
        
        {/* Main Content */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* The new SEO-optimized Footer */}
        <Footer />
      </body>
    </html>
  );
}