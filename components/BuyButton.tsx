"use client";
import { useState } from "react";
import { ShoppingCart, X, CreditCard, Globe, MessageCircle, Clock, Loader2 } from "lucide-react";

export default function BuyButton({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCashfree, setLoadingCashfree] = useState(false); // Naya loading state

  // WhatsApp auto-message
  const waMessage = encodeURIComponent(
    `Hi Mohsin, I want to purchase the '${project.title}' source code for ₹${project.price}. Please share the direct UPI details.`
  );
  const waLink = `https://wa.me/918369286385?text=${waMessage}`;

  // 🔥 SECURE CHECKOUT FUNCTION
  const handleSecureCheckout = async () => {
    setLoadingCashfree(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id, // Backend is ID se real price nikalega
          // Note: Abhi hum default name/email bhej rahe hain backend me. 
          // Future mein yahan user input form laga sakte hain.
        }),
      });

      const data = await response.json();

      if (data.payment_url) {
        // Cashfree ke unique secure payment link par redirect kardo
        window.location.href = data.payment_url;
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
      {/* Main Buy Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full group flex items-center justify-center gap-3 bg-blue-600 hover:bg-slate-900 text-white text-xl font-black py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-200"
      >
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        GET SOURCE CODE
      </button>

      {/* SMART POPUP MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl text-slate-900">Select Payment Mode</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">Choose how you want to pay</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                disabled={loadingCashfree}
                className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-slate-100 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* 🔥 Option 1: Cashfree Secure API Checkout */}
              <button 
                onClick={handleSecureCheckout}
                disabled={loadingCashfree}
                className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:border-blue-600 hover:shadow-md transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {loadingCashfree ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Pay via UPI / Cards</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {loadingCashfree ? "Generating Secure Link..." : "Instant Download (Cashfree)"}
                  </p>
                </div>
              </button>

              {/* Option 2: Instamojo (Coming Soon) */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed">
                <div className="bg-slate-200 p-3 rounded-xl text-slate-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-400">Instamojo</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Under Review</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-1 rounded">Coming Soon</span>
              </div>

              {/* Option 3: Gumroad (International) */}
              {project.gumroadLink && (
                <a href={project.gumroadLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border-2 border-purple-100 bg-purple-50 hover:border-purple-600 hover:shadow-md transition-all group">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">International Payment</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Pay via PayPal (Gumroad)</p>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-3 py-2">
                <div className="h-px bg-slate-200 flex-grow"></div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">OR</span>
                <div className="h-px bg-slate-200 flex-grow"></div>
              </div>

              {/* Option 4: WhatsApp */}
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-lg transition-all shadow-md hover:shadow-lg hover:shadow-green-200">
                <MessageCircle className="w-6 h-6" />
                Buy via WhatsApp
              </a>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Get direct GPay/PhonePe details instantly.</p>

            </div>
          </div>
        </div>
      )}
    </>
  );
}