import { dateInMonth, getCurrentMonth } from '../utils/date';

export const DEFAULT_CATEGORIES = [
  { id: 'CAT-001', name: 'Gaji', type: 'income', icon: 'briefcase', color: '#047857' },
  { id: 'CAT-002', name: 'Bonus', type: 'income', icon: 'gift', color: '#0369a1' },
  { id: 'CAT-003', name: 'Penjualan', type: 'income', icon: 'store', color: '#7c3aed' },
  { id: 'CAT-004', name: 'Makanan', type: 'expense', icon: 'utensils', color: '#dc2626' },
  { id: 'CAT-005', name: 'Transportasi', type: 'expense', icon: 'car', color: '#ea580c' },
  { id: 'CAT-006', name: 'Tagihan', type: 'expense', icon: 'receipt', color: '#475569' },
  { id: 'CAT-007', name: 'Belanja', type: 'expense', icon: 'shopping-bag', color: '#db2777' },
  { id: 'CAT-008', name: 'Kesehatan', type: 'expense', icon: 'heart-pulse', color: '#0891b2' },
  { id: 'CAT-009', name: 'Pendidikan', type: 'expense', icon: 'book-open', color: '#ca8a04' },
  { id: 'CAT-010', name: 'Lainnya', type: 'expense', icon: 'circle-dot', color: '#64748b' },
];

export const DEFAULT_WALLETS = [
  { id: 'WAL-001', name: 'Cash', initial_balance: 350000, note: 'Uang tunai harian' },
  { id: 'WAL-002', name: 'Bank', initial_balance: 2500000, note: 'Rekening utama' },
  { id: 'WAL-003', name: 'E-Wallet', initial_balance: 275000, note: 'Dompet digital' },
];

export function createDefaultState() {
  const month = getCurrentMonth();
  const lastMonth = shiftMonth(month, -1);

  return {
    settings: {
      app_name: 'Data Keuangan',
      currency: 'IDR',
      default_wallet: 'Cash',
    },
    categories: DEFAULT_CATEGORIES,
    wallets: DEFAULT_WALLETS,
    budgets: [
      {
        id: 'BUD-001',
        month,
        category: 'Makanan',
        limit_amount: 1200000,
        created_at: `${month}-01T08:00:00.000Z`,
      },
      {
        id: 'BUD-002',
        month,
        category: 'Transportasi',
        limit_amount: 650000,
        created_at: `${month}-01T08:00:00.000Z`,
      },
      {
        id: 'BUD-003',
        month,
        category: 'Belanja',
        limit_amount: 900000,
        created_at: `${month}-01T08:00:00.000Z`,
      },
    ],
    transactions: [
      {
        id: 'TRX-001',
        date: dateInMonth(month, 1),
        type: 'income',
        category: 'Gaji',
        amount: 5200000,
        wallet: 'Bank',
        note: 'Gaji bulanan',
        created_at: `${month}-01T08:00:00.000Z`,
        updated_at: `${month}-01T08:00:00.000Z`,
      },
      {
        id: 'TRX-002',
        date: dateInMonth(month, 2),
        type: 'expense',
        category: 'Makanan',
        amount: 48000,
        wallet: 'Cash',
        note: 'Makan siang',
        created_at: `${month}-02T05:30:00.000Z`,
        updated_at: `${month}-02T05:30:00.000Z`,
      },
      {
        id: 'TRX-003',
        date: dateInMonth(month, 3),
        type: 'expense',
        category: 'Transportasi',
        amount: 62000,
        wallet: 'E-Wallet',
        note: 'Transport kerja',
        created_at: `${month}-03T10:00:00.000Z`,
        updated_at: `${month}-03T10:00:00.000Z`,
      },
      {
        id: 'TRX-004',
        date: dateInMonth(month, 5),
        type: 'expense',
        category: 'Tagihan',
        amount: 410000,
        wallet: 'Bank',
        note: 'Internet dan listrik',
        created_at: `${month}-05T09:15:00.000Z`,
        updated_at: `${month}-05T09:15:00.000Z`,
      },
      {
        id: 'TRX-005',
        date: dateInMonth(month, 9),
        type: 'income',
        category: 'Penjualan',
        amount: 725000,
        wallet: 'E-Wallet',
        note: 'Penjualan online',
        created_at: `${month}-09T12:40:00.000Z`,
        updated_at: `${month}-09T12:40:00.000Z`,
      },
      {
        id: 'TRX-006',
        date: dateInMonth(month, 12),
        type: 'expense',
        category: 'Belanja',
        amount: 325000,
        wallet: 'Bank',
        note: 'Kebutuhan rumah',
        created_at: `${month}-12T11:00:00.000Z`,
        updated_at: `${month}-12T11:00:00.000Z`,
      },
      {
        id: 'TRX-007',
        date: dateInMonth(lastMonth, 24),
        type: 'expense',
        category: 'Kesehatan',
        amount: 185000,
        wallet: 'Cash',
        note: 'Obat dan vitamin',
        created_at: `${lastMonth}-24T08:00:00.000Z`,
        updated_at: `${lastMonth}-24T08:00:00.000Z`,
      },
      {
        id: 'TRX-008',
        date: dateInMonth(lastMonth, 28),
        type: 'income',
        category: 'Bonus',
        amount: 800000,
        wallet: 'Bank',
        note: 'Bonus proyek',
        created_at: `${lastMonth}-28T08:00:00.000Z`,
        updated_at: `${lastMonth}-28T08:00:00.000Z`,
      },
    ],
    goals: [],
  };
}

function shiftMonth(month, offset) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(year, monthNumber - 1 + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
