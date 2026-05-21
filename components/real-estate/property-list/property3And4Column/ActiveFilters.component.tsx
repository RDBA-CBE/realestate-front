import { X } from "lucide-react";
import { getPriceLabel } from "@/utils/function.utils";
import { priceOptions, sqftOptions } from "@/utils/constant.utils";

interface ActiveFiltersProps {
  state: any;
  handleChange: (name: string, value: any) => void;
  resetFilter: () => void;
  onClearPrice: () => void;
  onClearSqft: () => void;
}

export function ActiveFilters({ state, handleChange, resetFilter, onClearPrice, onClearSqft }: ActiveFiltersProps) {
  const badges: { label: string; onRemove: () => void }[] = [];

  if (state.search) {
    badges.push({ label: `Search: ${state.search}`, onRemove: () => handleChange("search", "") });
  }

  if (state.listingStatus && state.listingStatus !== "All" && state.listingStatus !== "") {
    badges.push({ label: state.listingStatus, onRemove: () => handleChange("listingStatus", "All") });
  }

  (state.propertyType || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("propertyType", state.propertyType.filter((t: any) => t.value !== item.value)) })
  );

  (state.location || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("location", state.location.filter((t: any) => t.value !== item.value)) })
  );

  (state.area || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("area", state.area.filter((t: any) => t.value !== item.value)) })
  );

  (state.developer || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("developer", state.developer.filter((t: any) => t.value !== item.value)) })
  );

  (state.project || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("project", state.project.filter((t: any) => t.value !== item.value)) })
  );

  (state.floorPlan || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("floorPlan", state.floorPlan.filter((t: any) => t.value !== item.value)) })
  );

  (state.furnishing || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => handleChange("furnishing", []) })
  );

  if (state.bedrooms && state.bedrooms !== "Any") {
    badges.push({ label: `${state.bedrooms} Beds`, onRemove: () => handleChange("bedrooms", "") });
  }

  if (state.bathrooms && state.bathrooms !== "Any" && state.bathrooms !== "") {
    badges.push({ label: `${state.bathrooms} Baths`, onRemove: () => handleChange("bathrooms", "") });
  }

  if (state.priceMinInput || state.priceMaxInput) {
    const minLabel = state.priceMinInput ? getPriceLabel(state.priceMinInput, priceOptions) : "No min";
    const maxLabel = state.priceMaxInput ? getPriceLabel(state.priceMaxInput, priceOptions) : "No max";
    badges.push({ label: ` ${minLabel} – ${maxLabel}`, onRemove: onClearPrice });
  }

  if (state.sqftMin || state.sqftMax) {
    const minLabel = state.sqftMin ? getPriceLabel(state.sqftMin, sqftOptions) : "No min";
    const maxLabel = state.sqftMax ? getPriceLabel(state.sqftMax, sqftOptions) : "No max";
    badges.push({ label: `${minLabel} – ${maxLabel} sqft`, onRemove: onClearSqft });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 !mt-5 pt-0">
      {badges.map((badge, i) => (
        <span
          key={i}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border text-dred text-[12px] font-medium"
        >
          {badge.label}
          <button onClick={badge.onRemove} className="ml-1 hover:text-red-800">
            <X size={13} />
          </button>
        </span>
      ))}
      <button
        onClick={resetFilter}
        className="text-sm text-gray-500 underline hover:text-gray-700 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
