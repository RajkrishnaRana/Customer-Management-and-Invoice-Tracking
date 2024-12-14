import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function logInvoiceChange(
  invoiceId: number,
  field: string,
  oldValue: string,
  newValue: string
) {
  await db.invoiceLog.create({
    data: {
      invoiceId,
      field,
      oldValue,
      newValue,
    },
  });
}

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const invoice = await db.invoice.findUnique({
    where: { id: Number(params.id) },
    include: { customer: true },
  });

  if (!invoice) {
    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params object/
  // But the id is still coming undefined, didn't solve this issue
  const { id } = await context.params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing invoice ID" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { amount, status, dueDate, externalInvoiceId } = body;

  const oldInvoice = await db.invoice.findUnique({
    where: { id: Number(id) },
  });

  if (!oldInvoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  let updatedInvoice;
  try {
    updatedInvoice = await db.invoice.update({
      where: { id: Number(id) },
      data: {
        amount: Number(amount),
        status,
        dueDate: new Date(dueDate),
        externalInvoiceId: externalInvoiceId || null,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate externalInvoiceId" },
        { status: 400 }
      );
    }
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  if (oldInvoice && updatedInvoice) {
    if (oldInvoice.amount !== updatedInvoice.amount) {
      await logInvoiceChange(
        updatedInvoice.id,
        "amount",
        oldInvoice.amount.toString(),
        updatedInvoice.amount.toString()
      );
    }
    if (oldInvoice.status !== updatedInvoice.status) {
      await logInvoiceChange(
        updatedInvoice.id,
        "status",
        oldInvoice.status,
        updatedInvoice.status
      );
    }
    if (
      oldInvoice.dueDate.toISOString() !== updatedInvoice.dueDate.toISOString()
    ) {
      await logInvoiceChange(
        updatedInvoice.id,
        "dueDate",
        oldInvoice.dueDate.toISOString(),
        updatedInvoice.dueDate.toISOString()
      );
    }
  }

  return NextResponse.json(updatedInvoice);
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await db.invoice.delete({
    where: { id: Number(params.id) },
  });

  return new NextResponse(null, { status: 204 });
}
