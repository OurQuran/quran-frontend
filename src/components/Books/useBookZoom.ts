import { useSyncExternalStore } from "react";

// Reader zoom for the book viewer, shared by every book and kept in localStorage.
export const BOOK_ZOOM_MIN = 60;
export const BOOK_ZOOM_MAX = 220;
export const BOOK_ZOOM_STEP = 10;
export const BOOK_ZOOM_DEFAULT = 100;

const KEY = "book-zoom";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

const clamp = (value: number) =>
  Math.min(BOOK_ZOOM_MAX, Math.max(BOOK_ZOOM_MIN, value));

export function useBookZoom() {
  // null on the server and during hydration, then the stored value (no hydration mismatch)
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const parsed = raw === null ? NaN : parseInt(raw);
  const zoom = Number.isFinite(parsed) ? clamp(parsed) : BOOK_ZOOM_DEFAULT;

  const setZoom = (value: number) => {
    try {
      localStorage.setItem(KEY, String(clamp(value)));
    } catch {
      // storage unavailable: zoom just will not persist
    }
    listeners.forEach((listener) => listener());
  };

  return { zoom, setZoom };
}
