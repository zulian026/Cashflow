"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Plus,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { dashboardService } from "@/services/dashboardService";
import AppLayout from "@/components/layout/AppLayout";

interface Transaction {
  id: string;
  title: string;
  type: "income" | "expense";
  amount: number;
}

interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
  recentTransactions: Transaction[];
}

// Skeleton loader for cards
function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-[28px] p-6 border border-slate-100 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-100 rounded-full w-1/3 mb-4" />
      <div className="h-8 bg-slate-100 rounded-full w-2/3 mb-6" />
      <div className="h-20 bg-slate-100 rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Terjadi kesalahan saat mengambil data dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  if (loading || !dashboardData) {
    return (
      <AuthGuard>
        <AppLayout>
          <main className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard className="h-64" />
          </main>
        </AppLayout>
      </AuthGuard>
    );
  }

  const savingPercent = Math.min(
    Math.round((dashboardData.totalSaving / (dashboardData.totalIncome || 1)) * 100),
    100
  );

  return (
    <AuthGuard>
      <AppLayout>
        <main className="space-y-5">

          {/* ── ROW 1: 3 columns ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* BALANCE CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Total Balance
                  </p>
                  <h2 className="text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
                    Rp{" "}
                    <span className="tabular-nums">
                      {dashboardData.totalBalance.toLocaleString("id-ID")}
                    </span>
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-[14px] bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
                  <Wallet size={18} />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100" />

              {/* Income / Expense mini cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F0FDF4] rounded-[18px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#16A34A]/15 flex items-center justify-center">
                      <ArrowDownCircle size={14} className="text-[#16A34A]" />
                    </div>
                    <p className="text-xs font-semibold text-[#15803D]">Income</p>
                  </div>
                  <p className="text-base font-bold text-slate-800 tabular-nums leading-tight">
                    Rp {dashboardData.totalIncome.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendingUp size={10} className="text-[#16A34A]" />
                    <span className="text-[10px] text-[#16A34A] font-medium">This month</span>
                  </div>
                </div>

                <div className="bg-red-50 rounded-[18px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                      <ArrowUpCircle size={14} className="text-red-500" />
                    </div>
                    <p className="text-xs font-semibold text-red-600">Expense</p>
                  </div>
                  <p className="text-base font-bold text-slate-800 tabular-nums leading-tight">
                    Rp {dashboardData.totalExpense.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendingDown size={10} className="text-red-400" />
                    <span className="text-[10px] text-red-400 font-medium">This month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SAVING GOAL CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Saving Goal
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight tabular-nums">
                    Rp {dashboardData.totalSaving.toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-[14px] bg-[#16A34A] flex items-center justify-center text-white shadow-sm">
                  <PiggyBank size={18} />
                </div>
              </div>

              {/* Progress section — green card */}
              <div className="flex-1 rounded-[20px] bg-[#16A34A] p-5 text-white flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                    Progress
                  </p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-4xl font-bold tracking-tight">{savingPercent}%</span>
                    <span className="text-white/60 text-sm mb-1">of goal</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${savingPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/75 font-medium">
                    {savingPercent >= 75
                      ? "Almost there! Keep it up 🎉"
                      : "Keep saving, you're doing great!"}
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Quick Actions
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 tracking-tight">
                  Manage Finance
                </h3>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <button
                  onClick={() => router.push("/income")}
                  className="group w-full flex items-center justify-between px-5 h-14 rounded-[16px] bg-[#16A34A] text-white font-semibold text-sm shadow-sm hover:bg-[#15803D] active:scale-[0.98] transition-all duration-150"
                >
                  <span className="flex items-center gap-2.5">
                    <Plus size={16} />
                    Add Income
                  </span>
                  <ChevronRight size={15} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => router.push("/expense")}
                  className="group w-full flex items-center justify-between px-5 h-14 rounded-[16px] bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all duration-150"
                >
                  <span className="flex items-center gap-2.5">
                    <Plus size={16} />
                    Add Expense
                  </span>
                  <ChevronRight size={15} className="opacity-40 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => router.push("/reports")}
                  className="group w-full flex items-center justify-between px-5 h-14 rounded-[16px] bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all duration-150"
                >
                  <span className="flex items-center gap-2.5">
                    <TrendingUp size={16} />
                    View Reports
                  </span>
                  <ChevronRight size={15} className="opacity-40 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </section>

          {/* ── ROW 2: Recent Transactions ── */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Recent Transactions
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Latest financial activity
                </p>
              </div>
              <button
                onClick={() => router.push("/expense")}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#15803D] bg-[#F0FDF4] px-3 py-1.5 rounded-full transition-colors"
              >
                See all
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Transaction list */}
            {dashboardData.recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                <Wallet size={40} strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-slate-400">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dashboardData.recentTransactions.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-4 rounded-[18px] bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-150 cursor-pointer"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 ${
                          item.type === "income"
                            ? "bg-[#F0FDF4] text-[#16A34A]"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {item.type === "income" ? (
                          <ArrowDownCircle size={20} />
                        ) : (
                          <ArrowUpCircle size={20} />
                        )}
                      </div>

                      {/* Title + type */}
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${
                              item.type === "income" ? "bg-[#16A34A]" : "bg-red-400"
                            }`}
                          />
                          <p className="text-xs text-slate-400 capitalize font-medium">
                            {item.type}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amount + more button */}
                    <div className="flex items-center gap-3">
                      <p
                        className={`text-base font-bold tabular-nums ${
                          item.type === "income" ? "text-[#16A34A]" : "text-red-500"
                        }`}
                      >
                        {item.type === "income" ? "+" : "−"} Rp{" "}
                        {item.amount.toLocaleString("id-ID")}
                      </p>
                      <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-150">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}