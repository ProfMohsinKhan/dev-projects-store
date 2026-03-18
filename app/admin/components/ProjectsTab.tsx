"use client";
import { useState, useEffect, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { Edit, Trash2, X, Loader2, Link as LinkIcon, Database } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLastDoc, setProjectsLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState(""); 
  const [thumbnailUrl, setThumbnailUrl] = useState(""); 
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState(""); 
  const [difficulty, setDifficulty] = useState("Intermediate"); 
  const [downloadsCount, setDownloadsCount] = useState(""); 
  const [whatsIncluded, setWhatsIncluded] = useState(""); 
  const [techStack, setTechStack] = useState("");
  const [features, setFeatures] = useState("");
  
  const [cashfreeLink, setCashfreeLink] = useState("");
  const [gumroadLink, setGumroadLink] = useState("");
  const [instamojoLink, setInstamojoLink] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchInitialProjects(); }, []);

  const fetchInitialProjects = async () => {
    setLoadingProjects(true);
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
    const snapshot = await getDocs(q);
    setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setProjectsLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMoreProjects(snapshot.docs.length === ITEMS_PER_PAGE);
    setLoadingProjects(false);
  };

  const loadMoreProjects = async () => {
    if (!projectsLastDoc) return;
    setLoadingProjects(true);
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), startAfter(projectsLastDoc), limit(ITEMS_PER_PAGE));
    const snapshot = await getDocs(q);
    setProjects(prev => [...prev, ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))]);
    setProjectsLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMoreProjects(snapshot.docs.length === ITEMS_PER_PAGE);
    setLoadingProjects(false);
  };

  const resetForm = () => {
    setTitle(""); setSlug(""); setShortDescription(""); setYoutubeUrl(""); 
    setPrice(""); setOriginalPrice(""); setThumbnailUrl("");
    setCategory(""); setDifficulty("Intermediate"); setDownloadsCount("");
    setWhatsIncluded(""); setTechStack(""); setFeatures(""); 
    setCashfreeLink(""); setGumroadLink(""); setInstamojoLink(""); setDriveLink("");
    setEditingId(null);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title || ""); setSlug(project.slug || "");
    setShortDescription(project.shortDescription || ""); setYoutubeUrl(project.youtubeUrl || "");
    setPrice(project.price ? project.price.toString() : ""); 
    setOriginalPrice(project.originalPrice ? project.originalPrice.toString() : "");
    setThumbnailUrl(project.thumbnailUrl || ""); setCategory(project.category || ""); 
    setDifficulty(project.difficulty || "Intermediate"); 
    setDownloadsCount(project.downloadsCount ? project.downloadsCount.toString() : ""); 
    setWhatsIncluded(project.whatsIncluded?.join ? project.whatsIncluded.join(", ") : ""); 
    setTechStack(project.techStack?.join ? project.techStack.join(", ") : ""); 
    setFeatures(project.features?.join ? project.features.join(", ") : ""); 
    setCashfreeLink(project.cashfreeLink || project.paymentUrl || "");
    setGumroadLink(project.gumroadLink || ""); setInstamojoLink(project.instamojoLink || ""); setDriveLink(project.driveLink || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
      setProjects(prev => prev.filter(p => p.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    try {
      const projectData = {
        title, slug, shortDescription, youtubeUrl, thumbnailUrl, category, difficulty,
        price: Number(price), originalPrice: Number(originalPrice), downloadsCount: Number(downloadsCount) || 0,
        techStack: techStack.split(",").map(item => item.trim()).filter(i => i), 
        features: features.split(",").map(item => item.trim()).filter(i => i),
        whatsIncluded: whatsIncluded.split(",").map(item => item.trim()).filter(i => i),
        cashfreeLink, gumroadLink, instamojoLink, driveLink,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        setSuccessMsg("Project updated successfully!");
        setProjects(prev => prev.map(p => p.id === editingId ? { id: editingId, ...projectData } : p));
      } else {
        const docRef = await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date() });
        setSuccessMsg("Project added successfully!");
        setProjects(prev => [{ id: docRef.id, ...projectData }, ...prev]);
      }
      resetForm();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) { alert("Error saving project"); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Area */}
      <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{editingId ? "Edit Project" : "Add New Project"}</h2>
          {editingId && <button onClick={resetForm} className="text-sm flex items-center text-slate-500 hover:text-slate-800"><X className="w-4 h-4 mr-1"/> Cancel Edit</button>}
        </div>
        {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded mb-6 border border-green-200 font-medium">{successMsg}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-semibold mb-1">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Slug (URL)</label><input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} required className="w-full p-3 border rounded" /></div>
          </div>
          <div><label className="block text-sm font-semibold mb-1">Short Description</label><textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required className="w-full p-3 border rounded" rows={2} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-semibold mb-1">Selling Price (₹)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-3 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Original Price (₹)</label><input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3 border rounded" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div><label className="block text-sm font-semibold mb-1">Category</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-3 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Difficulty</label><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border rounded bg-white"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
            <div><label className="block text-sm font-semibold mb-1">Downloads Count</label><input type="number" value={downloadsCount} onChange={(e) => setDownloadsCount(e.target.value)} className="w-full p-3 border rounded" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-semibold mb-1">Thumbnail URL</label><input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full p-3 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">YouTube Video URL</label><input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full p-3 border rounded" /></div>
          </div>
          {/* Payment Links */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2"><LinkIcon className="w-4 h-4 text-blue-600" /> Payment & Delivery Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold mb-1 uppercase">Cashfree Link</label><input type="url" value={cashfreeLink} onChange={(e) => setCashfreeLink(e.target.value)} className="w-full p-3 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1 uppercase">Instamojo Link</label><input type="url" value={instamojoLink} onChange={(e) => setInstamojoLink(e.target.value)} className="w-full p-3 border rounded text-sm" /></div>
            </div>
            <div><label className="block text-xs font-bold mb-1 uppercase">Gumroad Link</label><input type="url" value={gumroadLink} onChange={(e) => setGumroadLink(e.target.value)} className="w-full p-3 border rounded text-sm" /></div>
            <div className="pt-2"><label className="flex items-center gap-2 text-xs font-bold text-green-700 mb-1 uppercase"><Database className="w-4 h-4" /> Google Drive Link</label><input type="url" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} className="w-full p-3 border border-green-300 rounded text-sm" /></div>
          </div>
          <div><label className="block text-sm font-semibold mb-1">Tech Stack (Comma sep)</label><input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} required className="w-full p-3 border rounded" /></div>
          <div><label className="block text-sm font-semibold mb-1">What's Included</label><textarea value={whatsIncluded} onChange={(e) => setWhatsIncluded(e.target.value)} required className="w-full p-3 border rounded" rows={2} /></div>
          <div><label className="block text-sm font-semibold mb-1">Key Features</label><textarea value={features} onChange={(e) => setFeatures(e.target.value)} required className="w-full p-3 border rounded" rows={3} /></div>
          <button type="submit" className={`w-full text-white font-bold p-4 rounded-xl ${editingId ? 'bg-green-600' : 'bg-slate-900'}`}>{editingId ? "Update Project" : "Publish Project"}</button>
        </form>
      </div>
      {/* List Area */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 sticky top-0 bg-white pb-2 border-b">Live Projects ({projects.length})</h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="p-4 border rounded-xl bg-slate-50 relative">
              <h3 className="font-bold truncate pr-12">{p.title}</h3>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">₹{p.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {hasMoreProjects && <button onClick={loadMoreProjects} disabled={loadingProjects} className="w-full py-3 bg-slate-100 font-bold rounded-xl flex items-center justify-center gap-2">{loadingProjects ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load More"}</button>}
        </div>
      </div>
    </div>
  );
}

//