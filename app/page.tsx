import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Zap } from "lucide-react"; 
import ProjectGrid from "../components/ProjectGrid";
import { Suspense } from "react"; // 🔥 1. Yahan Suspense import kiya

export const revalidate = 60;

async function getProjects() {
  const projectsCol = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCol);
  
  return projectSnapshot.docs.map(doc => {
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      // Firebase Timestamps ko normal plain string mein convert kar rahe hain
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    };
  });
}

export default async function Home() {
  const projects = await getProjects(); // Firebase se saara data laya

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

      {/* 🔥 2. Yahan ProjectGrid ko Suspense se wrap kar diya */}
      <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading Projects...</div>}>
        <ProjectGrid initialProjects={projects} />
      </Suspense>
      
    </main>
  );
}