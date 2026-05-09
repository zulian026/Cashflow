"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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

  const handleLogin = async () => {
    try {
      setLoading(true);

      await authService.login(email, password);

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-4">
      <div className="w-full max-w-6xl h-[88vh] max-h-[760px] bg-white rounded-[32px] shadow-lg overflow-hidden grid lg:grid-cols-2">
        {/* Left Section */}
        <div className="hidden lg:flex relative bg-[#16A34A] p-10 text-white flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
              CF
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Your Finance
              <br />
              Starts Here
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Manage your income, expenses, savings, and financial goals in one
              simple place with CashFlow.
            </p>
          </div>

          <div className="text-sm text-white/80">
            Smart Finance Tracker for your daily life.
          </div>

          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute top-10 right-10 w-28 h-28 rounded-full bg-white/10" />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-6 md:p-10 bg-[#F8FAFC]">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#16A34A] text-2xl font-bold">
                CF
              </div>

              <h2 className="text-3xl font-bold text-[#1E293B] mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500">
                Login to continue managing your finances
              </p>
            </div>

            <div className="space-y-5">
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

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#1E293B]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#16A34A]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#16A34A] hover:bg-green-700 transition text-white font-semibold shadow-md"
              >
                {loading ? "Loading..." : "Login"}
              </button>

              <p className="text-center text-sm text-slate-500 pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#16A34A] font-semibold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
