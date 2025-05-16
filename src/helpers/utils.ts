import { toast } from "sonner";

export function getTextDirection(text: string): "rtl" | "ltr" {
  const rtlChars = /[\u0590-\u08FF]/;
  return rtlChars.test(text) ? "rtl" : "ltr";
}

export function uniqueId(): string {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
}

export function extractSpansWithAttributes(text: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const spans = Array.from(doc.querySelectorAll("span"));
  return spans.map((span) => span.outerHTML).join(" ");
}
export function onError(message: string) {
  toast.error(message);
}
export function onSuccess(message: string) {
  toast.success(message);
}
export function formatDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  const hours: string = String(date.getHours()).padStart(2, "0");
  const minutes: string = String(date.getMinutes()).padStart(2, "0");
  const seconds: string = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatStringDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
}

export const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Tags",
    href: "/tags",
  },
  {
    label: "Advaced Search",
    href: "/advanced-search",
  },
];
