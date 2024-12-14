import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const customer = await db.customer.findUnique({
    where: { id: Number(params.id) },
    include: { invoices: true },
  });

  if (!customer) {
    return NextResponse.json(
      { message: "Customer not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(customer);
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await request.json();
  const { name, email, externalCustomerId } = body;

  const customer = await db.customer.update({
    where: { id: Number(params.id) },
    data: { name, email, externalCustomerId },
  });

  return NextResponse.json(customer);
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await db.customer.delete({
    where: { id: Number(params.id) },
  });

  return new NextResponse(null, { status: 204 });
}
