import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const outstandingBalances = await db.invoice.groupBy({
      by: ["dueDate"],
      where: {
        status: "Unpaid",
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 10, // Limit to 10 most recent due dates
    });

    const formattedData = outstandingBalances.map((balance) => ({
      dueDate: balance.dueDate.toISOString().split("T")[0],
      amount: balance._sum.amount || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching outstanding balances:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
