import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, RotateCcw } from "lucide-react";
import { TextInput } from "../common-components/textInput";
import { priceOptions, sqftOptions } from "@/utils/constant.utils";
import { getPriceLabel } from "@/utils/function.utils";
import { FilterListPopup } from "./property-list/property3And4Column/FilterListPopup";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const PREVIEW_COUNT = 5;

// Self-contained dropdown — uses local state so it works inside Sheet (overflow-y-auto)
function InlineDropdown({
  value, options, placeholder, onChange,
}: {
  value: string; options: { label: string; value: any }[];
  placeholder: string; onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = value ? getPriceLabel(value, options) || value : placeholder;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700 text-sm"
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-[9999] top-full mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            {placeholder}
          </button>
          {options.map((item) => (
            <button
              key={item.value}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                String(value) === String(item.value) ? "font-semibold text-dred" : ""
              }`}
              onClick={() => { onChange(item.value); setOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSection({
  label, list, selected, stateKey, handleChange, showAlphabetNav = false,
}: {
  label: string; list: any[]; selected: any[]; stateKey: string;
  handleChange: (k: string, v: any) => void; showAlphabetNav?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ left: 0, top: 0 });
  const isMobile = useIsMobile();

  const openPopup = () => {
    const el = sectionRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPopupPos({ left: rect.left, top: rect.bottom + 8 });
    }
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-2 font-semibold text-gray-900">{label}</div>
      <div className="space-y-2" ref={sectionRef}>
        {list.slice(0, PREVIEW_COUNT).map((option) => (
          <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={selected?.some((t) => t.value === option.value)}
                onChange={(e) =>
                  handleChange(stateKey, e.target.checked
                    ? [...(selected || []), option]
                    : selected.filter((t) => t.value !== option.value))
                }
              />
              <span>{option.label}</span>
            </div>
            {option.count !== undefined && (
              <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{option.count}</span>
            )}
          </label>
        ))}
        {list.length > PREVIEW_COUNT && (
          <button
            onClick={openPopup}
            className="text-xs font-medium text-dred w-full rounded-full px-3 ps-5 text-left"
          >
            View more
          </button>
        )}
      </div>
      <FilterListPopup
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        items={list}
        selected={selected || []}
        onChange={(updated) => handleChange(stateKey, updated)}
        anchorPos={popupPos}
        isMobile={isMobile}
        showAlphabetNav={showAlphabetNav}
      />
    </div>
  );
}

export const SidebarContent = (props: any) => {
  const {
    state,
    handleChange,
    resetFilter,
    categoryList = [],
    locationList = [],
    areaList = [],
    projectList = [],
    developerList = [],
    floorPlanList = [],
    furnishingList = [],
    listingTypeList = [],
  } = props;

return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <h2 className="text-md font-semibold">Filters</h2>
        <Button
          onClick={resetFilter}
          variant="ghost"
          className="text-sm text-gray-500 underline flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Search */}
      <TextInput
        className="bg-white"
        placeholder="What are you looking for?"
        value={state.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      {/* Listing Status */}
      <div>
        <div className="mb-2 font-semibold text-gray-900">Listing Status</div>
        <div className="space-y-2">
          {[{ label: "All", value: "All" }, ...(listingTypeList || [])].map((option) => (
            <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="listingStatus_mobile"
                  checked={state.listingStatus === option.label}
                  onChange={() => handleChange("listingStatus", option.label)}
                />
                {option.label}
              </div>
              {option.count !== undefined && (
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{option.count}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      {categoryList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Property Type</div>
          <div className="space-y-2">
            {categoryList.map((option) => (
              <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={state.propertyType?.some((t) => t.value === option.value)}
                    onChange={(e) =>
                      handleChange("propertyType", e.target.checked
                        ? [...(state.propertyType || []), option]
                        : state.propertyType.filter((t) => t.value !== option.value))
                    }
                  />
                  <span>{option.label}</span>
                </div>
                {option.count !== undefined && (
                  <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{option.count}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {locationList.length > 0 && (
        <FilterSection label="Location" list={locationList} selected={state.location} stateKey="location" handleChange={handleChange} showAlphabetNav />
      )}
      {areaList.length > 0 && (
        <FilterSection label="Area" list={areaList} selected={state.area} stateKey="area" handleChange={handleChange} showAlphabetNav/>
      )}
      {developerList.length > 0 && (
        <FilterSection label="Developer" list={developerList} selected={state.developer} stateKey="developer" handleChange={handleChange} showAlphabetNav/>
      )}
      {projectList.length > 0 && (
        <FilterSection label="Project" list={projectList} selected={state.project} stateKey="project" handleChange={handleChange} showAlphabetNav/>
      )}

      {/* Budget */}
      <div>
        <div className="font-semibold text-gray-900 mb-2">Budget</div>
        <div className="flex gap-3">
          <InlineDropdown
            value={state.priceMinInput}
            options={priceOptions}
            placeholder="No min"
            onChange={(val) => handleChange("priceMinInput", val)}
          />
          <InlineDropdown
            value={state.priceMaxInput}
            options={state.priceMinInput
              ? priceOptions.filter((i) => i.value >= state.priceMinInput)
              : priceOptions}
            placeholder="No max"
            onChange={(val) => handleChange("priceMaxInput", val)}
          />
        </div>
      </div>

      {/* Unit Configuration */}
      {floorPlanList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Unit Configuration</div>
          <div className="flex flex-wrap gap-2">
            {floorPlanList.map((option) => {
              const isChecked = state.floorPlan?.some((item) => item.value === option.value);
              return (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={isChecked}
                    onChange={(e) =>
                      handleChange("floorPlan", e.target.checked
                        ? [...(state.floorPlan || []), option]
                        : (state.floorPlan || []).filter((item) => item.value !== option.value))
                    }
                  />
                  <span className="flex items-center justify-center px-4 py-1 rounded-lg border text-sm font-medium cursor-pointer transition-all border-gray-300 text-gray-700 bg-white peer-checked:border-red-600 peer-checked:text-red-500">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Bathrooms */}
      {/* <div>
        <div className="mb-2 font-semibold text-gray-900">Bathrooms</div>
        <div className="flex flex-wrap gap-2">
          {["Any", "2+", "3+", "4+", "5+"].map((option) => {
            const isSelected = option === "Any" ? state.bathrooms === "" : state.bathrooms === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleChange("bathrooms", option === "Any" ? "" : state.bathrooms === option ? "" : option)}
                className={`flex items-center justify-center px-4 py-1 rounded-md border text-sm font-medium cursor-pointer transition-all
                  ${isSelected ? "border-red-500 text-red-500" : "border-gray-300 text-gray-700 bg-white hover:border-red-400 hover:text-red-500"}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div> */}

      {/* Furnishing */}
      {furnishingList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Furnishing</div>
          <div className="space-y-2">
            {furnishingList.map((option) => (
              <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={state.furnishing?.some((t) => t.value === option.value)}
                    onChange={(e) => handleChange("furnishing", e.target.checked
                      ? [...(state.furnishing || []), option]
                      : state.furnishing.filter((t) => t.value !== option.value))}
                  />
                  <span>{option.label}</span>
                </div>
                {option.count !== undefined && (
                  <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{option.count}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Area (sqft) */}
      <div>
        <div className="mb-2 font-semibold text-gray-900">Area (sqft)</div>
        <div className="flex gap-3">
          <InlineDropdown
            value={state.sqftMin}
            options={sqftOptions}
            placeholder="No min"
            onChange={(val) => { handleChange("sqftMin", val); if (!val) handleChange("sqftMax", ""); }}
          />
          <InlineDropdown
            value={state.sqftMax}
            options={state.sqftMin
              ? sqftOptions.filter((i) => i.value >= state.sqftMin)
              : sqftOptions}
            placeholder="No max"
            onChange={(val) => handleChange("sqftMax", val)}
          />
        </div>
      </div>

    </div>
  );
};
