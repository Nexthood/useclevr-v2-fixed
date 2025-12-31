export default function KpiCard({ title = "KPI", value = "-" }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16 }}>
      <div>{title}</div>
      <strong>{value}</strong>
    </div>
  );
}
