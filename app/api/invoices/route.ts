import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const invoices = await db.invoice.findMany({
    include: { customer: true },
  });
  return NextResponse.json(invoices);
}

// export async function POST(request: Request) {
//   try {
//     const text = await request.text();
//     console.log("Raw request body:", text);

//     if (!text) {
//       return NextResponse.json(
//         { error: "Request body is empty" },
//         { status: 400 }
//       );
//     }

//     const body = JSON.parse(text);
//     console.log("Parsed body:", body);

//     if (!body || Object.keys(body).length === 0) {
//       return NextResponse.json(
//         { error: "Request body is empty or invalid JSON" },
//         { status: 400 }
//       );
//     }

//     const { customerId, amount, status, dueDate, externalInvoiceId } = body;

//     // Validate required fields
//     if (!customerId || !amount || !status || !dueDate) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const invoice = await db.invoice.create({
//       data: {
//         customerId: Number(customerId),
//         amount: Number(amount),
//         status,
//         dueDate: new Date(dueDate),
//         externalInvoiceId,
//       },
//     });

//     console.log("Created invoice:", invoice);
//     return NextResponse.json(invoice, { status: 201 });
//   } catch (error) {
//     console.error("Error creating invoice:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const text = await request.text();
    console.log("Raw request body:", text);

    if (!text) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const body = JSON.parse(text);
    console.log("Parsed body:", body);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Request body is empty or invalid JSON" },
        { status: 400 }
      );
    }

    const { customerId, amount, status, dueDate, externalInvoiceId } = body;

    // Validate required fields
    if (!customerId || !amount || !status || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (externalInvoiceId && typeof externalInvoiceId !== "string") {
      return NextResponse.json(
        { error: "Invalid externalInvoiceId" },
        { status: 400 }
      );
    }

    // Create the invoice
    const invoice = await db.invoice.create({
      data: {
        customerId: Number(customerId),
        amount: Number(amount),
        status,
        dueDate: new Date(dueDate),
        externalInvoiceId: externalInvoiceId || null,
      },
    });

    console.log("Created invoice:", invoice);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return NextResponse.json(
        { error: "Duplicate externalInvoiceId" },
        { status: 400 }
      );
    }
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
