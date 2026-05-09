"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message?: string;
  variant?: "default" | "danger";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null,
  );

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);
    setOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleClose = () => {
    resolver?.(false);
    setOpen(false);
    setOptions(null);
    setResolver(null);
  };

  const handleConfirm = () => {
    resolver?.(true);
    setOpen(false);
    setOptions(null);
    setResolver(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">
              {options?.title || "Confirm"}
            </h2>

            <p className="text-slate-500 mt-2">
              {options?.message || "Are you sure?"}
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-5 h-11 rounded-xl border border-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-5 h-11 rounded-xl bg-red-500 text-white"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
}
