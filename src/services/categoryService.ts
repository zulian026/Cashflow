// src/services/categoryService.ts

import { supabase } from "@/lib/supabase";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  is_default: boolean;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .or(`user_id.eq.${user.id},is_default.eq.true`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Category[];
  },

  // src/services/categoryService.ts

  async createCategory(name: string, type: "income" | "expense") {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { error } = await supabase.from("categories").insert([
      {
        name,
        type,
        user_id: user.id, // 🔥 ini penting banget
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("is_default", false); // 🔥 proteksi default

    if (error) {
      throw new Error(error.message);
    }
  },

  async updateCategory(id: string, name: string, type: "income" | "expense") {
    const { error } = await supabase
      .from("categories")
      .update({ name, type })
      .eq("id", id)
      .eq("is_default", false);

    if (error) {
      throw new Error(error.message);
    }
  },
};
