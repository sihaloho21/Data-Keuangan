import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { formatCurrency } from '../utils/currency';
import { formatMonth } from '../utils/date';

export default function Budgets({
  month,
  onMonthChange,
  categories,
  summary,
  currency,
  onSaveBudget,
  busy,
}) {
  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'expense'),
    [categories],
  );
  const [form, setForm] = useState({
    category: expenseCategories[0]?.name || '',
    limit_amount: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!form.category && expenseCategories[0]) {
      setForm((current) => ({ ...current, category: expenseCategories[0].name }));
    }
  }, [expenseCategories, form.category]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.category) {
      setError('Kategori wajib dipilih.');
      return;
    }

    if (!Number(form.limit_amount) || Number(form.limit_amount) <= 0) {
      setError('Limit budget harus lebih dari 0.');
      return;
    }

    await onSaveBudget({
      month,
      category: form.category,
      limit_amount: Number(form.limit_amount),
    });
    setForm((current) => ({ ...current, limit_amount: '' }));
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={formatMonth(month)} title="Budget">
        <input
          type="month"
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          aria-label="Pilih bulan budget"
          className="w-full sm:w-auto"
        />
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <form className="panel p-4" onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold text-slate-950">Atur Limit</h2>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="budget-category">Kategori</label>
              <select
                id="budget-category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="budget-limit">Limit</label>
              <input
                id="budget-limit"
                type="number"
                min="0"
                inputMode="decimal"
                value={form.limit_amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, limit_amount: event.target.value }))
                }
                placeholder="0"
              />
            </div>
          </div>
          {error && <p className="mt-3 text-sm font-medium text-rose-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Simpan Budget</span>
          </button>
        </form>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-950">Progress Budget</h2>
            <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-soft">
              {summary.budgetProgress.length}
            </span>
          </div>

          {summary.budgetProgress.length === 0 ? (
            <EmptyState
              title="Budget belum dibuat"
              description="Limit pengeluaran per kategori akan tampil sebagai progress bulanan."
            />
          ) : (
            <div className="space-y-3">
              {summary.budgetProgress.map((budget) => (
                <article key={`${budget.month}-${budget.category}`} className="panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{budget.category}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Sisa {formatCurrency(budget.remaining, currency)}
                      </p>
                    </div>
                    <p className="text-right text-sm font-bold text-slate-950">
                      {Math.round(budget.percent)}%
                    </p>
                  </div>
                  <div className="mt-4">
                    <ProgressBar
                      value={budget.percent}
                      tone={budget.percent >= 90 ? 'rose' : budget.percent >= 70 ? 'amber' : 'emerald'}
                    />
                  </div>
                  <div className="mt-3 flex justify-between gap-3 text-sm text-slate-600">
                    <span>{formatCurrency(budget.spent, currency)}</span>
                    <span>{formatCurrency(budget.limit_amount, currency)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
