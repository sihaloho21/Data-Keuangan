export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getTodayInputValue() {
  const now = new Date();
  return toDateInputValue(now);
}

export function toDateInputValue(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return getTodayInputValue();
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function formatDate(value) {
  if (!value) return '-';
  const raw = String(value);
  const date = raw.match(/^\d{4}-\d{2}-\d{2}/)
    ? new Date(`${raw.slice(0, 10)}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatMonth(month) {
  if (!month) return '-';
  const date = new Date(`${month}-01T00:00:00`);

  if (Number.isNaN(date.getTime())) return month;

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getMonthKey(value) {
  if (!value) return getCurrentMonth();
  const raw = String(value);

  if (/^\d{4}-\d{2}/.test(raw)) {
    return raw.slice(0, 7);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getCurrentMonth();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getRecentMonths(count = 6) {
  const months = [];
  const cursor = new Date();

  for (let index = 0; index < count; index += 1) {
    months.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return months.reverse();
}

export function dateInMonth(month, day) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(year, monthNumber - 1, day);
  return toDateInputValue(date);
}
