"use client";
import { useState, useEffect, FormEvent } from "react";
import { db, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Edit, Trash2, X } from "lucide-react";

const ADMIN_EMAIL = "mohsin.mohsin6@gmail.com";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States (Old + New Fields)
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(""); 
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState(""); // Naya
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Naya
  const [category, setCategory] = useState(""); // Naya
  const [difficulty, setDifficulty] = useState("Intermediate"); // Naya
  const [whatsIncluded, setWhatsIncluded] = useState(""); // Naya
  const [techStack, setTechStack] = useState("");
  const [features, setFeatures] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.email === ADMIN_EMAIL) {
        fetchProjects();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
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
      fetchProjects();
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
    setCategory(""); setDifficulty("Intermediate"); setWhatsIncluded("");
    setTechStack(""); setFeatures(""); setEditingId(null);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title || "");
    setSlug(project.slug || "");
    setShortDescription(project.shortDescription || "");
    setYoutubeUrl(project.youtubeUrl || "");
    setPaymentUrl(project.paymentUrl || project.gumroadUrl || ""); 
    setPrice(project.price ? project.price.toString() : ""); 
    setOriginalPrice(project.originalPrice ? project.originalPrice.toString() : ""); // Naya
    setThumbnailUrl(project.thumbnailUrl || ""); // Naya
    setCategory(project.category || ""); // Naya
    setDifficulty(project.difficulty || "Intermediate"); // Naya
    setWhatsIncluded(project.whatsIncluded?.join ? project.whatsIncluded.join(", ") : ""); // Naya
    setTechStack(project.techStack?.join ? project.techStack.join(", ") : ""); 
    setFeatures(project.features?.join ? project.features.join(", ") : ""); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        fetchProjects();
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
      const includedArray = whatsIncluded.split(",").map(item => item.trim()).filter(i => i); // Naya

      const projectData = {
        title, slug, shortDescription, youtubeUrl, paymentUrl, thumbnailUrl, category, difficulty,
        price: Number(price), 
        originalPrice: Number(originalPrice),
        techStack: techArray, 
        features: featuresArray,
        whatsIncluded: includedArray,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        setSuccessMsg("Project updated successfully!");
      } else {
        await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date() });
        setSuccessMsg("Project added successfully!");
      }

      resetForm();
      fetchProjects();
      
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
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-slate-900">DevStore Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
      </div>

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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price (₹) <span className="text-gray-400 font-normal">(For Strikethrough)</span></label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3 border rounded text-slate-900" placeholder="e.g. 8000" />
              </div>
            </div>

            {/* Category & Difficulty Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-3 border rounded text-slate-900" placeholder="e.g. Android App, Web App" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty Level</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border rounded text-slate-900 bg-white">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* URLs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full p-3 border rounded text-slate-900" placeholder="https://..." />
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

            {/* Arrays Row */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tech Stack (Comma separated)</label>
              <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} required className="w-full p-3 border rounded text-slate-900" placeholder="Laravel, React, Kotlin" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">What's Included (Comma separated)</label>
              <textarea value={whatsIncluded} onChange={(e) => setWhatsIncluded(e.target.value)} required className="w-full p-3 border rounded text-slate-900" rows={2} placeholder="Full Source Code, SQL File, Setup Guide" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Key Features (Comma separated)</label>
              <textarea value={features} onChange={(e) => setFeatures(e.target.value)} required className="w-full p-3 border rounded text-slate-900" rows={3} placeholder="Live Tracking, Dashboard, API Access" />
            </div>

            <button type="submit" className={`w-full text-white font-bold p-4 rounded-xl transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-blue-600'}`}>
              {editingId ? "Update Project" : "Publish Project"}
            </button>
          </form>
        </div>

        {/* RIGHT/BOTTOM: Projects List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit max-h-[85vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6 sticky top-0 bg-white pb-2 border-b">Live Projects ({projects.length})</h2>
          
          {projects.length === 0 ? (
            <p className="text-slate-500 text-sm">No projects found. Add one!</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-xl hover:border-blue-300 transition-colors bg-slate-50">
                  <h3 className="font-bold text-slate-900 truncate mb-1" title={project.title}>{project.title}</h3>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}