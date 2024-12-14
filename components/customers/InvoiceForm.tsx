"use client";

import { useState } from "react";

export function InvoiceForm({ invoice, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    amount: invoice?.amount || "",
    status: invoice?.status || "Unpaid",
    dueDate: invoice?.dueDate
      ? new Date(invoice.dueDate).toISOString().split("T")[0]
      : "",
    externalInvoiceId: invoice?.externalInvoiceId || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("function running");
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label htmlFor="amount" className="block mb-2">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Past Due">Past Due</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block mb-2">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="externalInvoiceId" className="block mb-2">
          External Invoice ID
        </label>
        <input
          type="text"
          id="externalInvoiceId"
          name="externalInvoiceId"
          value={formData.externalInvoiceId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {invoice ? "Update" : "Create"} Invoice
        </button>
      </div>
    </form>
  );
}
