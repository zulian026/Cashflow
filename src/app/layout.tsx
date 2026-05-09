import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { ToastProvider } from "@/components/ToastProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CashFlow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${jakarta.className} min-h-full flex flex-col`}>
        <ConfirmProvider>
          <ToastProvider>{children}</ToastProvider>
        </ConfirmProvider>
      </body>
    </html>
  );
}
