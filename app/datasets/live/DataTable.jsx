"use client";

export default function DataTable({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">Dataset is empty.</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="border rounded-xl overflow-auto bg-white shadow max-h-[500px]">
      <table className="min-w-full text-sm">
        
        {/* Header */}
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Rows */}
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2">
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
