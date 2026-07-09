import { IEdition } from "@/types/generalTypes";

export const TAJWEED_EDITION_IDENTIFIER = "quran-tajweed";
export const TAJWEED_DEFAULT_QIRAAT_ID = 1;

export type TajweedLegendItem = {
  code: string;
  label: string;
  description: string;
  compactLabel?: string;
};

export const TAJWEED_LEGEND: TajweedLegendItem[] = [
  { code: "h", label: "Hamzat al-Wasl", description: "Connecting alif." },
  { code: "l", label: "Lam Shamsiyyah", description: "Assimilated lam." },
  { code: "n", label: "Natural Madd", description: "Light natural elongation.", compactLabel: "Normal madd" },
  { code: "p", label: "Madd", description: "Basic elongation." },
  { code: "o", label: "Madd with Hamza", description: "Extended madd before or with hamza.", compactLabel: "Separated madd" },
  { code: "m", label: "Necessary Madd", description: "Heavy required elongation.", compactLabel: "Necessary madd" },
  { code: "q", label: "Qalqalah", description: "Echoing consonant.", compactLabel: "Qalqalah" },
  { code: "g", label: "Ghunnah", description: "Nasal sound.", compactLabel: "Ghunnah/ikhfa'" },
  { code: "i", label: "Iqlab", description: "Noon/tanween changes before ba." },
  { code: "f", label: "Ikhfa", description: "Concealed noon/tanween." },
  { code: "c", label: "Ikhfa Shafawi", description: "Concealed meem before ba." },
  { code: "w", label: "Idgham Shafawi", description: "Meem merges into meem." },
  { code: "a", label: "Idgham with Ghunnah", description: "Merge with nasalization.", compactLabel: "Connected madd" },
  { code: "u", label: "Idgham Mutamathilayn", description: "Merge of matching letters." },
  { code: "d", label: "Idgham Mutajanisayn", description: "Merge of same articulation family." },
  { code: "b", label: "Idgham Mutaqaribayn", description: "Merge of close letters." },
  { code: "s", label: "Silent", description: "Silent letter or no-vowel hold.", compactLabel: "Silent letter" },
];

export const TAJWEED_PRIMARY_CODES = [
  "n",
  "m",
  "o",
  "q",
  "g",
  "i",
  "f",
  "a",
] as const;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function isTajweedEdition(edition?: IEdition | null): boolean {
  if (!edition) return false;

  return edition.identifier === TAJWEED_EDITION_IDENTIFIER;
}

export function findTajweedEdition(
  editions: IEdition[] | undefined,
): IEdition | null {
  return editions?.find((edition) => isTajweedEdition(edition)) ?? null;
}

export function canRenderTajweedForQiraat(
  edition: IEdition | null | undefined,
  qiraatReadingId: number | undefined,
): boolean {
  if (!isTajweedEdition(edition)) return false;
  if (!edition?.qiraat_reading_id) return qiraatReadingId === TAJWEED_DEFAULT_QIRAAT_ID;

  return edition.qiraat_reading_id === qiraatReadingId;
}

export function renderTajweedText(raw: string): string {
  const escaped = escapeHtml(raw);

  return escaped.replace(
    /\[([a-z]+)(?::\d+)?\[([^\]]+)\]/gi,
    (_, code: string, text: string) =>
      `<span class="tajweed-mark tajweed-${code.toLowerCase()}">${text}</span>`,
  );
}
