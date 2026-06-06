import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { filterTransactions } from '../utils/calculations';

export default function Transactions({
  transactions,
  categories,
  wallets,
  settings,
  month,
  onMonthChange,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  busy,
}) {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    wallet: '',
    search: '',
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, { ...filters, month }),
    [transactions, filters, month],
  );

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(data) {
    if (editingTransaction) {
      await onUpdateTransaction(data);
      setEditingTransaction(null);
      return;
    }

    await onAddTransaction(data);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Hapus transaksi ini?');
    if (!confirmed) return;
    await onDeleteTransaction(id);
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Kas harian" title="Transaksi">
        <input
          type="month"
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          aria-label="Pilih bulan transaksi"
          className="w-full sm:w-auto"
        />
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <TransactionForm
          categories={categories}
          wallets={wallets}
          defaultWallet={settings.default_wallet}
          editingTransaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingTransaction(null)}
          busy={busy}
        />

        <section className="space-y-3">
          <div className="panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Daftar Transaksi</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {filteredTransactions.length}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="relative sm:col-span-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  className="w-full pl-9"
                  placeholder="Cari catatan, kategori, dompet"
                  aria-label="Cari transaksi"
                />
              </div>

              <select
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value)}
                aria-label="Filter tipe transaksi"
              >
                <option value="">Semua tipe</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>

              <select
                value={filters.category}
                onChange={(event) => updateFilter('category', event.target.value)}
                aria-label="Filter kategori"
              >
                <option value="">Semua kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.wallet}
                onChange={(event) => updateFilter('wallet', event.target.value)}
                aria-label="Filter dompet"
                className="sm:col-span-2"
              >
                <option value="">Semua dompet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.name}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TransactionList
            transactions={filteredTransactions}
            categories={categories}
            currency={settings.currency}
            onEdit={setEditingTransaction}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  );
}
