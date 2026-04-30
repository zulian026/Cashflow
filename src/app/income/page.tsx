"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { transactionService } from "@/services/transactionService";
import AppLayout from "@/components/layout/AppLayout";
import { useConfirm } from "@/context/ConfirmContext";
import { ArrowDownCircle, Plus, Trash2 } from "lucide-react";
import { categoryService, Category } from "@/services/categoryService";

interface IncomeTransaction {
  id: string;
  amount: number;
  source: string;
  description: string | null;
  created_at: string;
}

export default function IncomePage() {
  const { showConfirm } = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<IncomeTransaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, categoriesData] = await Promise.all([
          transactionService.getTransactions("income"),
          categoryService.getCategories(),
        ]);

        // transactions
        setTransactions((transactionsData as IncomeTransaction[]) || []);

        // 🔥 ambil hanya category income
        setCategories(categoriesData.filter((c) => c.type === "income"));
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Terjadi kesalahan saat mengambil data");
        }
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    try {
      const data = await transactionService.getTransactions("income");

      setTransactions((data as IncomeTransaction[]) || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat refresh data income");
      }
    }
  };

  const handleAdd = async () => {
    if (!title || !amount) {
      alert("Title & Amount wajib");
      return;
    }

    try {
      await transactionService.addTransaction("income", {
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
        alert("Terjadi kesalahan saat menambahkan income");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.deleteTransaction("income", id);

      await refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menghapus income");
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
                <p className="text-sm text-slate-500">Income Management</p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  Track Your Income
                </h1>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center">
                <ArrowDownCircle size={24} />
              </div>
            </div>
          </section>

          {/* FORM + SUMMARY */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FORM */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Add New Income</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Income Title"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  placeholder="Amount"
                  type="number"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC]"
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Notes"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                onClick={handleAdd}
                className="mt-6 h-14 px-6 rounded-2xl bg-[#16A34A] text-white font-medium flex items-center gap-2 hover:opacity-90 transition"
              >
                <Plus size={18} />
                Add Income
              </button>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 mb-2">
                Total Income Records
              </p>

              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                {transactions.length}
              </h2>

              <div className="h-[220px] rounded-3xl bg-gradient-to-br from-[#16A34A] to-[#15803D] p-6 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Monthly Growth</p>
                  <h3 className="text-3xl font-bold mt-2">+18%</h3>
                </div>

                <div>
                  <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="w-[70%] h-full bg-white rounded-full" />
                  </div>

                  <p className="text-sm mt-3 opacity-90">
                    Great progress this month
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TRANSACTION LIST */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Income List</h2>
              <p className="text-sm text-slate-500">
                All your recent income transactions
              </p>
            </div>

            <div className="space-y-4">
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#16A34A] flex items-center justify-center">
                      <ArrowDownCircle size={22} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.source}
                      </p>

                      <p className="text-sm text-slate-500">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#16A34A]">
                      + Rp {Number(item.amount).toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        showConfirm({
                          title: "Delete Income",
                          message:
                            "Are you sure you want to delete this income record?",
                          onConfirm: () => handleDelete(item.id),
                        })
                      }
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
