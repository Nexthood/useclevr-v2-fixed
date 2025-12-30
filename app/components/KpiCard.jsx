export default function KpiCard({ kpi }) {
  return (
    <div className="
      p-6 rounded-xl 
      bg-white/10 dark:bg-[#0B0B12]/30 
      border border-white/10 
      backdrop-blur-xl
      shadow-[0_0_20px_rgba(0,255,255,0.15)]
      hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]
      transition
    ">
      <h3 className="text-lg font-semibold text-white mb-2">{kpi.column}</h3>

      <div className="space-y-1 text-gray-300 text-sm">
        <p><strong>Sum:</strong> {kpi.sum.toLocaleString()}</p>
        <p><strong>Average:</strong> {kpi.avg.toLocaleString()}</p>
        <p><strong>Min:</strong> {kpi.min}</p>
        <p><strong>Max:</strong> {kpi.max}</p>
        <p><strong>Anomalies:</strong> {kpi.anomalies}</p>
      </div>
    </div>
  );
}
