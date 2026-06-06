import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { formatCurrency } from '../utils/currency';
import { formatMonth } from '../utils/date';

export default function Reports({ month, onMonthChange, summary, trend, currency }) {
  const categoryEntries = Object.entries(summary.expenseByCategory).sort((left, right) => right[1] - left[1]);
  const maxCategoryAmount = Math.max(...categoryEntries.map(([, amount]) => amount), 1);
  const trendMax = Math.max(...trend.flatMap((item) => [item.income, item.expense]), 1);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={formatMonth(month)} title="Laporan">
        <input
          type="month"
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          aria-label="Pilih bulan laporan"
          className="w-full sm:w-auto"
        />
      </PageHeader>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard title="Pemasukan" amount={summary.totalIncome} tone="income" currency={currency} />
        <MetricCard title="Pengeluaran" amount={summary.totalExpense} tone="expense" currency={currency} />
        <MetricCard title="Saldo" amount={summary.balance} tone="balance" currency={currency} />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="panel p-4">
          <h2 className="text-lg font-bold text-slate-950">Pengeluaran per Kategori</h2>
          <div className="mt-4 space-y-4">
            {categoryEntries.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada data pengeluaran bulan ini.</p>
            ) : (
              categoryEntries.map(([category, amount]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-700">{category}</span>
                    <span className="font-bold text-slate-950">{formatCurrency(amount, currency)}</span>
                  </div>
                  <ProgressBar value={(amount / maxCategoryAmount) * 100} tone="rose" />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="panel p-4">
          <h2 className="text-lg font-bold text-slate-950">Tren 6 Bulan</h2>
          <div className="mt-4 space-y-4">
            {trend.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-700">{formatMonth(item.month)}</span>
                  <span className="font-bold text-slate-950">{formatCurrency(item.balance, currency)}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="h-full rounded bg-emerald-500"
                      style={{ width: `${Math.min((item.income / trendMax) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="h-full rounded bg-rose-500"
                      style={{ width: `${Math.min((item.expense / trendMax) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-3 text-xs text-slate-500">
                  <span>Masuk {formatCurrency(item.income, currency)}</span>
                  <span>Keluar {formatCurrency(item.expense, currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
