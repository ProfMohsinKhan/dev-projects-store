import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, customerName, customerEmail, customerPhone } = body;

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap.data();
    
    // Order ID (Max 50 chars)
    const shortProjectId = projectId.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '');
    const orderId = `ORD_${shortProjectId}_${Date.now()}`;

    // 🔥 BACK TO ORDERS API (100% Approved for your account)
    const isProd = process.env.CASHFREE_ENV === "PRODUCTION";
    const cashfreeEndpoint = isProd 
      ? "https://api.cashfree.com/pg/orders" 
      : "https://sandbox.cashfree.com/pg/orders";

    const cashfreeResponse = await fetch(cashfreeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: projectData.price,
        order_currency: "INR",
        customer_details: {
          customer_id: `CUST_${Date.now()}`,
          customer_name: customerName || "Student",
          customer_email: customerEmail || "student@example.com",
          customer_phone: customerPhone || "9999999999",
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?order_id={order_id}`,
        },
      }),
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree Error:", cashfreeData);
      return NextResponse.json({ error: cashfreeData.message || "Payment gateway error" }, { status: 500 });
    }

    await addDoc(collection(db, "orders"), {
      orderId: orderId,
      projectId: projectId,
      projectTitle: projectData.title,
      amount: projectData.price,
      status: "PENDING",
      createdAt: new Date(),
    });

    // 🔥 Frontend ko ab "Session ID" bhejenge
    return NextResponse.json({ 
      payment_session_id: cashfreeData.payment_session_id,
      environment: isProd ? "production" : "sandbox" // Nayi line add ki hai
    });

  } catch (error) {
    console.error("Create Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}