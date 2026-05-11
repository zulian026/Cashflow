"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200">
              <Bell size={16} />

              {/* Notification Dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#16A34A] ring-2 ring-white" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/60 p-2"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>

                <span className="text-[11px] text-slate-400">3 new</span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Notification Item */}
            <DropdownMenuItem className="rounded-[14px] p-3 cursor-pointer flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5" />

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">
                  Monthly budget reached
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  You’ve used 80% of your monthly budget.
                </p>

                <span className="text-[11px] text-slate-300 mt-2 block">
                  2 min ago
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-[14px] p-3 cursor-pointer flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">
                  Saving goal updated
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Your emergency fund is now 65% complete.
                </p>

                <span className="text-[11px] text-slate-300 mt-2 block">
                  1 hour ago
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <button className="w-full text-center text-sm text-[#16A34A] font-medium py-2 hover:bg-slate-50 rounded-[12px] transition">
              View all notifications
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-[14px] hover:bg-slate-50 transition-all duration-200 group outline-none">
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
                className="text-slate-400 transition-transform duration-200"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/60 p-2"
          >
            <DropdownMenuLabel className="p-0">
              <div className="flex items-center gap-3 px-2 py-2">
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
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-[12px] text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <LogOut size={14} className="mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
