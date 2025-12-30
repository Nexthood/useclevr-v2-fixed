"use client";

export default function CorrelationHeatmap({ correlations }) {
  if (!correlations || Object.keys(correlations).length === 0) {
    return (
      <p className="text-gray-500">
        Not enough numeric columns for correlation analysis.
      </p>
    );
  }

  const cols = Object.keys(correlations);

  // Convert matrix into 2D array
  const matrix = cols.map((rowKey) =>
    cols.map((colKey) => correlations[rowKey][colKey])
  );

  function valueToColor(v) {
    // v = correlation -1 to +1
    const red = v < 0 ? 255 : Math.floor(255 - v * 255);
    const blue = v > 0 ? 255 : Math.floor(255 + v * 255);
    const green = 40;

    return `rgb(${red}, ${green}, ${blue})`;
  }

  return (
    <div className="overflow-auto">
      {/* Column headers */}
      <div className="grid" style={{ gridTemplateColumns: `120px repeat(${cols.length}, 80px)` }}>
        
        {/* Empty corner */}
        <div></div>

        {cols.map((c) => (
          <div key={c} className="text-xs font-semibold text-center p-2">
            {c}
          </div>
        ))}

        {/* Rows */}
        {matrix.map((row, i) => (
          <>
            {/* Row header */}
            <div key={"rh" + i} className="text-xs font-semibold p-2">
              {cols[i]}
            </div>

            {/* Row cells */}
            {row.map((val, j) => (
              <div
                key={`${i}-${j}`}
                className="flex items-center justify-center text-xs font-medium"
                style={{
                  width: 80,
                  height: 50,
                  backgroundColor: valueToColor(val),
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {val.toFixed(2)}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
