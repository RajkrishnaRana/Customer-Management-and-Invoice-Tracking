import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;

  const customers = await db.customer.findMany({
    skip,
    take: limit,
    include: { invoices: true },
  });

  const total = await db.customer.count();

  return NextResponse.json({ customers, total, page, limit });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, externalCustomerId } = body;

  const customer = await db.customer.create({
    data: { name, email, externalCustomerId: externalCustomerId || null },
  });

  return NextResponse.json(customer);
}
