import { CustomerList } from "@/components/customers/CustomerList";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { db } from "@/lib/db";

export default async function CustomersPage() {
  const totalCustomers = await db.customer.count();
  const outstandingInvoices = await db.invoice.count({
    where: { status: "Unpaid" },
  });
  const totalRevenue = await db.invoice.aggregate({
    _sum: { amount: true },
    where: { status: "Paid" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Customers Dashboard</h1>
      <DashboardStats
        totalCustomers={totalCustomers}
        outstandingInvoices={outstandingInvoices}
        totalRevenue={totalRevenue._sum.amount || 0}
      />
      <CustomerList />
    </div>
  );
}
