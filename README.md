# Tempris Junction AI - CSV Import Upgrade

This version adds CSV import for:
- Employees
- Finance ledger
- Payroll history
- Settings

## Run
```bash
npm install
cp .env.example .env
npm run dev
```

## CSV Import
Go to **IMPORT** in the sidebar and upload CSV files.

Included templates:
- `/templates/employees_template.csv`
- `/templates/finance_template.csv`
- `/templates/payroll_template.csv`
- `/templates/settings_template.csv`

## Required columns

### employees
id,name,title,department,employmentType,startDate,salary,ageBracket,status,notes

### finance
id,month,category,amount,type,notes

### payroll
id,month,headcount,gross,employeeCPF,employerCPF,netPay,totalCost,status,createdAt

### settings
companyName,cashBalance,gstRegistered,financialYearEnd,defaultPayrollMonth

## Notes
- Import replaces the selected dataset.
- The app still uses localStorage for persistence.
- For real production, move storage and import validation to a backend.
