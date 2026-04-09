import { useMemo, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const getStored = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(getStored);

  const save = (nextValue) => {
    const resolved = typeof nextValue === "function" ? nextValue(getStored()) : nextValue;
    setValue(resolved);
    localStorage.setItem(key, JSON.stringify(resolved));
  };

  const api = useMemo(() => ({ value, save, get: getStored }), [value]);
  return api;
}
