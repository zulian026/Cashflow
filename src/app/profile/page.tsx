"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import { profileService } from "@/services/profileService";
import PageSkeleton from "@/components/skeleton/PageSkeleton";
import { User, Mail, Save, Shield } from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();

        setProfile(data);
        setFullName(data.full_name);
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Terjadi kesalahan saat mengambil profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!fullName) {
      alert("Full name wajib");
      return;
    }

    try {
      setSaving(true);

      await profileService.updateProfile(fullName);

      alert("Profile berhasil diperbarui");

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: fullName,
            }
          : prev,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <AuthGuard>
        <AppLayout>
          <PageSkeleton />
        </AppLayout>
      </AuthGuard>
    );
  }

  const firstLetter = profile.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <AuthGuard>
      <AppLayout>
        <main className="space-y-6">
          {/* HEADER */}
          <section className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Profile Settings</p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  Manage Your Account
                </h1>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center">
                <User size={24} />
              </div>
            </div>
          </section>

          {/* PROFILE SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-[#16A34A] text-white flex items-center justify-center text-3xl font-bold mb-5">
                  {firstLetter}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {profile.full_name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">{profile.email}</p>

                <div className="mt-6 w-full">
                  <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-[#16A34A]" />
                      <div className="text-left">
                        <p className="font-medium text-slate-800">
                          Account Status
                        </p>
                        <p className="text-sm text-slate-500">
                          Active & Secure
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>

              <div className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full h-14 pl-11 pr-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-slate-500"
                    />
                  </div>
                </div>

                {/* FULL NAME */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full h-14 pl-11 pr-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="mt-2 h-14 px-6 rounded-2xl bg-[#16A34A] text-white font-medium flex items-center gap-2 hover:opacity-90 transition"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </div>
          </section>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}
