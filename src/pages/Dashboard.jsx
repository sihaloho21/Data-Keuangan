import { Database, Wallet } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import TransactionList from '../components/TransactionList';
import { formatCurrency } from '../utils/currency';
import { formatMonth } from '../utils/date';

export default function Dashboard({
  month,
  onMonthChange,
  summary,
  walletBalances,
  categories,
  currency,
  sourceInfo,
}) {
  const categoryEntries = Object.entries(summary.expenseByCategory).sort((left, right) => right[1] - left[1]);
  const maxCategoryAmount = Math.max(...categoryEntries.map(([, amount]) => amount), 1);
  const topBudgets = summary.budgetProgress.slice(0, 3);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={formatMonth(month)} title="Dashboard">
        <input
          type="month"
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          aria-label="Pilih bulan dashboard"
          className="w-full sm:w-auto"
        />
      </PageHeader>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard title="Saldo Bersih" amount={summary.balance} tone="balance" currency={currency} />
        <MetricCard title="Pemasukan" amount={summary.totalIncome} tone="income" currency={currency} />
        <MetricCard title="Pengeluaran" amount={summary.totalExpense} tone="expense" currency={currency} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Transaksi Terbaru</h2>
              <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-soft">
                {summary.recentTransactions.length} item
              </span>
            </div>
            <TransactionList
              transactions={summary.recentTransactions}
              categories={categories}
              currency={currency}
              compact
            />
          </div>

          <div className="panel p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Pengeluaran Kategori</h2>
              <Database className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <div className="mt-4 space-y-4">
              {categoryEntries.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada pengeluaran bulan ini.</p>
              ) : (
                categoryEntries.slice(0, 5).map(([category, amount]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700">{category}</span>
                      <span className="font-bold text-slate-950">{formatCurrency(amount, currency)}</span>
                    </div>
                    <ProgressBar value={(amount / maxCategoryAmount) * 100} tone="slate" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Dompet</h2>
              <Wallet className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {walletBalances.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{wallet.name}</p>
                    <p className="truncate text-sm text-slate-500">{wallet.note || 'Sumber dana'}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {formatCurrency(wallet.balance, currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Budget Aktif</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {sourceInfo.label}
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {topBudgets.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada budget untuk bulan ini.</p>
              ) : (
                topBudgets.map((budget) => (
                  <div key={`${budget.month}-${budget.category}`} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700">{budget.category}</span>
                      <span className="font-bold text-slate-950">
                        {formatCurrency(budget.spent, currency)}
                      </span>
                    </div>
                    <ProgressBar
                      value={budget.percent}
                      tone={budget.percent >= 90 ? 'rose' : budget.percent >= 70 ? 'amber' : 'emerald'}
                    />
                    <p className="text-xs text-slate-500">
                      Limit {formatCurrency(budget.limit_amount, currency)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
