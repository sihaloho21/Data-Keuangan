import { useEffect, useState } from 'react';
import { Database, Plus, RotateCcw, Save, Wallet } from 'lucide-react';
import CategoryIcon from '../components/iconMap';
import PageHeader from '../components/PageHeader';
import { formatCurrency } from '../utils/currency';

const COLOR_SWATCHES = ['#047857', '#0369a1', '#dc2626', '#ea580c', '#db2777', '#7c3aed', '#475569'];

export default function Settings({
  settings,
  categories,
  wallets,
  walletBalances,
  sourceInfo,
  onUpdateSettings,
  onAddCategory,
  onAddWallet,
  onResetDemoData,
  busy,
}) {
  const [settingsForm, setSettingsForm] = useState(settings);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    type: 'expense',
    icon: 'circle-dot',
    color: COLOR_SWATCHES[0],
  });
  const [walletForm, setWalletForm] = useState({
    name: '',
    initial_balance: '',
    note: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  async function handleSettingsSubmit(event) {
    event.preventDefault();
    setError('');

    if (!settingsForm.app_name?.trim()) {
      setError('Nama aplikasi wajib diisi.');
      return;
    }

    await onUpdateSettings(settingsForm);
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setError('');

    if (!categoryForm.name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    await onAddCategory(categoryForm);
    setCategoryForm((current) => ({ ...current, name: '' }));
  }

  async function handleWalletSubmit(event) {
    event.preventDefault();
    setError('');

    if (!walletForm.name.trim()) {
      setError('Nama dompet wajib diisi.');
      return;
    }

    await onAddWallet({
      ...walletForm,
      initial_balance: Number(walletForm.initial_balance || 0),
    });
    setWalletForm({ name: '', initial_balance: '', note: '' });
  }

  async function handleReset() {
    const confirmed = window.confirm('Pulihkan data demo lokal?');
    if (!confirmed) return;
    await onResetDemoData();
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={sourceInfo.label} title="Setting" />

      {error && <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="panel p-4" onSubmit={handleSettingsSubmit}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Aplikasi</h2>
            <Database className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="app-name">Nama aplikasi</label>
              <input
                id="app-name"
                value={settingsForm.app_name || ''}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, app_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="currency">Mata uang</label>
              <select
                id="currency"
                value={settingsForm.currency || 'IDR'}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, currency: event.target.value }))
                }
              >
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="default-wallet">Dompet utama</label>
              <select
                id="default-wallet"
                value={settingsForm.default_wallet || wallets[0]?.name || ''}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, default_wallet: event.target.value }))
                }
              >
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.name}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Simpan Setting</span>
          </button>
          {sourceInfo.mode === 'local' && (
            <button
              type="button"
              onClick={handleReset}
              disabled={busy}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Reset Demo</span>
            </button>
          )}
        </form>

        <div className="space-y-4">
          <form className="panel p-4" onSubmit={handleCategorySubmit}>
            <h2 className="text-lg font-bold text-slate-950">Kategori</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Nama kategori"
                aria-label="Nama kategori"
              />
              <select
                value={categoryForm.type}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, type: event.target.value }))
                }
                aria-label="Tipe kategori"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCategoryForm((current) => ({ ...current, color }))}
                  className={`h-8 w-8 rounded-md border-2 ${
                    categoryForm.color === color ? 'border-slate-950' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Warna ${color}`}
                  aria-label={`Pilih warna ${color}`}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah Kategori</span>
            </button>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 px-3"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white"
                    style={{ backgroundColor: category.color || '#64748b' }}
                  >
                    <CategoryIcon icon={category.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{category.name}</p>
                    <p className="text-xs text-slate-500">
                      {category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </form>

          <form className="panel p-4" onSubmit={handleWalletSubmit}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Dompet</h2>
              <Wallet className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={walletForm.name}
                onChange={(event) => setWalletForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nama dompet"
                aria-label="Nama dompet"
              />
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={walletForm.initial_balance}
                onChange={(event) =>
                  setWalletForm((current) => ({ ...current, initial_balance: event.target.value }))
                }
                placeholder="Saldo awal"
                aria-label="Saldo awal"
              />
              <input
                value={walletForm.note}
                onChange={(event) => setWalletForm((current) => ({ ...current, note: event.target.value }))}
                placeholder="Catatan"
                aria-label="Catatan dompet"
                className="sm:col-span-2"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah Dompet</span>
            </button>
            <div className="mt-4 divide-y divide-slate-100">
              {walletBalances.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{wallet.name}</p>
                    <p className="truncate text-sm text-slate-500">{wallet.note || 'Sumber dana'}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {formatCurrency(wallet.balance, settings.currency)}
                  </p>
                </div>
              ))}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
