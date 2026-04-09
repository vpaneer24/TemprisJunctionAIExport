export const money = (n) =>
  new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", maximumFractionDigits: 2 }).format(Number(n || 0));

export const round2 = (n) => Math.round(Number(n || 0) * 100) / 100;
export const uniqueId = () => crypto?.randomUUID?.() || String(Date.now() + Math.random());

export const monthLabel = (yyyymm) => {
  if (!yyyymm) return "-";
  const [y, m] = yyyymm.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-SG", { month: "long", year: "numeric" });
};
