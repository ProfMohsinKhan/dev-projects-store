"use client"; 

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 🔥 1. Ye naya import add kiya
import { ArrowRight, Terminal, Flame, Search } from "lucide-react";

export default function ProjectGrid({ initialProjects }: { initialProjects: any[] }) {
  const searchParams = useSearchParams(); // 🔥 2. URL params padhne ke liye
  
  // 🔥 3. Default state URL se aayegi, ya fir khali string rahegi
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // 🔥 4. Jab bhi URL mein 'q' change hoga (Navbar search se), ye update ho jayega
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchTerm(query);
    setCurrentPage(1);
  }, [searchParams]);

  // Pehle projects ko search term ke hisaab se filter karo (Bulletproof Version)
  const filteredProjects = initialProjects.filter((project) => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;

    const matchTitle = project.title?.toLowerCase().includes(searchLower) || false;
    const matchCategory = project.category?.toLowerCase().includes(searchLower) || false;
    const matchTech = Array.isArray(project.techStack) 
      ? project.techStack.some((tech: string) => tech?.toLowerCase().includes(searchLower))
      : false;

    // 🔥 Ek naya check: 'difficulty' ke liye bhi (Kyunki 'advance' type kiya tha)
    const matchDifficulty = project.difficulty?.toLowerCase().includes(searchLower) || false;

    return matchTitle || matchCategory || matchTech || matchDifficulty; // matchDifficulty bhi add kar diya
  });

  // Fir filtered projects par pagination lagao
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Search Bar & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-3">
          <Terminal className="text-blue-600 w-8 h-8" />
          <h2 className="text-3xl font-bold text-slate-900">Latest Projects</h2>
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name, category, or tech..."
            value={searchTerm} // 🔥 Ab ye URL aur input dono se sync rahega
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {currentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project: any) => {
            const discount = project.originalPrice
              ? Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100)
              : 0;

            return (
               <div key={project.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
                 <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400"><Terminal className="w-12 h-12" /></div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2"><span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm text-slate-900 text-xs font-bold rounded-lg uppercase tracking-wider">{project.category || "Project"}</span></div>
                    {discount > 0 && <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-lg">{discount}% OFF</div>}
                 </div>

                 <div className="p-6 flex-grow">
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-100">{project.difficulty || 'Intermediate'}</span>
                     {project.downloadsCount > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wider">
                          <Flame className="w-3 h-3" /> {project.downloadsCount}+ Downloads
                        </span>
                     )}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                   <div className="flex items-baseline gap-2 mb-4">
                     <span className="text-2xl font-black text-slate-900">₹{project.price}</span>
                   </div>
                   <p className="text-slate-600 text-sm mb-6 line-clamp-2">{project.shortDescription}</p>
                 </div>

                 <div className="p-6 pt-0 mt-auto">
                    <Link href={`/projects/${project.slug}`} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-blue-200">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
               </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 text-xl">
          Bhai, is search ke hisaab se koi project nahi mila 😅
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          <button 
            onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border font-medium ${currentPage === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Prev
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1} onClick={() => paginate(index + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border font-bold ${currentPage === index + 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              {index + 1}
            </button>
          ))}

          <button 
            onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border font-medium ${currentPage === totalPages ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}