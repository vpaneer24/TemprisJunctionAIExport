export const CPF_CEILING = 6800;

export const CPF_RATES = {
  below55: { employee: 0.20, employer: 0.17, label: "Below 55" },
  "55to60": { employee: 0.15, employer: 0.15, label: "55 to 60" },
  "60to65": { employee: 0.095, employer: 0.115, label: "60 to 65" },
  above65: { employee: 0.07, employer: 0.09, label: "Above 65" },
};

export const DEPARTMENTS = ["Engineering","Cybersecurity","Sales","Marketing","Finance","HR","Product","Leadership"];
export const EMPLOYMENT_TYPES = ["Full-time","Part-time","Contract","Intern"];
export const STATUSES = ["Active","On Leave","Probation","Notice","Resigned"];
