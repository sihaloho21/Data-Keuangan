export default function ProgressBar({ value, tone = 'sky' }) {
  const tones = {
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500',
  };

  return (
    <div className="h-2 overflow-hidden rounded bg-slate-100">
      <div
        className={`h-full rounded ${tones[tone] || tones.sky}`}
        style={{ width: `${Math.min(Math.max(Number(value) || 0, 0), 100)}%` }}
      />
    </div>
  );
}
