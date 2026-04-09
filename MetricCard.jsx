export default function MetricCard({ label, value, subtext }) {
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className="value mt-2">{value}</div>
      {subtext ? <div className="mt-2 text-sm text-soft">{subtext}</div> : null}
    </div>
  );
}
