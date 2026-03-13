import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShoppingCart, PlaySquare, Clock, ShieldCheck, Tag } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 60;

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return null;
}

async function getProject(slug: string) {
  const projectsCol = collection(db, "projects");
  const q = query(projectsCol, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Source Code`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl);
  
  // DISCOUNT LOGIC
  const discount = project.originalPrice 
    ? Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100) 
    : 0;

  // SAFE ARRAY LOGIC: Agar whatsIncluded string hai toh array banayega, warna empty array
  const includedItems = Array.isArray(project.whatsIncluded) 
    ? project.whatsIncluded 
    : typeof project.whatsIncluded === 'string'
      ? project.whatsIncluded.replace(/[\[\]"']/g, "").split(",").map((i: string) => i.trim()).filter((i: string) => i)
      : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Top Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
            {project.category || "Project"} / {project.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                  project.difficulty === 'Advanced' ? 'bg-red-50 text-red-600 border-red-100' : 
                  project.difficulty === 'Beginner' ? 'bg-green-50 text-green-600 border-green-100' : 
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {project.difficulty || 'Intermediate'} Level
                </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Video Section */}
          {embedUrl && (
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="aspect-video w-full">
                <iframe
                  width="100%" height="100%"
                  src={embedUrl}
                  title="Project Demo"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Tag className="text-blue-600 w-6 h-6" /> Key Project Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl sticky top-24">
            
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
              {discount > 0 && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">
                  Save {discount}%
                </div>
              )}
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Special Offer Price</span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl font-black text-slate-900">₹{project.price}</span>
                {project.originalPrice && (
                  <span className="text-xl text-slate-400 line-through font-bold">₹{project.originalPrice}</span>
                )}
              </div>
            </div>

            {/* WHAT'S INCLUDED: Yahan par includedItems use ho raha hai */}
            <div className="mb-8">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" /> What you will get:
              </h4>
              <div className="space-y-3">
                {includedItems.length > 0 ? (
                  includedItems.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 border border-dashed border-slate-200 rounded-xl">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Project files & setup guide included.</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-tighter">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg border border-slate-200 uppercase">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <a 
              href={project.paymentUrl || project.gumroadUrl} 
              target="_blank" 
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-slate-900 text-white text-xl font-black py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" /> GET SOURCE CODE
            </a>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Secured by Cashfree
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}