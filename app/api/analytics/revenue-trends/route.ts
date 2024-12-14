import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueTrends = await db.invoice.groupBy({
      by: ["status"],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    const formattedData = revenueTrends.map((trend) => ({
      status: trend.status,
      amount: trend._sum.amount || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching revenue trends:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
