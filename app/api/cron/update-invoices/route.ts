import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Update overdue invoices
    const overdueInvoices = await prisma.invoice.updateMany({
      where: {
        status: "Unpaid",
        dueDate: {
          lt: new Date(),
        },
      },
      data: {
        status: "Past Due",
      },
    });

    // Fetch unpaid invoices
    const unpaidInvoices = await prisma.invoice.findMany({
      where: {
        status: "Unpaid",
      },
      include: {
        customer: true,
      },
    });

    // Send email reminders
    for (const invoice of unpaidInvoices) {
      const emailSubject = `Reminder: Invoice #${invoice.id} is due soon`;
      const emailText = `Dear ${
        invoice.customer.name
      },\n\nThis is a reminder that your invoice #${invoice.id} for $${
        invoice.amount
      } is due on ${invoice.dueDate.toDateString()}. Please ensure timely payment to avoid any late fees.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`;
      const emailHtml = `
        <h1>Invoice Reminder</h1>
        <p>Dear ${invoice.customer.name},</p>
        <p>This is a reminder that your invoice #${invoice.id} for $${
        invoice.amount
      } is due on ${invoice.dueDate.toDateString()}. Please ensure timely payment to avoid any late fees.</p>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>Your Company Name</p>
      `;

      await sendEmail(
        invoice.customer.email,
        emailSubject,
        emailText,
        emailHtml
      );
      console.log(
        `Reminder email sent to ${invoice.customer.email} for invoice #${invoice.id}`
      );
    }

    return NextResponse.json({
      message: "Cron job completed successfully",
      updatedInvoices: overdueInvoices.count,
      emailsSent: unpaidInvoices.length,
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
