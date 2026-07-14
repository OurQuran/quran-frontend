import { IEdition } from "@/types/generalTypes";

export const TAJWEED_EDITION_IDENTIFIER = "tajweed-uthmani";
export const LEGACY_TAJWEED_EDITION_IDENTIFIER = "quran-tajweed";
export const TAJWEED_EDITION_IDENTIFIERS = [
  TAJWEED_EDITION_IDENTIFIER,
  LEGACY_TAJWEED_EDITION_IDENTIFIER,
] as const;
export const TAJWEED_DEFAULT_QIRAAT_ID = 1;

export type TajweedLegendItem = {
  code: string;
  label: string;
  description: string;
  compactLabel?: string;
};

export const TAJWEED_LEGEND: TajweedLegendItem[] = [
  { code: "h", label: "Hamzat al-Wasl", description: "Connecting alif.", compactLabel: "Silent letter" },
  { code: "l", label: "Lam Shamsiyyah", description: "Assimilated lam.", compactLabel: "Silent letter" },
  { code: "n", label: "Normal Madd", description: "Natural two-count elongation.", compactLabel: "Normal madd" },
  { code: "p", label: "Permissible Madd", description: "Separated elongation of 2, 4, or 6 counts.", compactLabel: "Separated madd" },
  { code: "o", label: "Obligatory Madd", description: "Connected elongation of 4 or 5 counts.", compactLabel: "Connected madd" },
  { code: "m", label: "Necessary Madd", description: "Required six-count elongation.", compactLabel: "Necessary madd" },
  { code: "q", label: "Qalqalah", description: "Echoing consonant.", compactLabel: "Qalqalah" },
  { code: "t", label: "Tafkhim", description: "Heavy/emphatic pronunciation.", compactLabel: "Tafkhim" },
  { code: "g", label: "Ghunnah", description: "Two-count nasal sound.", compactLabel: "Ghunnah" },
  { code: "i", label: "Iqlab", description: "Noon or tanween changes before ba.", compactLabel: "Iqlab" },
  { code: "f", label: "Ikhfa", description: "Concealed noon or tanween.", compactLabel: "Ikhfa" },
  { code: "c", label: "Ikhfa Shafawi", description: "Concealed meem before ba." },
  { code: "w", label: "Idgham Shafawi", description: "Meem merges into meem." },
  { code: "a", label: "Idgham with Ghunnah", description: "Merge with nasalization.", compactLabel: "Idgham with ghunnah" },
  { code: "u", label: "Idgham without Ghunnah", description: "Merge without nasalization.", compactLabel: "Idgham without ghunnah" },
  { code: "d", label: "Idgham Mutajanisayn", description: "Merge of same articulation family." },
  { code: "b", label: "Idgham Mutaqaribayn", description: "Merge of close letters." },
  { code: "s", label: "Silent", description: "Silent letter or no-vowel hold.", compactLabel: "Silent letter" },
];

export const TAJWEED_PRIMARY_CODES = [
  "s",
  "n",
  "p",
  "o",
  "m",
  "q",
  "t",
  "g",
  "a",
  "i",
  "f",
  "u",
] as const;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const YEH_MADD_CODES = new Set(["n", "p", "o", "m"]);
const ARABIC_MARKS_PATTERN = "[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]";
const loadedQcfTajweedPages = new Set<number>();

export function ensureQcfTajweedFonts(pages: Array<number | null | undefined>): void {
  if (typeof document === "undefined") {
    return;
  }

  pages.forEach((page) => {
    if (!page || loadedQcfTajweedPages.has(page)) {
      return;
    }

    const fontName = `qcf-tajweed-p${page}`;
    const style = document.createElement("style");
    style.setAttribute("data-qcf-tajweed-page", `${page}`);
    style.textContent = `
@font-face {
  font-family: "${fontName}";
  src: url("/fonts/quran/hafs/v4/colrv1/woff2/p${page}.woff2") format("woff2");
  font-display: swap;
}
@font-palette-values --qcf-tajweed-dark-p${page} {
  font-family: "${fontName}";
  base-palette: 0;
  override-colors: 0 #f4efe7;
}
.qcf-tajweed-p${page} {
  font-family: "${fontName}", var(--font-quran-4), serif;
}
.dark .qcf-tajweed-p${page} {
  font-palette: --qcf-tajweed-dark-p${page};
}
`;

    document.head.appendChild(style);
    loadedQcfTajweedPages.add(page);
  });
}

