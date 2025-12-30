export default function SchemaInspector({ schema }) {
  if (!schema || schema.length === 0) {
    return (
      <p className="text-gray-500">No schema detected.</p>
    );
  }

  return (
    <div className="
      overflow-hidden rounded-xl
      bg-white/10 dark:bg-[#0B0B12]/30
      backdrop-blur-xl
      border border-white/10
      shadow-[0_0_20px_rgba(0,255,255,0.15)]
    ">
      <table className="w-full text-left">
        <thead className="bg-white/10 dark:bg-black/30">
          <tr>
            <th className="p-4 text-white font-semibold">Column</th>
            <th className="p-4 text-white font-semibold">Type</th>
            <th className="p-4 text-white font-semibold">Sample</th>
            <th className="p-4 text-white font-semibold">Missing %</th>
          </tr>
        </thead>

        <tbody>
          {schema.map((col, i) => (
            <tr
              key={i}
              className="
                border-t border-white/10 
                hover:bg-white/10 hover:backdrop-blur-xl
                transition
              "
            >
              <td className="p-4 text-gray-200">{col.column}</td>
              <td className="p-4 text-cyan-300 font-medium">{col.type}</td>
              <td className="p-4 text-gray-300">
                {col.sample || "—"}
              </td>
              <td className="p-4 text-gray-300">
                {col.emptyPercentage.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
