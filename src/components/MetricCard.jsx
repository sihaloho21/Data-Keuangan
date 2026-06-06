import { ArrowDownRight, ArrowUpRight, Scale } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const TONES = {
  balance: {
    icon: Scale,
    frame: 'border-sky-100 bg-sky-50 text-sky-700',
    amount: 'text-slate-950',
  },
  income: {
    icon: ArrowUpRight,
    frame: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amount: 'text-emerald-700',
  },
  expense: {
    icon: ArrowDownRight,
    frame: 'border-rose-100 bg-rose-50 text-rose-700',
    amount: 'text-rose-700',
  },
};

export default function MetricCard({ title, amount, tone = 'balance', currency }) {
  const config = TONES[tone] || TONES.balance;
  const Icon = config.icon;

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-md border ${config.frame}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className={`mt-3 break-words text-2xl font-bold tracking-normal ${config.amount}`}>
        {formatCurrency(amount, currency)}
      </p>
    </section>
  );
}
