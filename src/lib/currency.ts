export const CURRENCIES = [
  { code: "USD", label: "USD — US Dollar", symbol: "$" },
  { code: "NGN", label: "NGN — Nigerian Naira", symbol: "₦" },
  { code: "GBP", label: "GBP — British Pound", symbol: "£" },
  { code: "EUR", label: "EUR — Euro", symbol: "€" },
  { code: "GHS", label: "GHS — Ghanaian Cedi", symbol: "GH₵" },
  { code: "KES", label: "KES — Kenyan Shilling", symbol: "KSh" },
  { code: "ZAR", label: "ZAR — South African Rand", symbol: "R" },
  { code: "CAD", label: "CAD — Canadian Dollar", symbol: "CA$" },
];

export function formatMoney(amount: number, currencyCode = "USD") {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;
  return `${symbol}${(amount || 0).toLocaleString()}`;
}
