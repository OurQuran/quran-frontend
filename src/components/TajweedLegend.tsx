import { TAJWEED_LEGEND, TAJWEED_PRIMARY_CODES } from "@/helpers/tajweed";

export default function TajweedLegend({
  compact = false,
}: {
  compact?: boolean;
}) {
  const items = compact
    ? TAJWEED_LEGEND.filter((item) =>
        TAJWEED_PRIMARY_CODES.includes(item.code as (typeof TAJWEED_PRIMARY_CODES)[number]),
      )
    : TAJWEED_LEGEND;

  return (
    <div
      className={`tajweed-legend ${compact ? "tajweed-legend-compact" : "flex flex-wrap items-center gap-2"}`}
    >
      {items.map((item) => (
        <div
          key={item.code}
          className={`tajweed-legend-item tajweed-${item.code} ${
            compact
              ? "tajweed-legend-item-compact"
              : "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px]"
          }`}
          title={item.description}
        >
          <span
            className={`tajweed-swatch tajweed-${item.code}`}
            aria-hidden="true"
          />
          <span className="tajweed-legend-label font-medium">
            {compact ? item.compactLabel || item.label : item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
