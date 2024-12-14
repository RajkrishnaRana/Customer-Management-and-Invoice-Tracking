export function DashboardStats({
  totalCustomers,
  outstandingInvoices,
  totalRevenue,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
        <p className="text-3xl font-bold">{totalCustomers}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Outstanding Invoices</h3>
        <p className="text-3xl font-bold">{outstandingInvoices}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
}
