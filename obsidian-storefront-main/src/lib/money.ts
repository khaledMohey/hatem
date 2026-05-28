export function formatCurrency(value: number) {
  return `${value.toLocaleString("en-EG", { maximumFractionDigits: 2 })} L.E`;
}
