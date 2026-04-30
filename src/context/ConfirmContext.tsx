"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message?: string;
  onConfirm: () => void;
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const showConfirm = (data: ConfirmOptions) => {
    setOptions(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions(null);
  };

  const handleConfirm = () => {
    options?.onConfirm();
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">
              {options?.title || "Confirm Delete"}
            </h2>

            <p className="text-slate-500 mt-2">
              {options?.message || "Are you sure you want to delete this item?"}
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
                Delete
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
