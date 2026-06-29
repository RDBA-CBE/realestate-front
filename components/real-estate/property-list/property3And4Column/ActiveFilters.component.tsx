"use client";
import { X } from "lucide-react";
import { getPriceLabel } from "@/utils/function.utils";
import { priceOptions, sqftOptions } from "@/utils/constant.utils";
import { useRouter, useSearchParams } from "next/navigation";

interface ActiveFiltersProps {
  state: any;
  handleChange: (name: string, value: any) => void;
  resetFilter: () => void;
  onClearPrice: () => void;
  onClearSqft: () => void;
}

// URL param keys that map to filter names
const URL_PARAM_MAP: Record<string, string[]> = {
  location: ["location", "ai_location"],
  area: ["ai_area"],
  propertyType: ["propertyType", "ai_propertyType"],
  floorPlan: ["floor_plans_category", "ai_floor_plans_category"],
  furnishing: ["furnishing", "ai_furnishing"],
  listingStatus: ["type"],
  search: ["search"],
  bedrooms: [],
  bathrooms: [],
  priceMinInput: ["ai_maxPrice"],
  priceMaxInput: ["ai_maxPrice"],
  developer: ["developerId"],
};

export function ActiveFilters({ state, handleChange, resetFilter, onClearPrice, onClearSqft }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const removeUrlParams = (filterName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const keys = URL_PARAM_MAP[filterName] || [];
    keys.forEach((key) => params.delete(key));
    router.replace(`/property-list?${params.toString()}`);
  };

  const removeAndUpdate = (filterName: string, newValue: any) => {
    handleChange(filterName, newValue);
    removeUrlParams(filterName);
  };

  const badges: { label: string; onRemove: () => void }[] = [];

  if (state.search) {
    badges.push({ label: `Search: ${state.search}`, onRemove: () => removeAndUpdate("search", "") });
  }

  if (state.listingStatus && state.listingStatus !== "All" && state.listingStatus !== "") {
    badges.push({ label: state.listingStatus, onRemove: () => removeAndUpdate("listingStatus", "All") });
  }

  (state.propertyType || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("propertyType", state.propertyType.filter((t: any) => t.value !== item.value)) })
  );

  (state.location || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("location", state.location.filter((t: any) => t.value !== item.value)) })
  );

  (state.area || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("area", state.area.filter((t: any) => t.value !== item.value)) })
  );

  (state.developer || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("developer", state.developer.filter((t: any) => t.value !== item.value)) })
  );

  (state.project || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("project", state.project.filter((t: any) => t.value !== item.value)) })
  );

  (state.floorPlan || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("floorPlan", state.floorPlan.filter((t: any) => t.value !== item.value)) })
  );

  (state.furnishing || []).forEach((item: any) =>
    badges.push({ label: item.label, onRemove: () => removeAndUpdate("furnishing", []) })
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
    badges.push({ label: ` ${minLabel} – ${maxLabel}`, onRemove: () => { onClearPrice(); removeUrlParams("priceMinInput"); } });
  }

  if (state.sqftMin || state.sqftMax) {
    const minLabel = state.sqftMin ? getPriceLabel(state.sqftMin, sqftOptions) : "No min";
    const maxLabel = state.sqftMax ? getPriceLabel(state.sqftMax, sqftOptions) : "No max";
    badges.push({ label: `${minLabel} – ${maxLabel} sqft`, onRemove: onClearSqft });
  }

  if (badges.length === 0) return null;

  const handleClearAll = () => {
    resetFilter();
    router.replace("/property-list");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 !mt-5 pt-0 pb-5 xl:pb-0">
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
        onClick={handleClearAll}
        className="text-sm text-gray-500 underline hover:text-gray-700 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
