export default function DatasetPreview({ dataset }) {
  if (!dataset || dataset.length === 0) {
    return (
      <div className="p-6 bg-white/10 border border-white/10 rounded-xl text-gray-400">
        No data to preview.
      </div>
    );
  }

  const columns = Object.keys(dataset[0]);
  const previewRows = dataset.slice(0, 50);

  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold text-white mb-3">Dataset Preview</h2>

      <table className="min-w-full text-left text-sm text-gray-300">
        <thead className="border-b border-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 font-semibold text-white">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewRows.map((row, i) => (
            <tr key={i} className="border-b border-gray-800">
              {columns.map((col) => (
                <td key={col} className="px-3 py-2">
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-gray-400 text-xs">
        Showing first 50 rows • Total rows: {dataset.length}
      </p>
    </div>
  );
}
