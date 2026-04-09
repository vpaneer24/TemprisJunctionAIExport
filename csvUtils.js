import { uniqueId } from "./helpers";

function splitCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  out.push(current);
  return out.map((cell) => cell.trim());
}

export function parseCsv(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    return row;
  });
}

export async function readCsvFile(file) {
  const text = await file.text();
  return parseCsv(text);
}

export function transformEmployees(rows) {
  return rows.map((r) => ({
    id: r.id || uniqueId(),
    name: r.name || "",
    title: r.title || "",
    department: r.department || "Engineering",
    employmentType: r.employmentType || "Full-time",
    startDate: r.startDate || "",
    salary: Number(r.salary || 0),
    ageBracket: r.ageBracket || "below55",
    status: r.status || "Active",
    notes: r.notes || "",
  }));
}

export function transformFinance(rows) {
  return rows.map((r) => ({
    id: r.id || uniqueId(),
    month: r.month || "",
    category: r.category || "Other",
    amount: Number(r.amount || 0),
    type: r.type || "Expense",
    notes: r.notes || "",
  }));
}

export function transformPayroll(rows) {
  return rows.map((r) => ({
    id: r.id || uniqueId(),
    month: r.month || "",
    headcount: Number(r.headcount || 0),
    rows: [],
    totals: {
      gross: Number(r.gross || 0),
      employeeCPF: Number(r.employeeCPF || 0),
      employerCPF: Number(r.employerCPF || 0),
      netPay: Number(r.netPay || 0),
      totalCost: Number(r.totalCost || 0),
    },
    status: r.status || "Confirmed",
    createdAt: r.createdAt || new Date().toISOString(),
    bonus: 0,
    deduction: 0,
  }));
}

export function transformSettings(rows) {
  const first = rows[0] || {};
  return {
    companyName: first.companyName || "Tempris Junction AI",
    cashBalance: Number(first.cashBalance || 0),
    gstRegistered: String(first.gstRegistered || "false").toLowerCase() === "true",
    financialYearEnd: first.financialYearEnd || "12-31",
    defaultPayrollMonth: first.defaultPayrollMonth || new Date().toISOString().slice(0, 7),
  };
}
