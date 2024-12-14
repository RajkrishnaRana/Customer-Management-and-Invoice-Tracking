"use client";

import { useState } from "react";
import { InvoiceForm } from "./InvoiceForm";

export function InvoiceList({ customerId, invoices: initialInvoices }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const handleAddInvoice = async (newInvoice) => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newInvoice, customerId }),
    });
    const savedInvoice = await res.json();
    setInvoices([...invoices, savedInvoice]);
    setShowForm(false);
  };

  const handleEditInvoice = async (updatedInvoice) => {
    const res = await fetch(`/api/invoices/${updatedInvoice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedInvoice),
    });
    const savedInvoice = await res.json();
    setInvoices(
      invoices.map((inv) => (inv.id === savedInvoice.id ? savedInvoice : inv))
    );
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = async (id) => {
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Invoice
      </button>
      {showForm && (
        <InvoiceForm
          onSubmit={handleAddInvoice}
          onCancel={() => setShowForm(false)}
        />
      )}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Due Date</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="py-2 px-4 border-b">
                ${invoice.amount.toFixed(2)}
              </td>
              <td className="py-2 px-4 border-b">{invoice.status}</td>
              <td className="py-2 px-4 border-b">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => setEditingInvoice(invoice)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingInvoice && (
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={handleEditInvoice}
          onCancel={() => setEditingInvoice(null)}
        />
      )}
    </div>
  );
}
