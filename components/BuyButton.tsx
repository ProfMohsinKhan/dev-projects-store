"use client";
import { useState } from "react";
import { ShoppingCart, X, CreditCard, Globe, MessageCircle, Clock, Loader2 } from "lucide-react";
// 🔥 Naya SDK import
import { load } from '@cashfreepayments/cashfree-js';

export default function BuyButton({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCashfree, setLoadingCashfree] = useState(false);

  const waMessage = encodeURIComponent(
    `Hi Mohsin, I want to purchase the '${project.title}' source code for ₹${project.price}. Please share the direct UPI details.`
  );
  const waLink = `https://wa.me/918369286385?text=${waMessage}`;

  // 🔥 SDK WALA CHECKOUT
  const handleSecureCheckout = async () => {
    setLoadingCashfree(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });

      const data = await response.json();

      if (data.payment_session_id) {
        // SDK Load karo (Ab backend batayega ki Production kholna hai ya Sandbox)
        const cashfree = await load({
          mode: data.environment, 
        });

        // Checkout page open karo
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self" 
        });
      } else {
        alert("Error creating order: " + (data.error || "Please try again."));
        setLoadingCashfree(false);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong. Please check your internet connection.");
      setLoadingCashfree(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="w-full group flex items-center justify-center gap-3 bg-blue-600 hover:bg-slate-900 text-white text-xl font-black py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-200">
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        GET SOURCE CODE
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl text-slate-900">Select Payment Mode</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">Choose how you want to pay</p>
              </div>
              <button onClick={() => setIsOpen(false)} disabled={loadingCashfree} className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-slate-100 disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button onClick={handleSecureCheckout} disabled={loadingCashfree} className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:border-blue-600 hover:shadow-md transition-all group disabled:opacity-70 disabled:cursor-not-allowed">
                <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {loadingCashfree ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Pay via UPI / Cards</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{loadingCashfree ? "Generating Secure Link..." : "Instant Download (Cashfree)"}</p>
                </div>
              </button>

              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed">
                <div className="bg-slate-200 p-3 rounded-xl text-slate-500"><Clock className="w-6 h-6" /></div>
                <div className="flex-grow"><h4 className="font-bold text-slate-400">Instamojo</h4><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Under Review</p></div><span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-1 rounded">Coming Soon</span>
              </div>

              {project.gumroadLink && (
                <a href={project.gumroadLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border-2 border-purple-100 bg-purple-50 hover:border-purple-600 hover:shadow-md transition-all group">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Globe className="w-6 h-6" /></div>
                  <div><h4 className="font-bold text-slate-900">International Payment</h4><p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Pay via PayPal (Gumroad)</p></div>
                </a>
              )}

              <div className="flex items-center gap-3 py-2">
                <div className="h-px bg-slate-200 flex-grow"></div><span className="text-xs font-black text-slate-400 uppercase tracking-widest">OR</span><div className="h-px bg-slate-200 flex-grow"></div>
              </div>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-lg transition-all shadow-md hover:shadow-lg hover:shadow-green-200">
                <MessageCircle className="w-6 h-6" /> Buy via WhatsApp
              </a>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Get direct GPay/PhonePe details instantly.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}