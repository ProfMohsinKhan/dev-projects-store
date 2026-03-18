"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { Trash2, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function RequestsTab() {
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [requestsLastDoc, setRequestsLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMoreRequests, setHasMoreRequests] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => { fetchInitialRequests(); }, []);

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

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    let status = "Pending";
    if (newProgress > 0 && newProgress < 100) status = "In-Progress";
    if (newProgress === 100) status = "Completed";
    await updateDoc(doc(db, "requests", id), { progress: newProgress, status });
    setRequestsList(prev => prev.map(req => req.id === id ? { ...req, progress: newProgress, status } : req));
  };

  const handleDeleteRequest = async (id: string) => {
    if (window.confirm("Delete this request?")) {
      await deleteDoc(doc(db, "requests", id));
      setRequestsList(prev => prev.filter(req => req.id !== id));
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Manage Project Requests</h2>
      {requestsList.length === 0 && !loadingRequests ? (
        <p className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl">No requests received yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {requestsList.map((req) => (
              <div key={req.id} className="p-6 rounded-2xl border bg-slate-50 relative">
                <button onClick={() => handleDeleteRequest(req.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                <div className="mb-4 pr-8">
                  <h3 className="font-black text-lg">{req.userName}</h3>
                  <a href={`mailto:${req.userEmail}`} className="text-sm text-blue-600 hover:underline">{req.userEmail}</a>
                </div>
                <div className="bg-white p-4 rounded-xl border mb-4 text-sm">{req.requirement}</div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold uppercase text-slate-500">Expected Budget:</span>
                  <span className="font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg">₹{req.expectedAmount || "N/A"}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold">Progress</label>
                    <span className="text-xs font-black uppercase px-2 py-1 rounded bg-slate-200">{req.status || 'Pending'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="range" min="0" max="100" step="10" value={req.progress || 0} onChange={(e) => handleUpdateProgress(req.id, parseInt(e.target.value))} className="flex-grow accent-blue-600" />
                    <span className="font-black w-12 text-right">{req.progress || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMoreRequests && (
            <div className="flex justify-center">
              <button onClick={loadMoreRequests} disabled={loadingRequests} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2">
                {loadingRequests ? <Loader2 className="w-5 h-5 animate-spin" /> : "Load More Requests"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}