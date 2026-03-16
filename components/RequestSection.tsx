"use client";
import { useState, useEffect, FormEvent } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, limit } from "firebase/firestore"; // NAYA: limit import kiya
import { Activity } from "lucide-react";

export default function RequestSection() {
  const [requests, setRequests] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [requirement, setRequirement] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing requests for the Live Board (Only latest 10)
  const fetchRequests = async () => {
    // 🔥 NAYA UPDATE: limit(10) add kiya gaya hai
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(10));
    const snapshot = await getDocs(q);
    setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "requests"), {
        userName,
        userEmail,
        requirement,
        expectedAmount: Number(expectedAmount), 
        progress: 0,
        status: "Pending",
        createdAt: serverTimestamp()
      });
      alert("Project request submitted successfully! We will review it soon.");
      setUserName(""); setUserEmail(""); setRequirement(""); setExpectedAmount("");
      fetchRequests(); // Board ko turant update karne ke liye
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="bg-slate-900 py-20 px-4 text-white border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT SIDE: Request Form */}
        <div>
          <h2 className="text-3xl font-black mb-4"> Can't find your project?</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Submit your requirement below. Our team will review your request, and if selected, we will build it and update the progress on the live board!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none" />
              <input type="email" placeholder="Email Address" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none" />
            </div>
            <textarea placeholder="Describe your project requirements in detail..." value={requirement} onChange={(e) => setRequirement(e.target.value)} required className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white h-32 focus:border-blue-500 outline-none" />
            
            {/* Expected Amount Field */}
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Your Expected Budget (₹)</label>
              <input type="number" placeholder="e.g. 1500" value={expectedAmount} onChange={(e) => setExpectedAmount(e.target.value)} required className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none" />
            </div>

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-blue-900 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Project Request"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Live Progress Board */}
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Activity className="text-blue-500 w-6 h-6" /> Live Request Board
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latest 10</span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live
              </span>
            </div>
          </div>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {requests.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No requests yet. Be the first to request a project!</p>
            ) : (
              requests.map(req => (
                <div key={req.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-slate-200 font-bold text-sm leading-tight max-w-[70%]">
                      {req.requirement.length > 60 ? req.requirement.substring(0, 60) + '...' : req.requirement}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                      req.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      req.status === 'In-Progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {req.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        req.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`} style={{ width: `${req.progress || 0}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-8">{req.progress || 0}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}