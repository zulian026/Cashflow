import React from "react";

interface Props {
  title: string;
  amount: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, amount, icon }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-2xl font-bold mt-2">{amount}</h2>
        </div>

        <div className="p-3 rounded-xl bg-gray-100">{icon}</div>
      </div>
    </div>
  );
}
