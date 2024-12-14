import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { InvoiceList } from "@/components/customers/InvoiceList";
import { db } from "@/lib/db";

export default async function CustomerPage({ params }) {
  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id: Number(id) },
    include: { invoices: true },
  });

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Details</h1>
      <CustomerDetails customer={customer} />
      <InvoiceList customerId={customer.id} invoices={customer.invoices} />
    </div>
  );
}
