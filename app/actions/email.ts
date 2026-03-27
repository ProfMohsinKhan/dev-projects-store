"use server"; 

import { Resend } from 'resend';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDownloadEmail(
  userEmail: string, 
  projectTitle: string, 
  downloadLink: string,
  orderId: string,     // 🔥 Naya parameter
  amount: number       // 🔥 Naya parameter
) {
  try {
    // 1. PDF Invoice Generate Karna
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue Color
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`DevStore by Mohsin Khan`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 38);
    doc.text(`Order ID: ${orderId}`, 14, 46);
    doc.text(`Billed To: ${userEmail}`, 14, 54);

    // Items Table using autoTable
    autoTable(doc, {
      startY: 65,
      head: [['Item Description', 'Amount']],
      body: [
        [`Source Code: ${projectTitle}`, `Rs. ${amount}`],
        ['Platform Fee', 'Rs. 0'],
      ],
      foot: [['Total Paid', `Rs. ${amount}`]],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] } // Blue Theme
    });

    // PDF ko Buffer mein convert karna taaki email mein attach ho sake
    const pdfArrayBuffer = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // 2. Email Bhejna PDF Invoice ke sath
    const data = await resend.emails.send({
      from: 'DevStore Support <support@finalyearcode.com>', // Aapka verified email
      to: [userEmail],
      subject: `Your Source Code & Invoice - ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Thank you for your purchase! 🎉</h2>
          <p>Hi there,</p>
          <p>Aapne <strong>${projectTitle}</strong> successfully kharid liya hai.</p>
          <p>Aap niche diye gaye link se apna project download kar sakte hain:</p>
          <a href="${downloadLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0;">
            Download Source Code
          </a>
          <p>Aapki payment receipt (Invoice) is email mein attach kar di gayi hai.</p>
          <br/>
          <p>Happy Coding!</p>
          <p><strong>Mohsin Khan</strong><br/>Mak Tutorials</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${orderId}.pdf`,
          content: pdfBuffer, // PDF attach kar diya
        },
      ],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Email/PDF sending error:", error);
    return { success: false, error };
  }
}