export default function CorrelationHeatmap({ matrix }) {
  if (!matrix || Object.keys(matrix).length === 0) {
    return <p className="text-gray-500">No correlations found.</p>;
  }

  const cols = Object.keys(matrix);

  // Color scale (blue → white → red)
  function colorForValue(v) {
    const value = (v + 1) / 2; 
    const r = Math.round(255 * value);
    const b = Math.round(255 * (1 - value));
    return `rgb(${r}, 80, ${b})`;
  }

  return (
    <div className="overflow-x-auto max-w-full">
      <table
        className="
          border-collapse 
          rounded-xl 
          overflow-hidden
          shadow-[0_0_20px_rgba(0,255,255,0.15)]
        "
      >
        <thead>
          <tr>
            <th className="p-2 bg-black/40 text-gray-300 text-sm"></th>
            {cols.map((c) => (
              <th
                key={c}
                className="
                  p-2 bg-black/40 text-gray-200 text-xs 
                  min-w-[70px] text-center font-medium
                "
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {cols.map((row) => (
            <tr key={row}>
              <th
                className="
                  p-2 bg-black/40 text-gray-200 text-xs 
                  font-medium sticky left-0
                "
              >
                {row}
              </th>

              {cols.map((col) => {
                const val = matrix[row][col] ?? 0;

                return (
                  <td
                    key={col}
                    className="
                      text-xs font-semibold text-white 
                      border border-white/10 text-center
                      hover:scale-[1.1] hover:z-10 relative
                      transition duration-200
                    "
                    style={{
                      backgroundColor: colorForValue(val),
                    }}
                    title={`${row} → ${col}: ${val}`}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
