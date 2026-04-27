"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { transactionService } from "@/services/transactionService";
import AppLayout from "@/components/layout/AppLayout";
import { ArrowUpCircle, Plus, Trash2 } from "lucide-react";

interface ExpenseTransaction {
  id: string;
  amount: number;
  purpose: string;
  description: string | null;
  created_at: string;
}

export default function ExpensePage() {
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await transactionService.getTransactions("expense");

        setTransactions((data as ExpenseTransaction[]) || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Terjadi kesalahan saat mengambil data expense");
        }
      }
    };

    loadTransactions();
  }, []);

  const refreshData = async () => {
    try {
      const data = await transactionService.getTransactions("expense");

      setTransactions((data as ExpenseTransaction[]) || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat refresh data expense");
      }
    }
  };

  const handleAdd = async () => {
    if (!title || !amount) {
      alert("Title & Amount wajib");
      return;
    }

    try {
      await transactionService.addTransaction("expense", {
        title,
        amount: Number(amount),
        category,
        notes,
      });

      setTitle("");
      setAmount("");
      setCategory("");
      setNotes("");

      await refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menambahkan expense");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.deleteTransaction("expense", id);

      await refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menghapus expense");
      }
    }
  };

  return (
    <AuthGuard>
      <AppLayout>
        <main className="space-y-6">
          {/* HEADER */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expense Management</p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  Track Your Expenses
                </h1>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center">
                <ArrowUpCircle size={24} />
              </div>
            </div>
          </section>

          {/* FORM + SUMMARY */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FORM */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Add New Expense</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Expense Title"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-red-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  placeholder="Amount"
                  type="number"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-red-200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <input
                  placeholder="Category"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-red-200"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <input
                  placeholder="Notes"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-red-200"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                onClick={handleAdd}
                className="mt-6 h-14 px-6 rounded-2xl bg-red-500 text-white font-medium flex items-center gap-2 hover:opacity-90 transition"
              >
                <Plus size={18} />
                Add Expense
              </button>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 mb-2">
                Total Expense Records
              </p>

              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                {transactions.length}
              </h2>

              <div className="h-[220px] rounded-3xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Monthly Spending</p>
                  <h3 className="text-3xl font-bold mt-2">68%</h3>
                </div>

                <div>
                  <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="w-[68%] h-full bg-white rounded-full" />
                  </div>

                  <p className="text-sm mt-3 opacity-90">
                    Keep monitoring your expenses
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TRANSACTION LIST */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Expense List</h2>
              <p className="text-sm text-slate-500">
                All your recent expense transactions
              </p>
            </div>

            <div className="space-y-4">
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
                      <ArrowUpCircle size={22} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.purpose}
                      </p>

                      <p className="text-sm text-slate-500">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-red-500">
                      - Rp {Number(item.amount).toLocaleString()}
                    </p>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="mt-2 inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}
