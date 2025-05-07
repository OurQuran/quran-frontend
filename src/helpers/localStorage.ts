export function getLang(): string {
  return localStorage.getItem("lang") || "en";
}

export function setLang(newLang: string): void {
  localStorage.setItem("lang", newLang);
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string {
  return localStorage.getItem("token") || "";
}

export function destroyToken() {
  localStorage.removeItem("token");
}

export function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key: string) {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
}
