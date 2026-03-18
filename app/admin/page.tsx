"use client";
import { useState, useEffect, FormEvent } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { ListTodo, FolderGit2 } from "lucide-react";

import ProjectsTab from "./components/ProjectsTab";
import RequestsTab from "./components/RequestsTab";

const ADMIN_EMAIL = "mohsin.mohsin6@gmail.com";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<'projects' | 'requests'>('projects');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (email !== ADMIN_EMAIL) return setLoginError("Unauthorized Email");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) { setLoginError("Invalid email or password"); }
  };

  const handleLogout = async () => await signOut(auth);

  if (loading) return <div className="p-10 text-center font-bold">Loading Admin...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Admin Login</h2>
          {loginError && <p className="text-red-500 mb-4 text-sm">{loginError}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mb-4 p-3 border rounded" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mb-6 p-3 border rounded" />
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
          <button onClick={handleLogout} className="text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg">Logout</button>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}>
            <FolderGit2 className="w-5 h-5" /> Manage Projects
          </button>
          <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}>
            <ListTodo className="w-5 h-5" /> Student Requests
          </button>
        </div>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'projects' ? <ProjectsTab /> : <RequestsTab />}

    </div>
  );
}