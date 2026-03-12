import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

// Server-side function to fetch projects (Best for SEO)
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
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Premium Source Code for <span className="text-blue-600">Developers & Students</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Pass your final year submissions with confidence. Get production-ready full-stack projects, 
            complete API documentation, and step-by-step setup guides.
          </p>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Terminal className="text-blue-600 w-8 h-8" />
          <h2 className="text-3xl font-bold text-slate-900">Latest Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {project.title}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 text-lg font-bold px-3 py-1 rounded-full">
                    ${project.price}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                  {project.shortDescription}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack?.map((tech: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 mt-auto">
                <Link 
                  href={`/projects/${project.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  View Details & Buy <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}