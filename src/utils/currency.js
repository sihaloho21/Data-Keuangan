const CURRENCY_LOCALES = {
  IDR: 'id-ID',
  USD: 'en-US',
  EUR: 'de-DE',
  SGD: 'en-SG',
};

export function formatCurrency(value, currency = 'IDR') {
  const normalizedCurrency = currency || 'IDR';
  const locale = CURRENCY_LOCALES[normalizedCurrency] || 'id-ID';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: normalizedCurrency,
    minimumFractionDigits: normalizedCurrency === 'IDR' ? 0 : 2,
    maximumFractionDigits: normalizedCurrency === 'IDR' ? 0 : 2,
  }).format(Number(value || 0));
}

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
