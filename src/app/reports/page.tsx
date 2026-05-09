"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import FinanceChart from "@/components/charts/FinanceChart";
import PageSkeleton from "@/components/skeleton/PageSkeleton";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
} from "lucide-react";
import { reportService } from "@/services/reportService";
import { pdfService } from "@/services/pdfService";
import { useToast } from "@/components/ToastProvider";

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface ReportData {
  totalBalance: number;
  incomeGrowth: string;
  expenseGrowth: string;
  chartData: ChartData[];
  insights: string[];
}

export default function ReportsPage() {
  const { showToast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const [loading, setLoading] = useState(true);

  const handleDownloadPDF = async () => {
    try {
      const blob = await pdfService.generateFinanceReport();

      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
      setOpenPreview(true);
    } catch (error: unknown) {
      showToast(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat preview PDF",
        "error",
      );
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.getReportData();

        setReportData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Terjadi kesalahan saat mengambil laporan");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading || !reportData) {
    return (
      <AuthGuard>
        <AppLayout>
          <PageSkeleton />
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <main className="space-y-6">
          {/* HEADER */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Financial Reports</p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  Analytics & Monthly Overview
                </h1>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="h-14 px-6 rounded-2xl bg-[#16A34A] text-white font-medium flex items-center gap-2 hover:opacity-90 transition"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Balance */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-slate-500">Total Balance</p>
                  <h2 className="text-3xl font-bold mt-2">
                    Rp {reportData.totalBalance.toLocaleString()}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center">
                  <Wallet size={24} />
                </div>
              </div>
            </div>

            {/* Income Growth */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-slate-500">Income Growth</p>
                  <h2 className="text-3xl font-bold mt-2 text-[#16A34A]">
                    {reportData.incomeGrowth}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-100 text-[#16A34A] flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            {/* Expense Growth */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-slate-500">Expense Growth</p>
                  <h2 className="text-3xl font-bold mt-2 text-red-500">
                    {reportData.expenseGrowth}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
                  <TrendingDown size={24} />
                </div>
              </div>
            </div>
          </section>

          {/* CHART + SUMMARY */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CHART */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Income vs Expense</h2>
                <p className="text-sm text-slate-500">
                  Monthly financial performance
                </p>
              </div>

              <FinanceChart data={reportData.chartData} />
            </div>

            {/* REPORT STATUS */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Report Status</p>
                  <h3 className="text-xl font-bold mt-1">Financial Health</h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center">
                  <FileText size={24} />
                </div>
              </div>

              <div className="h-[250px] rounded-3xl bg-gradient-to-br from-[#16A34A] to-[#15803D] p-6 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Financial Score</p>
                  <h3 className="text-4xl font-bold mt-2">82%</h3>
                </div>

                <div>
                  <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="w-[82%] h-full bg-white rounded-full" />
                  </div>

                  <p className="text-sm mt-3 opacity-90">
                    Excellent performance this month
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* INSIGHTS */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Financial Insights</h2>
              <p className="text-sm text-slate-500">
                Smart recommendations for your finances
              </p>
            </div>

            <div className="space-y-4">
              {reportData.insights.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100"
                >
                  <p className="text-slate-700 font-medium">• {item}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        {openPreview && previewUrl && (
          <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
            <div className="w-[90%] h-[90%] bg-white rounded-2xl overflow-hidden flex flex-col">
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Preview PDF</h2>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = previewUrl;
                      link.download = "cashflow-report.pdf";
                      link.click();
                    }}
                    className="px-4 py-2 bg-[#16A34A] text-white rounded-lg"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => setOpenPreview(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* PDF VIEW */}
              <iframe src={previewUrl} className="flex-1 w-full" />
            </div>
          </div>
        )}
      </AppLayout>
    </AuthGuard>
  );
}
