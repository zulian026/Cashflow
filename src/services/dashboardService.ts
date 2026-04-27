import { supabase } from "@/lib/supabase";

export const dashboardService = {
  async getDashboardData() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    // incomes
    const { data: incomes, error: incomeError } = await supabase
      .from("incomes")
      .select("*")
      .eq("user_id", user.id);

    if (incomeError) {
      throw new Error(incomeError.message);
    }

    // expenses
    const { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id);

    if (expenseError) {
      throw new Error(expenseError.message);
    }

    // saving goals
    const { data: savingGoals, error: savingError } = await supabase
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
      savingGoals?.reduce((sum, item) => sum + Number(item.target_amount), 0) ||
      0;

    const totalBalance = totalIncome - totalExpense;

    const recentTransactions = [
      ...(incomes || []).map((item) => ({
        id: item.id,
        title: item.source,
        amount: Number(item.amount),
        created_at: item.created_at,
        type: "income" as const,
      })),

      ...(expenses || []).map((item) => ({
        id: item.id,
        title: item.purpose,
        amount: Number(item.amount),
        created_at: item.created_at,
        type: "expense" as const,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);

    return {
      totalIncome,
      totalExpense,
      totalSaving,
      totalBalance,
      recentTransactions,
    };
  },
};
