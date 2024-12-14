import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { externalCustomerId, externalInvoiceId, amount, status, dueDate } =
    body;

  try {
    const customer = await db.customer.findUnique({
      where: { externalCustomerId },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    const invoice = await db.invoice.upsert({
      where: { externalInvoiceId },
      update: {
        amount: Number(amount),
        status,
        dueDate: new Date(dueDate),
      },
      create: {
        customerId: customer.id,
        amount: Number(amount),
        status,
        dueDate: new Date(dueDate),
        externalInvoiceId,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
