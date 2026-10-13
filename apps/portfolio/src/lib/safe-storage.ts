// Web Storage can be missing or throw (blocked cookies, private mode, sandboxed
// iframes). Preferences are conveniences, so failures fall back silently.
type StorageArea = "local" | "session";

function getStorage(area: StorageArea): Storage | null {
  try {
    return area === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage(key: string, area: StorageArea = "local"): string | null {
  try {
    return getStorage(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, area: StorageArea = "local") {
  try {
    getStorage(area)?.setItem(key, value);
  } catch {
    // Ignore quota and access errors.
  }
}

export function removeStorage(key: string, area: StorageArea = "local") {
  try {
    getStorage(area)?.removeItem(key);
  } catch {
    // Ignore access errors.
  }
}
