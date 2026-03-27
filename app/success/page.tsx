import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { CheckCircle, Download, Home, AlertCircle, ExternalLink, XCircle } from "lucide-react";
import { updateDoc } from "firebase/firestore"; // 🔥 updateDoc import karna zaroori hai
import { sendDownloadEmail } from "@/app/actions/email"; // 🔥 Apne action ko import karein

    
export const metadata = {
  title: "Payment Status | DevStore",
  robots: "noindex, nofollow",
};

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const params = await searchParams;
  const orderId = params.order_id;

  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <AlertCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Invalid Request</h1>
          <p className="text-slate-600 mb-8">No order ID found in the URL.</p>
          <Link href="/" className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors">
            <Home className="w-5 h-5 mr-2" /> Back to Store
          </Link>
        </div>
      </main>
    );
  }

  // 🔥 UPDATE 1: Yahan 'links' ki jagah 'orders' kar diya hai
  const isProd = process.env.CASHFREE_ENV === "PRODUCTION";
  const cashfreeEndpoint = isProd 
    ? `https://api.cashfree.com/pg/orders/${orderId}` 
    : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

  try {
    const res = await fetch(cashfreeEndpoint, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "x-api-version": "2023-08-01",
      },
      cache: 'no-store' 
    });

    const orderDetails = await res.json();

    // 🔥 UPDATE 2: Yahan 'link_status' ki jagah 'order_status' kar diya hai
    if (orderDetails.order_status !== "PAID") {
      return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-200">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black text-slate-900 mb-2">Payment {orderDetails.order_status || "Incomplete"}</h1>
            <p className="text-slate-600 mb-8">We haven't received the payment for this order yet. If money was deducted, it will be refunded automatically.</p>
            <Link href="/" className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors">
              <Home className="w-5 h-5 mr-2" /> Try Again
            </Link>
          </div>
        </main>
      );
    }

    // Payment Verified! Ab database se project details nikalte hain
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("orderId", "==", orderId));
    const orderSnap = await getDocs(q);
    
    if (orderSnap.empty) {
      throw new Error("Order not found in database");
    }
const orderDoc = orderSnap.docs[0];
    const orderData = orderSnap.docs[0].data();

    const projectRef = doc(db, "projects", orderData.projectId);
    const projectSnap = await getDoc(projectRef);
    const project = projectSnap.exists() ? projectSnap.data() : null;

    if (!project) throw new Error("Project not found");
// 🔥 NEW EMAIL LOGIC START 🔥
    if (project.driveLink && orderData.customerEmail && !orderData.emailSent) {
      try {
        // Naye parameters (orderId aur amount) pass kar rahe hain
        const emailResult = await sendDownloadEmail(
          orderData.customerEmail, 
          project.title, 
          project.driveLink,
          orderId,               // PDF ke liye
          orderData.amount       // PDF ke liye
        );
        
        if (emailResult.success) {
          await updateDoc(orderDoc.ref, {
            emailSent: true
          });
        }
      } catch (emailError) {
        console.error("Failed to send automated email:", emailError);
      }
    }
    // 🔥 NEW EMAIL LOGIC END 🔥
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-500">
          
          <div className="bg-green-500 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-4 relative z-10 drop-shadow-md" />
            <h1 className="text-3xl md:text-4xl font-black relative z-10">Payment Successful!</h1>
            <p className="text-green-100 font-medium mt-2 relative z-10">Order ID: {orderId}</p>
          </div>

          <div className="p-8 md:p-10 text-center">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">You Purchased</p>
            <h2 className="text-2xl font-black text-slate-900 mb-8">{project.title}</h2>

            {project.driveLink ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                  <p className="text-blue-800 font-bold mb-4">Your project source code is ready to download!</p>
                  <a 
                    href={project.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black py-5 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-300 transform hover:-translate-y-1"
                  >
                    <Download className="w-6 h-6 animate-bounce" />
                    ACCESS GOOGLE DRIVE
                    <ExternalLink className="w-4 h-4 opacity-50 ml-1" />
                  </a>
                </div>

                <div className="flex items-start gap-3 text-left bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p><strong>Important:</strong> Please bookmark the Google Drive link or download the files immediately. Keep this Order ID safe.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl text-slate-600">
                <p>Download link is currently being processed. Please contact us on WhatsApp with your Order ID ({orderId}) to get immediate access.</p>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-slate-100">
              <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors">
                <Home className="w-4 h-4 mr-2" /> Back to Store
              </Link>
            </div>
          </div>
        </div>
      </main>
    );

  } catch (error) {
    console.error("Verification Error:", error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Verification Error</h1>
          <p className="text-slate-600 mb-8">Your payment was successful, but we couldn't load the download page right now. Please contact support on WhatsApp with your Order ID.</p>
          <Link href="/" className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors">
            <Home className="w-5 h-5 mr-2" /> Back to Store
          </Link>
        </div>
      </main>
    );
  }
}