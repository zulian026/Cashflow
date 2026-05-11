"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { transactionService } from "@/services/transactionService";
import AppLayout from "@/components/layout/AppLayout";
import { useConfirm } from "@/context/ConfirmContext";
import { ArrowDownCircle, Plus, Trash2 } from "lucide-react";
import { categoryService, Category } from "@/services/categoryService";
import { useToast } from "@/components/ToastProvider";
import { savingService } from "@/services/savingService";

interface IncomeTransaction {
  id: string;
  amount: number;
  source: string;
  description: string | null;
  created_at: string;
}

interface SavingGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
}

// Shared class untuk semua input & select agar konsisten
const fieldClass =
  "h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition w-full";

export default function IncomePage() {
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<IncomeTransaction[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [savingAmount, setSavingAmount] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, categoriesData] = await Promise.all([
          transactionService.getTransactions("income"),
          categoryService.getCategories(),
        ]);

        setTransactions((transactionsData as IncomeTransaction[]) || []);
        setCategories(categoriesData.filter((c) => c.type === "income"));
      } catch (error: unknown) {
        showToast(
          getErrorMessage(error, "Terjadi kesalahan saat mengambil data"),
          "error",
        );
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadSavingGoals = async () => {
      const data = await savingService.getSavingGoals();
      setSavingGoals(data || []);
    };

    loadSavingGoals();
  }, []);

  const refreshData = async () => {
    try {
      const data = await transactionService.getTransactions("income");
      setTransactions((data as IncomeTransaction[]) || []);
    } catch (error: unknown) {
      showToast(
        getErrorMessage(error, "Terjadi kesalahan saat refresh data income"),
        "error",
      );
    }
  };

  const handleAdd = async () => {
    if (!title || !amount) {
      showToast("Title & Amount wajib", "error");
      return;
    }

    const incomeAmount = Number(amount);
    const savingValue = Number(savingAmount || 0);

    if (savingValue > incomeAmount) {
      showToast("Saving tidak boleh lebih dari income", "error");
      return;
    }

    try {
      await transactionService.addTransaction("income", {
        title,
        amount: incomeAmount,
        category,
        notes,
      });

      if (selectedGoal && savingValue > 0) {
        await savingService.addSavingAmount(selectedGoal, savingValue);
      }

      setTitle("");
      setAmount("");
      setCategory("");
      setNotes("");
      setSelectedGoal("");
      setSavingAmount("");

      showToast("Income & saving berhasil ditambahkan", "success");
      await refreshData();
    } catch (error: unknown) {
      showToast(getErrorMessage(error, "Terjadi kesalahan"), "error");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Income",
      message: "Yakin ingin menghapus income ini?",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await transactionService.deleteTransaction("income", id);
      showToast("Income berhasil dihapus", "success");
      await refreshData();
    } catch (error: unknown) {
      showToast(
        getErrorMessage(error, "Terjadi kesalahan saat menghapus income"),
        "error",
      );
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
                  className={fieldClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  placeholder="Amount"
                  type="number"
                  className={fieldClass}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                {/* ✅ Dropdown Category — styling konsisten dengan input */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* ✅ Dropdown Saving Goal — styling konsisten dengan input */}
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">Pilih Saving Goal (opsional)</option>
                  {savingGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>

                <div className="md:col-span-2 grid md:grid-cols-2 gap-4 items-center">
                  <input
                    type="number"
                    placeholder="Jumlah untuk ditabung (opsional)"
                    value={savingAmount}
                    onChange={(e) => setSavingAmount(e.target.value)}
                    className={fieldClass}
                  />

                  {amount && (
                    <p className="text-sm text-slate-500">
                      Sisa: Rp{" "}
                      {(
                        Number(amount || 0) - Number(savingAmount || 0)
                      ).toLocaleString()}
                    </p>
                  )}
                </div>

                <input
                  placeholder="Notes"
                  className={fieldClass}
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
                      onClick={async () => {
                        const ok = await confirm({
                          title: "Delete Income",
                          message: "Yakin ingin menghapus data ini?",
                          variant: "danger",
                        });

                        if (!ok) return;

                        await handleDelete(item.id);
                      }}
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
