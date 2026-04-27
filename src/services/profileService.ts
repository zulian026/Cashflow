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

  async updateProfile(
    fullName: string
  ) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { error } = await supabase
      .from("profiles")
      .upsert([
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
};