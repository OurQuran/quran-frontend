import Cookies from "js-cookie";

const isBrowser = typeof window !== "undefined";

export function getLang(): string {
  if (!isBrowser) return "en";
  return localStorage.getItem("lang") || "en";
}

export function setLang(newLang: string): void {
  if (isBrowser) {
    localStorage.setItem("lang", newLang);
  }
}

export function saveToken(token: string) {
  if (isBrowser) {
    Cookies.set("token", token, { expires: 30, path: "/" }); // 30 days
  }
}

export function getToken(): string {
  if (!isBrowser) return "";
  return Cookies.get("token") || "";
}

export function destroyToken() {
  if (isBrowser) {
    Cookies.remove("token", { path: "/" });
  }
}

export function setItem(key: string, value: any) {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getItem(key: string) {
  if (!isBrowser) return null;
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}

export function removeItem(key: string) {
  if (isBrowser) {
    localStorage.removeItem(key);
  }
}
