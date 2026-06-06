import { Pencil, Trash2 } from 'lucide-react';
import CategoryIcon from './iconMap';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

export default function TransactionList({
  transactions,
  categories,
  currency,
  onEdit,
  onDelete,
  compact = false,
}) {
  const categoryMap = new Map(categories.map((category) => [category.name, category]));

  if (!transactions.length) {
    return (
      <EmptyState
        title="Belum ada transaksi"
        description="Data yang sesuai filter akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => {
        const category = categoryMap.get(transaction.category);
        const isIncome = transaction.type === 'income';

        return (
          <article key={transaction.id} className="panel p-3">
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: category?.color || (isIncome ? '#047857' : '#64748b') }}
              >
                <CategoryIcon icon={category?.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{transaction.category}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {formatDate(transaction.date)} · {transaction.wallet}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-right text-sm font-bold ${
                      isIncome ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, currency)}
                  </p>
                </div>
                {!compact && transaction.note && (
                  <p className="mt-2 text-sm text-slate-600">{transaction.note}</p>
                )}
                {(onEdit || onDelete) && (
                  <div className="mt-3 flex justify-end gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => onEdit(transaction)}
                        title="Edit transaksi"
                        aria-label="Edit transaksi"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="icon-button text-rose-600 hover:text-rose-700"
                        onClick={() => onDelete(transaction.id)}
                        title="Hapus transaksi"
                        aria-label="Hapus transaksi"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
