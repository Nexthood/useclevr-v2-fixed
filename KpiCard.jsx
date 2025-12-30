"use client";

export default function KpiCard({ label, value, icon, color = "blue" }) {
  return (
    <div
      className={`p-5 rounded-xl shadow bg-white border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>

        {icon && (
          <div className={`text-${color}-500 text-3xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
