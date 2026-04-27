"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { authService } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const session = await authService.getSession();

      if (session) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await authService.register(fullName, email, password);

      alert("Register berhasil, silakan login");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-4">
      <div className="w-full max-w-6xl min-h-[720px] lg:min-h-[760px] bg-white rounded-[32px] shadow-lg overflow-hidden grid lg:grid-cols-2">
        {/* Left Section */}
        <div className="hidden lg:flex relative bg-[#16A34A] p-10 text-white flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
              CF
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Start Your
              <br />
              Finance Journey
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Create your CashFlow account and begin managing your income,
              expenses, savings, and financial goals with ease.
            </p>
          </div>

          <div className="text-sm text-white/80">
            Smart Finance Tracker for your daily life.
          </div>

          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute top-10 right-10 w-28 h-28 rounded-full bg-white/10" />
        </div>

        {/* Right Section */}
        <div className="flex items-start justify-center p-6 md:p-8 pt-10 bg-[#F8FAFC]">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#16A34A] text-2xl font-bold">
                CF
              </div>

              <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
                Create Account
              </h2>
              <p className="text-slate-500">
                Register to start managing your finances
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#1E293B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#1E293B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Create your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#1E293B]"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-green-700 transition text-white font-semibold shadow-md"
              >
                {loading ? "Loading..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-slate-500 pt-4 pb-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#16A34A] font-semibold hover:underline"
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
