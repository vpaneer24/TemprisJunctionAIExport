import { useState } from "react";
import { askAI } from "../api/claudeClient";

const quickPrompts = [
  "What's our burn rate and runway?",
  "Summarise this month's payroll",
  "Any compliance deadlines coming up?",
  "What financial risks should I know about?",
];

export default function JunctionAI({ context }) {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("JUNCTION AI ready. Ask for burn rate, payroll summary, or compliance risks.");
  const [loading, setLoading] = useState(false);

  const send = async (promptText) => {
    const prompt = promptText || message;
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await askAI(prompt, context);
      setAnswer(result);
      setMessage("");
    } catch (err) {
      setAnswer(`JUNCTION AI unavailable — ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="label">Junction AI</div>
      <div className="mt-2 text-sm text-soft">Import your real data first, then ask AI for live business insights.</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => <button key={prompt} className="btn-secondary" onClick={() => send(prompt)}>{prompt}</button>)}
      </div>
      <div className="mt-4 flex gap-3">
        <input className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask about payroll, burn, or compliance..." />
        <button className="btn-primary" onClick={() => send()}>{loading ? "Thinking..." : "Ask"}</button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white">{answer}</pre>
    </div>
  );
}
