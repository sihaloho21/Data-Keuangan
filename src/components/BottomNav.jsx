import { LayoutDashboard, PieChart, ReceiptText, Settings, Target } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: ReceiptText },
  { id: 'budgets', label: 'Budget', icon: Target },
  { id: 'reports', label: 'Laporan', icon: PieChart },
  { id: 'settings', label: 'Setting', icon: Settings },
];

export function DesktopNav({ activePage, onChange }) {
  return (
    <nav className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 md:block">
      <div className="mb-6 px-2">
        <p className="text-sm font-semibold text-slate-500">Data Keuangan</p>
        <p className="mt-1 text-xl font-bold text-slate-950">Finance Tracker</p>
      </div>
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                active
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function BottomNav({ activePage, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden">
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-semibold ${
                active ? 'text-slate-950' : 'text-slate-500'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
