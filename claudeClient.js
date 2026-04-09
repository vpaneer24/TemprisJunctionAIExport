export async function askAI(userMessage, context) {
  const useMock = String(import.meta.env.VITE_USE_MOCK_AI || "true") === "true";
  if (useMock) return mockResponse(context);

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing Anthropic API key");

  const systemPrompt = `
You are JUNCTION AI — a finance, HR and compliance advisor for a Singapore SME.
Be concise and executive-ready.
Always highlight risks first, then recommendations.
Company data:
- Company: ${context.companyName}
- Headcount: ${context.headcount}
- Payroll: SGD ${context.payroll}
- Burn rate: SGD ${context.burnRate}/mo
- Runway: ${context.runway} months
- Compliance alerts: ${context.complianceAlerts}
- Net position: SGD ${context.netPosition}
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic error: ${text}`);
  }

  const data = await response.json();
  return data?.content?.[0]?.text || "No response returned.";
}

function mockResponse(context) {
  return [
    `• Headcount: ${context.headcount} active staff`,
    `• Monthly payroll: SGD ${context.payroll}`,
    `• Burn rate: SGD ${context.burnRate}/month`,
    `• Runway: ${context.runway} months`,
    `• Compliance risk: ${context.complianceAlerts}`,
    `Recommendation: Confirm CPF submission and review discretionary spend this week.`
  ].join("\n");
}
