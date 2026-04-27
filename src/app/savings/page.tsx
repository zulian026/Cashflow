"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import { savingService } from "@/services/savingService";
import { PiggyBank, Plus, Trash2, Target } from "lucide-react";

interface SavingGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  created_at: string;
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingGoal[]>([]);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await savingService.getSavingGoals();

        setGoals((data as SavingGoal[]) || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Terjadi kesalahan saat mengambil saving goals");
        }
      }
    };

    loadGoals();
  }, []);

  const refreshGoals = async () => {
    try {
      const data = await savingService.getSavingGoals();

      setGoals((data as SavingGoal[]) || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat refresh saving goals");
      }
    }
  };

  const handleAdd = async () => {
    if (!title || !targetAmount) {
      alert("Title & Target wajib");
      return;
    }

    try {
      await savingService.addSavingGoal({
        title,
        target_amount: Number(targetAmount),
        current_amount: Number(savedAmount || 0),
        target_date: deadline,
      });

      setTitle("");
      setTargetAmount("");
      setSavedAmount("");
      setDeadline("");

      await refreshGoals();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menambahkan saving goal");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await savingService.deleteSavingGoal(id);

      await refreshGoals();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menghapus saving goal");
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
                <p className="text-sm text-slate-500">Saving Goals</p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  Smart Saving Tracker
                </h1>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center">
                <PiggyBank size={24} />
              </div>
            </div>
          </section>

          {/* FORM + SUMMARY */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FORM */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Add New Saving Goal</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Goal Title"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  placeholder="Target Amount"
                  type="number"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />

                <input
                  placeholder="Saved Amount"
                  type="number"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                />

                <input
                  type="date"
                  className="h-14 px-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <button
                onClick={handleAdd}
                className="mt-6 h-14 px-6 rounded-2xl bg-[#16A34A] text-white font-medium flex items-center gap-2 hover:opacity-90 transition"
              >
                <Plus size={18} />
                Add Saving Goal
              </button>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 mb-2">Total Goals</p>

              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                {goals.length}
              </h2>

              <div className="h-[220px] rounded-3xl bg-gradient-to-br from-[#16A34A] to-[#15803D] p-6 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Saving Progress</p>
                  <h3 className="text-3xl font-bold mt-2">74%</h3>
                </div>

                <div>
                  <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="w-[74%] h-full bg-white rounded-full" />
                  </div>

                  <p className="text-sm mt-3 opacity-90">
                    You re getting closer to your goal
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GOALS LIST */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Saving Goals List</h2>
              <p className="text-sm text-slate-500">
                Track all your saving progress
              </p>
            </div>

            <div className="space-y-5">
              {goals.map((goal) => {
                const progress =
                  (Number(goal.current_amount) / Number(goal.target_amount)) *
                  100;

                return (
                  <div
                    key={goal.id}
                    className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#16A34A] flex items-center justify-center">
                          <Target size={22} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {goal.title}
                          </h3>

                          <p className="text-sm text-slate-500">
                            Deadline: {goal.target_date}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>

                    <div className="mb-3 font-medium text-slate-700">
                      Rp {Number(goal.current_amount).toLocaleString()}
                      {" / "}
                      Rp {Number(goal.target_amount).toLocaleString()}
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#16A34A]"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="text-sm mt-3 text-slate-600 font-medium">
                      {progress.toFixed(1)}% completed
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}
