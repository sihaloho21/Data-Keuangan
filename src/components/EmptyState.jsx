import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description }) {
  return (
    <div className="panel flex flex-col items-center justify-center px-4 py-8 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 font-semibold text-slate-950">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>}
    </div>
  );
}