function renderTajweedMarker(code: string, text: string): string {
  const normalizedCode = code.toLowerCase();
  const className = `tajweed-mark tajweed-${normalizedCode}`;

  if (YEH_MADD_CODES.has(normalizedCode)) {
    const yehMatch = text.match(
      new RegExp(`^(${ARABIC_MARKS_PATTERN}*)([\\u0627\\u0648\\u064A\\u0649]${ARABIC_MARKS_PATTERN}*)$`, "u"),
    );

    if (yehMatch) {
      return `${yehMatch[1]}<span class="${className}">${yehMatch[2]}</span>`;
    }
  }

  return `<span class="${className}">${text}</span>`;
}

function renderPlainTajweedText(text: string): string {
  if (!text) return "";

  return `<span class="tajweed-plain">${text}</span>`;
}

function splitTajweedWords(raw: string): string[] {
  return raw.trim().split(/\s+/).filter(Boolean);
}

function renderTajweedWordTemplate(tajweedText: string, wordTemplate: string): string | null {
  const tajweedWords = splitTajweedWords(tajweedText);
  if (!tajweedWords.length || !/<span\b/i.test(wordTemplate)) {
    return null;
  }

  let wordIndex = 0;
  const rendered = wordTemplate.replace(
    /<span\b([^>]*)>([\s\S]*?)<\/span>/gi,
    (fullMatch, attributes: string, content: string) => {
      if (!/\bid\s*=/i.test(attributes)) {
        return fullMatch;
      }

      const tajweedWord = tajweedWords[wordIndex];
      if (!tajweedWord) {
        return fullMatch;
      }

      wordIndex += 1;

      return `<span${attributes}>${renderTajweedText(tajweedWord)}</span>`;
    },
  );

  return wordIndex > 0 ? rendered : null;
}

export function isTajweedEdition(edition?: IEdition | null): boolean {
  if (!edition) return false;

  return TAJWEED_EDITION_IDENTIFIERS.includes(
    edition.identifier as (typeof TAJWEED_EDITION_IDENTIFIERS)[number],
  );
}

export function findTajweedEdition(
  editions: IEdition[] | undefined,
): IEdition | null {
  return (
    editions?.find((edition) => edition.identifier === TAJWEED_EDITION_IDENTIFIER) ??
    editions?.find((edition) => edition.identifier === LEGACY_TAJWEED_EDITION_IDENTIFIER) ??
    null
  );
}

export function canRenderTajweedForQiraat(
  edition: IEdition | null | undefined,
  qiraatReadingId: number | undefined,
): boolean {
  if (!isTajweedEdition(edition)) return false;
  if (!edition?.qiraat_reading_id) return qiraatReadingId === TAJWEED_DEFAULT_QIRAAT_ID;

  return edition.qiraat_reading_id === qiraatReadingId;
}

export function renderTajweedText(raw: string, wordTemplate?: string): string {
  if (wordTemplate) {
    const renderedTemplate = renderTajweedWordTemplate(raw, wordTemplate);
    if (renderedTemplate) {
      return renderedTemplate;
    }
  }

  const escaped = escapeHtml(raw);
  const markerPattern = /\[([a-z]+)(?::\d+)?\[([^\]]+)\]/gi;
  let html = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = markerPattern.exec(escaped)) !== null) {
    html += renderPlainTajweedText(escaped.slice(cursor, match.index));
    html += renderTajweedMarker(match[1], match[2]);
    cursor = match.index + match[0].length;
  }

  html += renderPlainTajweedText(escaped.slice(cursor));

  return html;
}
