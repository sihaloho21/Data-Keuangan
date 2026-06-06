export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-medium text-slate-500">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
