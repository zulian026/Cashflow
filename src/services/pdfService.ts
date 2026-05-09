// src/services/pdfService.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabase";

export const pdfService = {
  async generateFinanceReport() {
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (incomeError) throw new Error(incomeError.message);

    const { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (expenseError) throw new Error(expenseError.message);

    const { data: savingGoals, error: savingError } = await supabase
      .from("saving_goals")
      .select("*")
      .eq("user_id", user.id);

    if (savingError) throw new Error(savingError.message);

    const totalIncome =
      incomes?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

    const totalExpense =
      expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

    const totalSaving =
      savingGoals?.reduce(
        (sum, item) => sum + Number(item.current_amount),
        0,
      ) || 0;

    const totalBalance = totalIncome - totalExpense;

    const transactions = [
      ...(incomes || []).map((item) => ({
        title: item.source,
        type: "Income",
        amount: Number(item.amount),
      })),
      ...(expenses || []).map((item) => ({
        title: item.purpose,
        type: "Expense",
        amount: Number(item.amount),
      })),
    ].slice(0, 10);

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("CashFlow Financial Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated at: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.text("Summary", 14, 45);

    doc.text(`Total Income: Rp ${totalIncome.toLocaleString()}`, 14, 55);
    doc.text(`Total Expense: Rp ${totalExpense.toLocaleString()}`, 14, 63);
    doc.text(`Total Balance: Rp ${totalBalance.toLocaleString()}`, 14, 71);
    doc.text(`Saving Goals: Rp ${totalSaving.toLocaleString()}`, 14, 79);

    autoTable(doc, {
      startY: 90,
      head: [["Title", "Type", "Amount"]],
      body: transactions.map((item) => [
        item.title,
        item.type,
        `Rp ${item.amount.toLocaleString()}`,
      ]),
    });

    // 🔥 RETURN BLOB (INI KUNCI)
    return doc.output("blob");
  },
};
