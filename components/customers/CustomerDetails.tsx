export function CustomerDetails({ customer }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">{customer.name}</h2>
      <p className="mb-2">
        <strong>Email:</strong> {customer.email}
      </p>
      <p className="mb-2">
        <strong>External Customer ID:</strong>{" "}
        {customer.externalCustomerId || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Created At:</strong>{" "}
        {new Date(customer.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
