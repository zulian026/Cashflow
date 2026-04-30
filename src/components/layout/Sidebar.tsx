"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  PiggyBank,
  Tag,
  User,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const menus = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Income", path: "/income", icon: ArrowDownCircle },
  { name: "Expense", path: "/expense", icon: ArrowUpCircle },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Savings", path: "/savings", icon: PiggyBank },
   { name: "Categories", path: "/categories", icon: Tag },
  { name: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "220px",
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="min-h-[calc(100vh-40px)] bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between py-5 overflow-hidden flex-shrink-0"
    >
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="flex items-center mb-8 px-4">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-[12px] bg-[#16A34A] flex items-center justify-center shadow-md">
              <span className="text-white text-base font-bold tracking-tight">
                C
              </span>
            </div>
            {/* subtle glow ring */}
            <div className="absolute inset-0 rounded-[12px] ring-2 ring-[#16A34A]/20 ring-offset-1" />
          </div>

          <div
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "160px",
              marginLeft: collapsed ? 0 : "12px",
              transition:
                "opacity 0.2s ease, max-width 0.35s ease, margin 0.35s ease",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <p className="text-[15px] font-bold text-slate-800 leading-none">
              CashFlow
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              Finance Manager
            </p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <div
          style={{
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.15s ease",
            height: collapsed ? 0 : "auto",
            overflow: "hidden",
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-5 mb-2">
            Main Menu
          </p>
        </div>

        {/* MENU */}
        <nav className="space-y-0.5 px-3">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.path;

            return (
              <Link
                key={menu.path}
                href={menu.path}
                title={collapsed ? menu.name : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all duration-200 group ${
                  isActive
                    ? "bg-[#16A34A] text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
                style={{ overflow: "hidden", whiteSpace: "nowrap" }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/40 rounded-r-full" />
                )}

                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    !isActive ? "group-hover:scale-110" : ""
                  }`}
                />

                <span
                  style={{
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : "160px",
                    transition: "opacity 0.2s ease, max-width 0.35s ease",
                    overflow: "hidden",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {menu.name}
                </span>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 shadow-lg">
                    {menu.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* DIVIDER */}
      <div className="px-4 my-2">
        <div className="h-px bg-slate-100" />
      </div>

      {/* BOTTOM — Collapse Toggle */}
      <div className="px-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200"
          style={{ overflow: "hidden", whiteSpace: "nowrap" }}
          title={collapsed ? "Expand sidebar" : undefined}
        >
          <ChevronLeft
            size={18}
            className="flex-shrink-0 transition-transform duration-300"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
          />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "160px",
              transition: "opacity 0.2s ease, max-width 0.35s ease",
              overflow: "hidden",
              fontSize: "0.8125rem",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}
