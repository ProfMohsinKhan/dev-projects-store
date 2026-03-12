import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShoppingCart, PlaySquare } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 60;
// Helper to extract YouTube ID for embed
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return null;
}

// Fetch single project based on URL slug
async function getProject(slug: string) {
  const projectsCol = collection(db, "projects");
  const q = query(projectsCol, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

// DYNAMIC SEO: Updated for Next.js 15+ Params Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; // <--- FIX: Awaiting params here
  const project = await getProject(slug);
  
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Source Code`,
    description: project.shortDescription,
    keywords: project.techStack?.join(", ") + ", final year project, source code",
  };
}

// MAIN PAGE: Updated for Next.js 15+ Params Promise
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // <--- FIX: Awaiting params here
  const project = await getProject(slug);

  // Agar URL galat hai, toh 404 page dikhao
  if (!project) {
    notFound();
  }

  const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all projects
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Content & Video */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-slate-600">
              {project.shortDescription}
            </p>
          </div>

          {/* YouTube Video Embed */}
          {embedUrl && (
            <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 ml-2 mt-2">
                <PlaySquare className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-slate-800">Watch Live Demo & Setup</h3>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                <iframe
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Checkout Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl sticky top-8">
            <div className="mb-6">
              <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">One-time payment</span>
              <div className="text-5xl font-extrabold text-slate-900 mt-2">
                ${project.price}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Tech Stack Used:</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-8 text-sm text-slate-600">
              <p className="flex items-center gap-2">✓ Full Source Code Access</p>
              <p className="flex items-center gap-2">✓ Database Export Files</p>
              <p className="flex items-center gap-2">✓ Setup Instructions</p>
              <p className="flex items-center gap-2">✓ Instant Download</p>
            </div>

            {/* GUMROAD REDIRECT BUTTON */}
            <a 
              href={project.gumroadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" /> Buy on Gumroad
            </a>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              Payments are securely processed by Gumroad.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}