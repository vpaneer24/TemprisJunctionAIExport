const currentYear = new Date().getFullYear();

function monthDeadlines() {
  return Array.from({ length: 12 }, (_, idx) => ({
    id: `cpf-${idx + 1}`,
    date: `${currentYear}-${String(idx + 1).padStart(2, "0")}-14`,
    obligation: "CPF submission",
    authority: "CPF Board",
  }));
}

export function getComplianceItems() {
  return [
    ...monthDeadlines(),
    { id: "ir8a", date: `${currentYear}-03-01`, obligation: "IR8A / AIS filing", authority: "IRAS" },
    { id: "tax", date: `${currentYear}-04-30`, obligation: "Corporate tax filing", authority: "IRAS" },
    { id: "gst1", date: `${currentYear}-03-31`, obligation: "GST F5 quarterly filing", authority: "IRAS" },
    { id: "gst2", date: `${currentYear}-06-30`, obligation: "GST F5 quarterly filing", authority: "IRAS" },
    { id: "gst3", date: `${currentYear}-09-30`, obligation: "GST F5 quarterly filing", authority: "IRAS" },
    { id: "gst4", date: `${currentYear}-12-31`, obligation: "GST F5 quarterly filing", authority: "IRAS" },
    { id: "acra", date: `${currentYear}-07-31`, obligation: "Annual returns (example FYE)", authority: "ACRA" },
  ];
}

export function getComplianceStatus(dateString, done = false) {
  if (done) return "DONE";
  const now = new Date();
  now.setHours(0,0,0,0);
  const due = new Date(dateString);
  const ms = due - now;
  const daysUntil = Math.floor(ms / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return "OVERDUE";
  if (daysUntil <= 14) return "DUE SOON";
  if (daysUntil <= 60) return "UPCOMING";
  return "FUTURE";
}
