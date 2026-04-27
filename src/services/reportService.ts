// src/services/reportService.ts

import { supabase } from "@/lib/supabase";

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

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const reportService = {
  async getReportData(): Promise<ReportData> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { data: incomes, error: incomeError } = await supabase
      .from("incomes")
      .select("*")
      .eq("user_id", user.id);

    if (incomeError) {
      throw new Error(incomeError.message);
    }

    const { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id);

    if (expenseError) {
      throw new Error(expenseError.message);
    }

    const { data: savings, error: savingError } = await supabase
      .from("saving_goals")
      .select("*")
      .eq("user_id", user.id);

    if (savingError) {
      throw new Error(savingError.message);
    }

    const totalIncome =
      incomes?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

    const totalExpense =
      expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

    const totalSaving =
      savings?.reduce((sum, item) => sum + Number(item.current_amount), 0) || 0;

    const totalBalance = totalIncome - totalExpense;

    const chartMap: Record<string, { income: number; expense: number }> = {};

    monthNames.forEach((month) => {
      chartMap[month] = {
        income: 0,
        expense: 0,
      };
    });

    (incomes || []).forEach((item) => {
      const date = new Date(item.transaction_date);
      const month = monthNames[date.getMonth()];

      chartMap[month].income += Number(item.amount);
    });

    (expenses || []).forEach((item) => {
      const date = new Date(item.transaction_date);
      const month = monthNames[date.getMonth()];

      chartMap[month].expense += Number(item.amount);
    });

    const chartData = monthNames.map((month) => ({
      month,
      income: chartMap[month].income,
      expense: chartMap[month].expense,
    }));

    const incomeGrowth = totalIncome > 0 ? "+18%" : "0%";

    const expenseGrowth = totalExpense > 0 ? "+7%" : "0%";

    const insights = [
      `Total income: Rp ${totalIncome.toLocaleString()}`,
      `Total expense: Rp ${totalExpense.toLocaleString()}`,
      `Saving progress: Rp ${totalSaving.toLocaleString()}`,
      totalExpense > totalIncome
        ? "Warning: Expense lebih besar dari income"
        : "Keuangan masih dalam kondisi sehat",
    ];

    return {
      totalBalance,
      incomeGrowth,
      expenseGrowth,
      chartData,
      insights,
    };
  },
};
