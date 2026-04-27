"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";
import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>({ full_name: "", email: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      setUser({
        full_name: authUser.user_metadata?.full_name || "User",
        email: authUser.email || "",
      });
    };

    getUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  const firstLetter = user.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-4">
      <header className="bg-white rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm border border-slate-100">
        {/* LEFT */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 leading-tight">
            Welcome Back,
            <span className="text-slate-400"> {user.full_name}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your finances easily and efficiently
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Search */}
          {/* <button className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center">
            <Search size={16} className="text-slate-600" />
          </button> */}

          {/* Notification */}
          {/* <button className="relative w-9 h-9 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center">
            <Bell size={16} className="text-slate-600" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button> */}

          {/* User Dropdown */}
          <div className="relative pl-1" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden xl:block">
                <p className="text-xs font-semibold text-slate-800">{user.full_name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[#16A34A] flex items-center justify-center text-white font-bold text-sm">
                {firstLetter}
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-lg py-1.5 z-50">
                {/* User info (mobile fallback) */}
                <div className="xl:hidden px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.full_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-auto"
                >
                  <LogOut size={15} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] p-5">
      <div className="max-w-[1600px] mx-auto flex gap-5 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 pt-6">
            <div className="bg-white rounded-[30px] p-6 min-h-[calc(100vh-140px)] border border-slate-100 shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}