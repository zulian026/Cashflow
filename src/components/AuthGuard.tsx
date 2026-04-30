"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const session = await authService.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    validateSession();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#16A34A] rounded-full animate-spin" />

          {/* Text */}
          <p className="text-sm font-medium text-slate-500">
            Loading, please wait...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
