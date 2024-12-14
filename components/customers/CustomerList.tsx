"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    const res = await fetch(`/api/customers?page=${page}&limit=10`);
    const data = await res.json();
    setCustomers(data.customers);
    setTotalPages(Math.ceil(data.total / data.limit));
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: any) => (
            <tr key={customer.id} className="items-center">
              <td className="py-2 px-4 border-b text-center align-middle">
                {customer.name}
              </td>
              <td className="py-2 px-4 border-b text-center align-middle">
                {customer.email}
              </td>
              <td className="py-2 px-4 border-b text-center align-middle">
                <Link
                  href={`/customers/${customer.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
