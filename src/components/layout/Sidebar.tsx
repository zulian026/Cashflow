"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  PiggyBank,
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
  { name: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? "80px" : "200px",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="min-h-[calc(100vh-40px)] bg-white rounded-[30px] border border-slate-100 shadow-sm flex flex-col justify-between py-6 overflow-hidden flex-shrink-0"
    >
      {/* TOP SECTION */}
      <div>
        {/* LOGO + TOGGLE */}
        <div className="flex items-center justify-center mb-8 px-3 relative">
          <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-lg font-bold">C</span>
          </div>

          {/* App name — hanya muncul saat expanded */}
          <div
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              marginLeft: collapsed ? 0 : "10px",
              transition:
                "opacity 0.2s ease, width 0.3s ease, margin 0.3s ease",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <span className="text-sm font-bold text-slate-800">CashFlow</span>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-1 px-3">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.path;

            return (
              <Link
                key={menu.path}
                href={menu.path}
                title={menu.name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#16A34A] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                style={{ overflow: "hidden", whiteSpace: "nowrap" }}
              >
                <Icon size={20} className="flex-shrink-0" />

                <span
                  style={{
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : "auto",
                    transition: "opacity 0.2s ease, width 0.3s ease",
                    overflow: "hidden",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {menu.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM — Collapse Toggle */}
      <div className="px-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
          style={{ overflow: "hidden", whiteSpace: "nowrap" }}
        >
          <ChevronLeft
            size={20}
            className="flex-shrink-0 transition-transform duration-300"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
          />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              transition: "opacity 0.2s ease, width 0.3s ease",
              overflow: "hidden",
              fontSize: "0.8125rem",
              fontWeight: 500,
            }}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}
