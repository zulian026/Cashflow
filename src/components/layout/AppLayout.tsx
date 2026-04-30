"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";
import { Bell, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import PageTransition from "./PageTransition";


interface Props {
  children: React.ReactNode;
}

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
  const greeting = getGreeting();

  // Get today's date formatted
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white rounded-[24px] px-6 py-4 flex items-center justify-between border border-slate-100 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Greeting Block */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800 leading-tight tracking-tight">
              {greeting},{" "}
              <span className="text-[#16A34A]">
                {user.full_name?.split(" ")[0]}
              </span>
            </h2>
            <span className="text-lg" role="img" aria-label="wave">
              👋
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{today}</p>
        </div>

        {/* Quick Stats Pill */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs font-semibold px-3 py-1.5 rounded-full">
          <Sparkles size={11} />
          <span>Finances on track</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative w-9 h-9 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#16A34A] ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-[14px] hover:bg-slate-50 transition-all duration-200 group"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-[12px] bg-[#16A34A] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {firstLetter}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>

            {/* Name + Email */}
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {user.full_name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                {user.email}
              </p>
            </div>

            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-[18px] shadow-xl shadow-slate-200/60 py-2 z-50 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#16A34A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {firstLetter}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-2 pt-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-[12px] transition-colors duration-150"
                >
                  <LogOut size={14} />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] p-5">
      <div className="max-w-[1600px] mx-auto flex gap-5 min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <Topbar />

          <main className="flex-1">
            <div className="bg-white rounded-[28px] p-6 min-h-[calc(100vh-160px)] border border-slate-100 shadow-sm">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
