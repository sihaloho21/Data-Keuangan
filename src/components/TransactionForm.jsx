import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { getTodayInputValue, toDateInputValue } from '../utils/date';

const INITIAL_FORM = {
  date: getTodayInputValue(),
  type: 'expense',
  category: '',
  amount: '',
  wallet: '',
  note: '',
};

export default function TransactionForm({
  categories,
  wallets,
  defaultWallet,
  editingTransaction,
  onSubmit,
  onCancelEdit,
  busy,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === form.type),
    [categories, form.type],
  );

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        id: editingTransaction.id,
        date: toDateInputValue(editingTransaction.date),
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: String(editingTransaction.amount),
        wallet: editingTransaction.wallet,
        note: editingTransaction.note || '',
      });
      setError('');
      return;
    }

    setForm((current) => ({
      ...INITIAL_FORM,
      wallet: defaultWallet || wallets[0]?.name || '',
      category:
        categories.find((category) => category.type === INITIAL_FORM.type)?.name ||
        categories[0]?.name ||
        '',
    }));
  }, [editingTransaction, categories, wallets, defaultWallet]);

  useEffect(() => {
    if (filteredCategories.length && !filteredCategories.some((category) => category.name === form.category)) {
      setForm((current) => ({ ...current, category: filteredCategories[0].name }));
    }
  }, [filteredCategories, form.category]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.date) {
      setError('Tanggal wajib diisi.');
      return;
    }

    if (!['income', 'expense'].includes(form.type)) {
      setError('Tipe transaksi tidak valid.');
      return;
    }

    if (!form.category) {
      setError('Kategori wajib dipilih.');
      return;
    }

    if (!form.wallet) {
      setError('Dompet wajib dipilih.');
      return;
    }

    if (!Number(form.amount) || Number(form.amount) <= 0) {
      setError('Nominal harus lebih dari 0.');
      return;
    }

    await onSubmit({
      ...form,
      amount: Number(form.amount),
    });

    if (!editingTransaction) {
      setForm((current) => ({
        ...INITIAL_FORM,
        wallet: current.wallet,
        category: filteredCategories[0]?.name || '',
      }));
    }
  }

  return (
    <form className="panel p-4" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {form.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ke {form.wallet || '-'}
          </p>
        </div>
        {editingTransaction && (
          <button
            type="button"
            className="icon-button"
            onClick={onCancelEdit}
            title="Batal edit"
            aria-label="Batal edit"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1">
        {[
          { value: 'expense', label: 'Keluar' },
          { value: 'income', label: 'Masuk' },
        ].map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => updateField('type', type.value)}
            className={`min-h-10 rounded px-3 text-sm font-semibold transition ${
              form.type === type.value ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="transaction-date">Tanggal</label>
          <input
            id="transaction-date"
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="transaction-amount">Nominal</label>
          <input
            id="transaction-amount"
            type="number"
            min="0"
            inputMode="decimal"
            value={form.amount}
            onChange={(event) => updateField('amount', event.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="transaction-category">Kategori</label>
          <select
            id="transaction-category"
            value={form.category}
            onChange={(event) => updateField('category', event.target.value)}
          >
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="transaction-wallet">Dompet</label>
          <select
            id="transaction-wallet"
            value={form.wallet}
            onChange={(event) => updateField('wallet', event.target.value)}
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.name}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="transaction-note">Catatan</label>
          <textarea
            id="transaction-note"
            rows="3"
            value={form.note}
            onChange={(event) => updateField('note', event.target.value)}
            placeholder="Opsional"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {editingTransaction ? (
          <Save className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Plus className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{editingTransaction ? 'Simpan Transaksi' : 'Tambah Transaksi'}</span>
      </button>
    </form>
  );
}
