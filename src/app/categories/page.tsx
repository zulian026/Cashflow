"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { categoryService, Category } from "@/services/categoryService";
import { Plus, Trash2, LayoutList } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useConfirm } from "@/context/ConfirmContext";

type FilterType = "all" | "income" | "expense";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CategoriesPage() {
  const { showConfirm } = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setAdding(true);

      await categoryService.createCategory(name.trim(), type);

      setName("");

      // 🔥 refresh data
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to add category");
      }
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);

      await categoryService.deleteCategory(id);
      await fetchCategories();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to delete category");
      }
    } finally {
      setDeletingId(null);
    }
  }

  const filtered =
    filter === "all" ? categories : categories.filter((c) => c.type === filter);

  const incomeCount = categories.filter((c) => c.type === "income").length;
  const expenseCount = categories.filter((c) => c.type === "expense").length;

  return (
    <AuthGuard>
      <AppLayout>
        <main className="space-y-6">
          {/* HEADER CARD */}
          <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Finance
                </p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
                  Categories
                </h1>
              </div>
              <div className="w-10 h-10 rounded-[14px] bg-[#16A34A] flex items-center justify-center text-white shadow-sm">
                <LayoutList size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-[18px] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Total
                </p>
                <p className="text-3xl font-bold text-slate-900 leading-none tracking-tight tabular-nums">
                  {categories.length}
                </p>
              </div>
              <div className="bg-[#F0FDF4] rounded-[18px] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#15803D] mb-1">
                  Income
                </p>
                <p className="text-3xl font-bold text-[#15803D] leading-none tracking-tight tabular-nums">
                  {incomeCount}
                </p>
              </div>
              <div className="bg-red-50 rounded-[18px] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-700 mb-1">
                  Expense
                </p>
                <p className="text-3xl font-bold text-red-700 leading-none tracking-tight tabular-nums">
                  {expenseCount}
                </p>
              </div>
            </div>
          </div>

          {/* ADD FORM CARD */}
          <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex gap-2 items-center">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Category name..."
                maxLength={40}
                className="flex-1 h-11 px-4 text-sm font-medium border border-slate-200 rounded-[14px] bg-slate-50 focus:outline-none focus:ring-[3px] focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
              />
              <div className="flex border border-slate-200 rounded-[14px] overflow-hidden h-11 shrink-0">
                <button
                  onClick={() => setType("expense")}
                  className={`px-4 text-xs font-semibold transition ${
                    type === "expense"
                      ? "bg-red-50 text-red-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Expense
                </button>
                <div className="w-px bg-slate-200" />
                <button
                  onClick={() => setType("income")}
                  className={`px-4 text-xs font-semibold transition ${
                    type === "income"
                      ? "bg-[#F0FDF4] text-[#15803D]"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Income
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={adding || !name.trim()}
                className="flex items-center gap-2 h-11 px-5 bg-[#16A34A] text-white text-sm font-bold rounded-[14px] hover:bg-[#15803D] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
              >
                <Plus size={15} />
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          {/* LIST CARD */}
          <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Browse
                </p>
                <h2 className="text-lg font-bold text-slate-900 mt-1 tracking-tight">
                  All Categories
                </h2>
              </div>
              <div className="flex gap-1.5">
                {(["all", "income", "expense"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`h-8 px-4 rounded-full text-xs font-semibold border transition capitalize ${
                      filter === f
                        ? f === "all"
                          ? "bg-slate-900 text-white border-transparent"
                          : f === "income"
                            ? "bg-[#F0FDF4] text-[#15803D] border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 mb-4" />

            {/* Skeleton loading */}
            {loading && (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-[16px] bg-slate-50 animate-pulse"
                  >
                    <div className="w-11 h-11 rounded-[14px] bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded-full w-1/3" />
                      <div className="h-2.5 bg-slate-100 rounded-full w-1/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">
                No categories found
              </div>
            )}

            {!loading && (
              <div className="space-y-2.5">
                {filtered.map((cat) => (
                  <div
                    key={cat.id}
                    className={`group flex items-center justify-between p-4 rounded-[16px] bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-150 cursor-pointer ${
                      deletingId === cat.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          cat.type === "income"
                            ? "bg-[#F0FDF4] text-[#15803D]"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {getInitials(cat.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {cat.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${
                              cat.type === "income"
                                ? "bg-[#16A34A]"
                                : "bg-red-400"
                            }`}
                          />
                          <span className="text-xs text-slate-400 font-medium capitalize">
                            {cat.type}
                          </span>
                          {cat.is_default && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 font-medium">
                              default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!cat.is_default ? (
                      <button
                        onClick={() =>
                          showConfirm({
                            title: "Delete Category",
                            message: `Are you sure you want to delete "${cat.name}"?`,
                            onConfirm: () => handleDelete(cat.id),
                          })
                        }
                        disabled={deletingId === cat.id}
                        className="flex items-center gap-1.5 px-3 h-8 rounded-[10px] text-xs font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        {deletingId === cat.id ? "Deleting..." : "Delete"}
                      </button>
                    ) : (
                      <div className="w-[72px]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}
