import React from "react";
import { Button } from "../ui/button";
import { ChevronDown, RotateCcw } from "lucide-react";
import { TextInput } from "../common-components/textInput";
import { priceOptions, sqftOptions } from "@/utils/constant.utils";
import { getPriceLabel } from "@/utils/function.utils";

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

  const maxPriceOptions = state.priceMinInput
    ? priceOptions.filter((item) => item.value >= state.priceMinInput)
    : priceOptions;

  const maxSqftOptions = state.sqftMin
    ? sqftOptions.filter((item) => item.value >= state.sqftMin)
    : sqftOptions;

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
            <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="listingStatus_mobile"
                checked={state.listingStatus === option.label}
                onChange={() => handleChange("listingStatus", option.label)}
              />
              {option.label}
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
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {locationList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Location</div>
          <div className="space-y-2">
            {locationList.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.location?.some((t) => t.value === option.value)}
                  onChange={(e) =>
                    handleChange("location", e.target.checked
                      ? [...(state.location || []), option]
                      : state.location.filter((t) => t.value !== option.value))
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Area */}
      {areaList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Area</div>
          <div className="space-y-2">
            {areaList.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.area?.some((t) => t.value === option.value)}
                  onChange={(e) =>
                    handleChange("area", e.target.checked
                      ? [...(state.area || []), option]
                      : state.area.filter((t) => t.value !== option.value))
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Developer */}
      {developerList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Developer</div>
          <div className="space-y-2">
            {developerList.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.developer?.some((t) => t.value === option.value)}
                  onChange={(e) =>
                    handleChange("developer", e.target.checked
                      ? [...(state.developer || []), option]
                      : state.developer.filter((t) => t.value !== option.value))
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Project */}
      {projectList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Project</div>
          <div className="space-y-2">
            {projectList.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.project?.some((t) => t.value === option.value)}
                  onChange={(e) =>
                    handleChange("project", e.target.checked
                      ? [...(state.project || []), option]
                      : state.project.filter((t) => t.value !== option.value))
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Budget */}
      <div>
        <div className="font-semibold text-gray-900 mb-2">Budget</div>
        <div className="flex gap-4">
          {/* Min */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => handleChange("openPriceDropdown", state.openPriceDropdown === "min" ? null : "min")}
              className="w-full px-5 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700 text-sm"
            >
              <span>{state.priceMinInput ? getPriceLabel(state.priceMinInput, priceOptions) : "No min"}</span>
              <ChevronDown size={16} className={`transition-transform ${state.openPriceDropdown === "min" ? "rotate-180" : ""}`} />
            </button>
            {state.openPriceDropdown === "min" && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                <button className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => handleChange("openPriceDropdown", null) || handleChange("priceMinInput", "")}>
                  No min
                </button>
                {priceOptions.map((item) => (
                  <button key={item.value} className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => { handleChange("priceMinInput", item.value); handleChange("openPriceDropdown", null); }}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Max */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => handleChange("openPriceDropdown", state.openPriceDropdown === "max" ? null : "max")}
              className="w-full px-5 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700 text-sm"
            >
              <span>{state.priceMaxInput ? getPriceLabel(state.priceMaxInput, maxPriceOptions) : "No max"}</span>
              <ChevronDown size={16} className={`transition-transform ${state.openPriceDropdown === "max" ? "rotate-180" : ""}`} />
            </button>
            {state.openPriceDropdown === "max" && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                <button className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => { handleChange("priceMaxInput", ""); handleChange("openPriceDropdown", null); }}>
                  No max
                </button>
                {maxPriceOptions.map((item) => (
                  <button key={item.value} className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => { handleChange("priceMaxInput", item.value); handleChange("openPriceDropdown", null); }}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
      <div>
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
      </div>

      {/* Furnishing */}
      {furnishingList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Furnishing</div>
          <div className="space-y-2">
            {furnishingList.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.furnishing?.some((t) => t.value === option.value)}
                  onChange={(e) => handleChange("furnishing", e.target.checked ? [option] : [])}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Area (sqft) */}
      <div>
        <div className="mb-2 font-semibold text-gray-900">Area (sqft)</div>
        <div className="flex gap-4">
          {/* Min */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => handleChange("openDropdown", state.openDropdown === "min" ? null : "min")}
              className="w-full px-5 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700 text-sm"
            >
              <span>{state.sqftMin || "No min"}</span>
              <ChevronDown size={16} className={`transition-transform ${state.openDropdown === "min" ? "rotate-180" : ""}`} />
            </button>
            {state.openDropdown === "min" && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                <button className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => { handleChange("sqftMin", ""); handleChange("sqftMax", ""); handleChange("openDropdown", null); }}>
                  No min
                </button>
                {sqftOptions.map((item) => (
                  <button key={item.value} className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => { handleChange("sqftMin", item.value); handleChange("sqftMax", ""); handleChange("openDropdown", null); }}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Max */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => handleChange("openDropdown", state.openDropdown === "max" ? null : "max")}
              className="w-full px-5 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700 text-sm"
            >
              <span>{state.sqftMax || "No max"}</span>
              <ChevronDown size={16} className={`transition-transform ${state.openDropdown === "max" ? "rotate-180" : ""}`} />
            </button>
            {state.openDropdown === "max" && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                <button className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => { handleChange("sqftMax", ""); handleChange("openDropdown", null); }}>
                  No max
                </button>
                {maxSqftOptions.map((item) => (
                  <button key={item.value} className="w-full px-5 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => { handleChange("sqftMax", item.value); handleChange("openDropdown", null); }}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
