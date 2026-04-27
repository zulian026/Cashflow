import { supabase } from "@/lib/supabase";

type TransactionType = "income" | "expense";

type TableName = "incomes" | "expenses";

interface AddTransactionPayload {
  title: string;
  amount: number;
  category: string;
  notes: string;
}

const getTableName = (type: TransactionType): TableName => {
  return type === "income" ? "incomes" : "expenses";
};

export const transactionService = {
  async getTransactions(type: TransactionType) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const tableName = getTableName(type);

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async addTransaction(type: TransactionType, payload: AddTransactionPayload) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const tableName = getTableName(type);

    const transactionData =
      type === "income"
        ? {
            user_id: user.id,
            amount: payload.amount,
            source: payload.title,
            description: payload.notes,
            transaction_date: new Date().toISOString(),
          }
        : {
            user_id: user.id,
            amount: payload.amount,
            purpose: payload.title,
            description: payload.notes,
            transaction_date: new Date().toISOString(),
          };

    const { error } = await supabase.from(tableName).insert([transactionData]);

    if (error) {
      throw new Error(error.message);
    }
  },

  async deleteTransaction(type: TransactionType, id: string) {
    const tableName = getTableName(type);

    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};
