import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, customerName, customerEmail, customerPhone } = body;

    // 1. Firebase se original price fetch karo
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap.data();
    
    // Order ID generate karna
// Order ID generate karna (Max 50 characters limit fix)
    const shortProjectId = projectId.substring(0, 15).replace(/[^a-zA-Z0-9]/g, ''); // Project ID ko chhota kiya
    const linkId = `ORD_${shortProjectId}_${Date.now()}`;
    // 2. 🔥 UPDATE: Cashfree "Payment Links" API (Jo direct URL deta hai)
    const isProd = process.env.CASHFREE_ENV === "PRODUCTION";
    const cashfreeEndpoint = isProd 
      ? "https://api.cashfree.com/pg/links" 
      : "https://sandbox.cashfree.com/pg/links";

    const cashfreeResponse = await fetch(cashfreeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify({
        link_id: linkId,
        link_amount: projectData.price,
        link_currency: "INR",
        link_purpose: `Payment for ${projectData.title}`.substring(0, 255), // Max 255 chars allowed
        customer_details: {
          customer_name: customerName || "Student",
          customer_email: customerEmail || "student@example.com",
          customer_phone: customerPhone || "9999999999",
        },
        link_meta: {
          // Payment hone ke baad Success Page par bhejo
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?order_id={link_id}`,
        },
      }),
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree Error:", cashfreeData);
      return NextResponse.json({ error: cashfreeData.message || "Payment gateway error" }, { status: 500 });
    }

    // 3. Database mein ek temporary order save kar lo track karne ke liye
    await addDoc(collection(db, "orders"), {
      orderId: linkId,
      projectId: projectId,
      projectTitle: projectData.title,
      amount: projectData.price,
      status: "PENDING",
      createdAt: new Date(),
    });

    // 4. 🔥 Frontend ko Link return karo
    return NextResponse.json({ 
      payment_url: cashfreeData.link_url // Cashfree ne Link bana diya!
    });

  } catch (error) {
    console.error("Create Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}