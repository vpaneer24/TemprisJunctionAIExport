const items = ["Dashboard","JOINFORCE","JUSTPAY","JOURNAL","JURIS","JUNCTION AI","IMPORT","JDOC","AUDIT"];

export default function Sidebar({ active, onSelect, alertCount }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/20 p-5 lg:block">
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-[0.3em] text-soft">Tempris</div>
        <div className="mt-1 text-2xl font-bold text-cyan">Junction AI</div>
        <div className="mt-2 text-sm text-soft">Agentic operating layer for HR, payroll, finance and compliance.</div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const activeState = active === item;
          return (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition ${
                activeState ? "bg-cyan text-black" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span>{item}</span>
              {item === "JURIS" && alertCount > 0 ? (
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeState ? "bg-black/20 text-black" : "bg-red-500/20 text-red-300"}`}>{alertCount}</span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
