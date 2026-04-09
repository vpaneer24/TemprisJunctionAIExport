import { uniqueId } from "./helpers";

export function appendAudit(getValue, saveValue, action, module, detail) {
  const current = getValue();
  const next = [{
    id: uniqueId(),
    timestamp: new Date().toISOString(),
    action,
    module,
    detail,
    sessionId: sessionStorage.getItem("junction_session_id") || bootstrapSession(),
  }, ...(current || [])];
  saveValue(next);
}

function bootstrapSession() {
  const id = uniqueId();
  sessionStorage.setItem("junction_session_id", id);
  return id;
}
