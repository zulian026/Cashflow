// src/services/profileService.ts

import { supabase } from "@/lib/supabase";

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
}

export const profileService = {
  async getProfile(): Promise<ProfileData> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    return {
      id: user.id,
      email: user.email || "",
      full_name: data?.full_name || "",
    };
  },

  async updateProfile(fullName: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { error } = await supabase.from("profiles").upsert([
      {
        id: user.id,
        full_name: fullName,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    });
  },

  async resetUserData() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const userId = user.id;

    // ⚠️ penting: hapus dari child dulu (yang ada foreign key)
    const { error: expenseError } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", userId);

    if (expenseError) throw new Error(expenseError.message);

    const { error: incomeError } = await supabase
      .from("incomes")
      .delete()
      .eq("user_id", userId);

    if (incomeError) throw new Error(incomeError.message);

    const { error: billsError } = await supabase
      .from("bills")
      .delete()
      .eq("user_id", userId);

    if (billsError) throw new Error(billsError.message);

    const { error: budgetsError } = await supabase
      .from("budgets")
      .delete()
      .eq("user_id", userId);

    if (budgetsError) throw new Error(budgetsError.message);

    const { error: goalsError } = await supabase
      .from("saving_goals")
      .delete()
      .eq("user_id", userId);

    if (goalsError) throw new Error(goalsError.message);

    // 🔥 optional: reset categories user (biar balik default)
    const { error: categoryError } = await supabase
      .from("categories")
      .delete()
      .eq("user_id", userId)
      .eq("is_default", false); // jangan hapus default

    if (categoryError) throw new Error(categoryError.message);
  },
};
