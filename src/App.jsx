import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import BottomNav, { DesktopNav } from './components/BottomNav';
import Budgets from './pages/Budgets';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import { financeApi } from './api/financeApi';
import { buildMonthlyTrend, buildSummary, buildWalletBalances } from './utils/calculations';
import { getCurrentMonth } from './utils/date';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [month, setMonth] = useState(getCurrentMonth());
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState({
    app_name: 'Data Keuangan',
    currency: 'IDR',
    default_wallet: 'Cash',
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const sourceInfo = financeApi.getSourceInfo();

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const [transactionResult, categoryResult, walletResult, budgetResult, settingsResult] =
        await Promise.all([
          financeApi.getAllTransactions(),
          financeApi.getCategories(),
          financeApi.getWallets(),
          financeApi.getBudgets(),
          financeApi.getSettings(),
        ]);

      setTransactions(transactionResult.data || []);
      setCategories(categoryResult.data || []);
      setWallets(walletResult.data || []);
      setBudgets(budgetResult.data || []);
      setSettings(settingsResult.data || settings);
    } catch (caughtError) {
      setError(caughtError.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const summary = useMemo(() => buildSummary(transactions, month, budgets), [transactions, month, budgets]);
  const walletBalances = useMemo(
    () => buildWalletBalances(transactions, wallets),
    [transactions, wallets],
  );
  const trend = useMemo(() => buildMonthlyTrend(transactions, 6), [transactions]);

  async function mutate(action, successMessage) {
    setBusy(true);
    setError('');

    try {
      await action();
      await loadData({ silent: true });
      setNotice(successMessage);
    } catch (caughtError) {
      setError(caughtError.message || 'Perubahan gagal disimpan.');
    } finally {
      setBusy(false);
    }
  }

  const pageProps = {
    month,
    onMonthChange: setMonth,
    transactions,
    categories,
    wallets,
    walletBalances,
    budgets,
    settings,
    summary,
    trend,
    currency: settings.currency,
    sourceInfo,
    busy,
  };

  function renderPage() {
    if (loading) {
      return (
        <div className="panel flex min-h-64 items-center justify-center p-6 text-sm font-medium text-slate-500">
          Memuat data keuangan...
        </div>
      );
    }

    if (activePage === 'transactions') {
      return (
        <Transactions
          {...pageProps}
          onAddTransaction={(data) =>
            mutate(() => financeApi.addTransaction(data), 'Transaksi ditambahkan.')
          }
          onUpdateTransaction={(data) =>
            mutate(() => financeApi.updateTransaction(data), 'Transaksi diperbarui.')
          }
          onDeleteTransaction={(id) =>
            mutate(() => financeApi.deleteTransaction(id), 'Transaksi dihapus.')
          }
        />
      );
    }

    if (activePage === 'budgets') {
      return (
        <Budgets
          {...pageProps}
          onSaveBudget={(data) => mutate(() => financeApi.addBudget(data), 'Budget disimpan.')}
        />
      );
    }

    if (activePage === 'reports') {
      return <Reports {...pageProps} />;
    }

    if (activePage === 'settings') {
      return (
        <Settings
          {...pageProps}
          onUpdateSettings={(data) =>
            mutate(() => financeApi.updateSettings(data), 'Setting disimpan.')
          }
          onAddCategory={(data) => mutate(() => financeApi.addCategory(data), 'Kategori ditambahkan.')}
          onAddWallet={(data) => mutate(() => financeApi.addWallet(data), 'Dompet ditambahkan.')}
          onResetDemoData={() => mutate(() => financeApi.resetDemoData(), 'Data demo dipulihkan.')}
        />
      );
    }

    return <Dashboard {...pageProps} />;
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <DesktopNav activePage={activePage} onChange={setActivePage} />

        <div className="min-w-0 flex-1 pb-24 md:pb-0">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-500">{settings.app_name}</p>
                <p className="truncate text-lg font-bold text-slate-950">Arus kas dan budget</p>
              </div>
              <span className="shrink-0 rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                {sourceInfo.label}
              </span>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-3 text-sm font-medium text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {notice && (
              <div className="mb-4 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{notice}</span>
              </div>
            )}

            {renderPage()}
          </main>
        </div>

        <BottomNav activePage={activePage} onChange={setActivePage} />
      </div>
    </div>
  );
}
