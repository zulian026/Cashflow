"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import StatCard from "@/components/cards/StatCard";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
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

export default function DashboardPage() {
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

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
      <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <h1 className="text-lg font-medium text-slate-600">Loading...</h1>
      </main>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <main className="space-y-6">
          {/* TOP SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 mb-2">Total Balance</p>

              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Rp {dashboardData.totalBalance.toLocaleString()}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] rounded-2xl p-4">
                  <div className="mb-3 text-[#16A34A]">
                    <ArrowDownCircle size={22} />
                  </div>
                  <p className="text-sm text-slate-500">Income</p>
                  <p className="font-semibold text-lg">
                    Rp {dashboardData.totalIncome.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-4">
                  <div className="mb-3 text-red-500">
                    <ArrowUpCircle size={22} />
                  </div>
                  <p className="text-sm text-slate-500">Expense</p>
                  <p className="font-semibold text-lg">
                    Rp {dashboardData.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* CENTER CARD */}
            <div className="lg:col-span-1 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Saving Goal</p>
                  <h3 className="text-2xl font-bold mt-1">
                    Rp {dashboardData.totalSaving.toLocaleString()}
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center">
                  <PiggyBank size={24} />
                </div>
              </div>

              <div className="h-[220px] rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] p-6 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Saving Progress</p>
                  <h4 className="text-3xl font-bold mt-2">75%</h4>
                </div>

                <div>
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-white rounded-full" />
                  </div>
                  <p className="text-sm mt-3 opacity-90">
                    Keep going, you re doing great!
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Quick Actions</p>
                  <h3 className="text-xl font-bold mt-1">Manage Finance</h3>
                </div>

                <div className="text-[#16A34A]">
                  <Wallet size={24} />
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full h-14 rounded-2xl bg-[#16A34A] text-white font-medium">
                  Add Income
                </button>

                <button className="w-full h-14 rounded-2xl bg-[#F8FAFC] border border-slate-200 font-medium text-slate-700">
                  Add Expense
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full h-14 rounded-2xl bg-red-50 text-red-500 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* RECENT TRANSACTIONS */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Recent Transactions</h2>
                <p className="text-sm text-slate-500">
                  Latest finance activity
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.recentTransactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        item.type === "income"
                          ? "bg-green-100 text-[#16A34A]"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {item.type === "income" ? (
                        <ArrowDownCircle size={22} />
                      ) : (
                        <ArrowUpCircle size={22} />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        {item.type}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`font-bold text-lg ${
                      item.type === "income" ? "text-[#16A34A]" : "text-red-500"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"} Rp{" "}
                    {item.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}
