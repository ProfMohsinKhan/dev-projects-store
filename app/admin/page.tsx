"use client";
import { useState, useEffect, FormEvent } from "react";
import { db, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { Edit, Trash2, X, ListTodo, FolderGit2, Loader2 } from "lucide-react";

const ADMIN_EMAIL = "mohsin.mohsin6@gmail.com";
const ITEMS_PER_PAGE = 10; // Ek baar mein kitne items load honge

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tabs State
  const [activeTab, setActiveTab] = useState<'projects' | 'requests'>('projects');

  // ================= PROJECTS PAGINATION STATE =================
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLastDoc, setProjectsLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ================= REQUESTS PAGINATION STATE =================
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [requestsLastDoc, setRequestsLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMoreRequests, setHasMoreRequests] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Form States (Old + New Fields)
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(""); 
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState(""); 
  const [thumbnailUrl, setThumbnailUrl] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [difficulty, setDifficulty] = useState("Intermediate"); 
  const [downloadsCount, setDownloadsCount] = useState(""); 
  const [whatsIncluded, setWhatsIncluded] = useState(""); 
  const [techStack, setTechStack] = useState("");
  const [features, setFeatures] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.email === ADMIN_EMAIL) {
        fetchInitialProjects();
        fetchInitialRequests(); 
      }
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH PROJECTS LOGIC =================
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

  // ================= FETCH REQUESTS LOGIC =================
  const fetchInitialRequests = async () => {
    setLoadingRequests(true);
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
    const snapshot = await getDocs(q);
    
    setRequestsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setRequestsLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMoreRequests(snapshot.docs.length === ITEMS_PER_PAGE);
    setLoadingRequests(false);
  };

  const loadMoreRequests = async () => {
    if (!requestsLastDoc) return;
    setLoadingRequests(true);
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), startAfter(requestsLastDoc), limit(ITEMS_PER_PAGE));
    const snapshot = await getDocs(q);
    
    setRequestsList(prev => [...prev, ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))]);
    setRequestsLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMoreRequests(snapshot.docs.length === ITEMS_PER_PAGE);
    setLoadingRequests(false);
  };

  // ================= ACTION HANDLERS =================
  const handleUpdateProgress = async (id: string, newProgress: number) => {
    let status = "Pending";
    if (newProgress > 0 && newProgress < 100) status = "In-Progress";
    if (newProgress === 100) status = "Completed";

    try {
      await updateDoc(doc(db, "requests", id), { progress: newProgress, status });
      // Note: Hum list refresh nahi kar rahe taaki load more state reset na ho.
      // Sirf UI me locally update kar dete hain (optimistic update).
      setRequestsList(prev => prev.map(req => req.id === id ? { ...req, progress: newProgress, status } : req));
    } catch (error) {
      alert("Error updating progress");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteDoc(doc(db, "requests", id));
        setRequestsList(prev => prev.filter(req => req.id !== id));
      } catch (error) {
        alert("Error deleting request");
      }
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (email !== ADMIN_EMAIL) {
      setLoginError("Unauthorized Email");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      fetchInitialProjects();
      fetchInitialRequests();
    } catch (error: any) {
      setLoginError("Invalid email or password");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const resetForm = () => {
    setTitle(""); setSlug(""); setShortDescription(""); setYoutubeUrl(""); 
    setPaymentUrl(""); setPrice(""); setOriginalPrice(""); setThumbnailUrl("");
    setCategory(""); setDifficulty("Intermediate"); setDownloadsCount("");
    setWhatsIncluded(""); setTechStack(""); setFeatures(""); setEditingId(null);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title || "");
    setSlug(project.slug || "");
    setShortDescription(project.shortDescription || "");
    setYoutubeUrl(project.youtubeUrl || "");
    setPaymentUrl(project.paymentUrl || project.gumroadUrl || ""); 
    setPrice(project.price ? project.price.toString() : ""); 
    setOriginalPrice(project.originalPrice ? project.originalPrice.toString() : "");
    setThumbnailUrl(project.thumbnailUrl || ""); 
    setCategory(project.category || ""); 
    setDifficulty(project.difficulty || "Intermediate"); 
    setDownloadsCount(project.downloadsCount ? project.downloadsCount.toString() : ""); 
    setWhatsIncluded(project.whatsIncluded?.join ? project.whatsIncluded.join(", ") : ""); 
    setTechStack(project.techStack?.join ? project.techStack.join(", ") : ""); 
    setFeatures(project.features?.join ? project.features.join(", ") : ""); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(prev => prev.filter(p => p.id !== id));
        if (editingId === id) resetForm();
      } catch (error) {
        alert("Error deleting project");
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    try {
      const techArray = techStack.split(",").map(item => item.trim()).filter(i => i);
      const featuresArray = features.split(",").map(item => item.trim()).filter(i => i);
      const includedArray = whatsIncluded.split(",").map(item => item.trim()).filter(i => i); 

      const projectData = {
        title, slug, shortDescription, youtubeUrl, paymentUrl, thumbnailUrl, category, difficulty,
        price: Number(price), 
        originalPrice: Number(originalPrice),
        downloadsCount: Number(downloadsCount) || 0,
        techStack: techArray, 
        features: featuresArray,
        whatsIncluded: includedArray,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        setSuccessMsg("Project updated successfully!");
        // Update local state instead of re-fetching everything
        setProjects(prev => prev.map(p => p.id === editingId ? { id: editingId, ...projectData } : p));
      } else {
        const docRef = await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date() });
        setSuccessMsg("Project added successfully!");
        setProjects(prev => [{ id: docRef.id, ...projectData }, ...prev]);
      }

      resetForm();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: any) {
      console.error("Error saving project: ", error);
      alert("Error saving project");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Admin Login</h2>
          {loginError && <p className="text-red-500 mb-4 text-sm">{loginError}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mb-4 p-3 border rounded text-slate-900" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mb-6 p-3 border rounded text-slate-900" />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      
      {/* HEADER & TABS */}
      <div className="max-w-7xl mx-auto mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-slate-900">DevStore Admin</h1>
          <button onClick={handleLogout} className="text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('projects')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <FolderGit2 className="w-5 h-5" /> Manage Projects
          </button>
          <button 
            onClick={() => setActiveTab('requests')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <ListTodo className="w-5 h-5" /> Student Requests
            {requestsList.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{requestsList.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ======================= TAB: PROJECTS ======================= */}
      {activeTab === 'projects' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT/TOP: Form Area */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{editingId ? "Edit Project" : "Add New Project"}</h2>
              {editingId && (
                <button onClick={resetForm} className="text-sm flex items-center text-slate-500 hover:text-slate-800">
                  <X className="w-4 h-4 mr-1"/> Cancel Edit
                </button>
              )}
            </div>

            {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded mb-6 border border-green-200 font-medium">{successMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border rounded text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Slug (URL)</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} required className="w-full p-3 border rounded text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required className="w-full p-3 border rounded text-slate-900" rows={2} />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-3 border rounded text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3 border rounded text-slate-900" />
                </div>
              </div>

              {/* Category, Difficulty & Downloads Row (Naya Update) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-3 border rounded text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border rounded text-slate-900 bg-white">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Downloads Count</label>
                  <input type="number" value={downloadsCount} onChange={(e) => setDownloadsCount(e.target.value)} className="w-full p-3 border rounded text-slate-900" placeholder="e.g. 150" />
                </div>
              </div>

              {/* URLs Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
                  <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full p-3 border rounded text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Payment URL (Cashfree Link)</label>
                  <input type="url" value={paymentUrl} onChange={(e) => setPaymentUrl(e.target.value)} required className="w-full p-3 border rounded text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">YouTube Video URL (Optional)</label>
                <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full p-3 border rounded text-slate-900" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tech Stack (Comma separated)</label>
                <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} required className="w-full p-3 border rounded text-slate-900" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">What's Included (Comma separated)</label>
                <textarea value={whatsIncluded} onChange={(e) => setWhatsIncluded(e.target.value)} required className="w-full p-3 border rounded text-slate-900" rows={2} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Key Features (Comma separated)</label>
                <textarea value={features} onChange={(e) => setFeatures(e.target.value)} required className="w-full p-3 border rounded text-slate-900" rows={3} />
              </div>

              <button type="submit" className={`w-full text-white font-bold p-4 rounded-xl transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-blue-600'}`}>
                {editingId ? "Update Project" : "Publish Project"}
              </button>
            </form>
          </div>

          {/* RIGHT/BOTTOM: Projects List with Load More */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-6 sticky top-0 bg-white pb-2 border-b">Live Projects ({projects.length})</h2>
            
            {projects.length === 0 && !loadingProjects ? (
              <p className="text-slate-500 text-sm">No projects found. Add one!</p>
            ) : (
              <div className="space-y-4 flex-grow">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-xl hover:border-blue-300 transition-colors bg-slate-50 relative">
                    <h3 className="font-bold text-slate-900 truncate mb-1 pr-12" title={project.title}>{project.title}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">₹{project.price}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(project)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Projects Button */}
                {hasMoreProjects && (
                  <button 
                    onClick={loadMoreProjects} 
                    disabled={loadingProjects}
                    className="w-full mt-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    {loadingProjects ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load More Projects"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB: REQUESTS ======================= */}
      {activeTab === 'requests' && (
        <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Project Requests</h2>
          
          {requestsList.length === 0 && !loadingRequests ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No requests received yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {requestsList.map((req) => (
                  <div key={req.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm relative">
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDeleteRequest(req.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="mb-4 pr-8">
                      <h3 className="font-black text-lg text-slate-900">{req.userName}</h3>
                      <a href={`mailto:${req.userEmail}`} className="text-sm text-blue-600 hover:underline">{req.userEmail}</a>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">{req.requirement}</p>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Expected Budget:</span>
                      <span className="font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                        ₹{req.expectedAmount || "N/A"}
                      </span>
                    </div>

                    {/* Progress Controller */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-slate-700">Project Progress</label>
                        <span className={`text-xs font-black uppercase px-2 py-1 rounded ${
                          req.progress === 100 ? 'bg-green-100 text-green-700' : 
                          req.progress > 0 ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {req.status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" max="100" step="10"
                          value={req.progress || 0} 
                          onChange={(e) => handleUpdateProgress(req.id, parseInt(e.target.value))}
                          className="flex-grow accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                        <span className="font-black text-slate-900 w-12 text-right">{req.progress || 0}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 text-center">Move the slider to update progress. It auto-saves.</p>
                    </div>

                  </div>
                ))}
              </div>

              {/* Load More Requests Button */}
              {hasMoreRequests && (
                <div className="flex justify-center">
                  <button 
                    onClick={loadMoreRequests} 
                    disabled={loadingRequests}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {loadingRequests ? <Loader2 className="w-5 h-5 animate-spin" /> : "Load More Requests"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}