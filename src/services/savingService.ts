// src/services/savingService.ts

import { supabase } from "@/lib/supabase";

interface AddSavingGoalPayload {
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
}

export const savingService = {
  async getSavingGoals() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { data, error } = await supabase
      .from("saving_goals")
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

  async addSavingGoal(payload: AddSavingGoalPayload) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { error } = await supabase.from("saving_goals").insert([
      {
        user_id: user.id,
        title: payload.title,
        target_amount: payload.target_amount,
        current_amount: payload.current_amount,
        target_date: payload.target_date,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }
  },

  async deleteSavingGoal(id: string) {
    const { error } = await supabase.from("saving_goals").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async addSavingAmount(goalId: string, amount: number) {
    // ambil current dulu
    const { data, error: fetchError } = await supabase
      .from("saving_goals")
      .select("current_amount")
      .eq("id", goalId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const newAmount = Number(data.current_amount) + amount;

    const { error } = await supabase
      .from("saving_goals")
      .update({ current_amount: newAmount })
      .eq("id", goalId);

    if (error) throw new Error(error.message);
  },
};
