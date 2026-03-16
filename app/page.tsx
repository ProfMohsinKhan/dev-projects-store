import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, Terminal, Zap, Flame } from "lucide-react"; // Flame icon add kiya hai
import RequestSection from "../components/RequestSection"; 

export const revalidate = 60;

async function getProjects() {
  const projectsCol = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCol);
  return projectSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Zap className="w-4 h-4" /> Trusted by 500+ Students
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Premium Source Code for <span className="text-blue-600">Developers & Students</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Pass your final year submissions with confidence. Get production-ready full-stack projects, 
            complete documentation, and step-by-step setup guides.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Terminal className="text-blue-600 w-8 h-8" />
            <h2 className="text-3xl font-bold text-slate-900">Latest Projects</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => {
            const discount = project.originalPrice 
              ? Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100) 
              : 0;

            return (
              <div 
                key={project.id} 
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {project.thumbnailUrl ? (
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                      <Terminal className="w-12 h-12" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm text-slate-900 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {project.category || "Project"}
                    </span>
                  </div>
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-6 flex-grow">
                  {/* Difficulty & Downloads Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      project.difficulty === 'Advanced' ? 'bg-red-50 text-red-600 border-red-100' : 
                      project.difficulty === 'Beginner' ? 'bg-green-50 text-green-600 border-green-100' : 
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {project.difficulty || 'Intermediate'}
                    </span>

                    {/* 🔥 NAYA UPDATE: Downloads Count Badge */}
                    {project.downloadsCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wider">
                        <Flame className="w-3 h-3" /> {project.downloadsCount}+ Downloads
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-slate-900">₹{project.price}</span>
                    {project.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">₹{project.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 3).map((tech: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded border border-slate-100 uppercase">
                        {tech}
                      </span>
                    ))}
                    {project.techStack?.length > 3 && <span className="text-[10px] text-slate-400 font-bold">+{project.techStack.length - 3} More</span>}
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-blue-200"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    
      
    </main>
  );
}