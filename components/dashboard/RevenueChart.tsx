"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueTrend {
  status: string;
  amount: number;
}

interface OutstandingBalance {
  dueDate: string;
  amount: number;
}

export function RevenueChart() {
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrend[]>([]);
  const [outstandingBalances, setOutstandingBalances] = useState<
    OutstandingBalance[]
  >([]);

  useEffect(() => {
    fetchRevenueTrends();
    fetchOutstandingBalances();
  }, []);

  const fetchRevenueTrends = async () => {
    try {
      const response = await fetch("/api/analytics/revenue-trends");
      if (response.ok) {
        const data = await response.json();
        setRevenueTrends(data);
      } else {
        console.error("Failed to fetch revenue trends");
      }
    } catch (error) {
      console.error("Error fetching revenue trends:", error);
    }
  };

  const fetchOutstandingBalances = async () => {
    try {
      const response = await fetch("/api/analytics/outstanding-balances");
      if (response.ok) {
        const data = await response.json();
        setOutstandingBalances(data);
      } else {
        console.error("Failed to fetch outstanding balances");
      }
    } catch (error) {
      console.error("Error fetching outstanding balances:", error);
    }
  };

  const revenueTrendsData = {
    labels: revenueTrends.map((trend) => trend.status),
    datasets: [
      {
        label: "Revenue",
        data: revenueTrends.map((trend) => trend.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const outstandingBalancesData = {
    labels: outstandingBalances.map((balance) => balance.dueDate),
    datasets: [
      {
        label: "Outstanding Balance",
        data: outstandingBalances.map((balance) => balance.amount),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Revenue by invoice status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <Bar options={options} data={revenueTrendsData} />
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Balances</CardTitle>
          <CardDescription>Unpaid invoices by due date</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              outstandingBalance: {
                label: "Outstanding Balance",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <Line options={options} data={outstandingBalancesData} />
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
