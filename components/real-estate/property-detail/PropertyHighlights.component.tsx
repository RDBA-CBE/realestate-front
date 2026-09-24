"use client";

type HighlightItem = string | Record<string, unknown>;

interface PropertyHighlightsProps {
  data?: HighlightItem[];
}

const getHighlightText = (item: HighlightItem) => {
  if (typeof item === "string") return item.trim();

  const textValue = Object.values(item).find(
    (value) => typeof value === "string" && value.trim()
  );

  return typeof textValue === "string" ? textValue.trim() : "";
};

export default function PropertyHighlights({ data = [] }: PropertyHighlightsProps) {
  const highlights = data.map(getHighlightText).filter(Boolean);

  if (!highlights.length) return null;

  return (
    <div>
      <div className="mb-5">
        <h3 className="section-in-ti mb-1">Property Highlights</h3>
        <p className="mb-0 text-sm text-gray-500">
          Everything important is within easy reach.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((highlight, index) => (
          <div
            key={`${highlight}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors hover:border-dred/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1ef] text-xs font-semibold text-dred">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mb-0 text-sm font-medium text-gray-800">{highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}