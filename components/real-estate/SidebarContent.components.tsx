import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import { FURNISHING_TYPE } from "@/utils/constant.utils";
import PriceRangeSlider from "../common-components/priceRange";
import { formatToINR } from "@/utils/function.utils";
import { TextInput } from "../common-components/textInput";

export const SidebarContent = (props: any) => {
  const {
    state,
    handleChange,
    resetFilter,
    categoryList,
    parseINR,
    formatINR,
  } = props;

  return (
    <div className="px-2 pb-10 space-y-6 ">
      <div className="w-full flex justify-between items-center mt-8">
        <h2 className="py-5 text-md font-semibold">Filters</h2>
        <Button
          onClick={resetFilter}
          variant="ghost"
          className="text-sm text-gray-500 underline flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <TextInput
      className="bg-white"
        placeholder="What are you looking for?"
        value={state.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      <div>
        <div className="mb-2 font-semibold text-gray-900">Listing Status</div>
        <div className="space-y-2">
          {["All", "Sale", "Rent", "Lease"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="listingStatus"
                checked={state.listingStatus === option}
                onChange={() => handleChange("listingStatus", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Property Type</div>
        <div className="space-y-2">
          {categoryList?.map((option) => (
            <label
              key={option?.value}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={state.propertyType.some(
                  (t) => t.value === option.value
                )}
                onChange={(e) => {
                  let updated;
                  if (e.target.checked) {
                    // ✅ Allow only one selected option
                    updated = [option];
                  } else {
                    // ✅ Uncheck all if the same option is clicked again
                    updated = [];
                  }
                  handleChange("propertyType", updated);
                }}
              />
              <span>{option?.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <PriceRangeSlider
          min={0}
          max={50000000}
          value={state.priceRange}
          onChange={(val) => {
             handleChange("priceRange", val);
            // setState({ priceRange: val });
            handleChange("minPrice", val[0]);
            handleChange("maxPrice", val[1]);
          }}
        />

        <div className="flex gap-3 mt-4 items-center">
          {/* Min Input */}
          <div className="relative w-full">
            <span className="absolute left-3 top-2 text-gray-600">₹</span>
            <Input
              type="text"
              className="pl-6 pr-0 bg-white"
              placeholder="Min."
              value={formatINR(state.priceRange?.[0] ?? 0)}
              onChange={(e) => {
                const newMin = parseINR(e.target.value);
                const newMax = Math.max(newMin, state.priceRange?.[1] ?? 0);
                const updated = [newMin, newMax];
                handleChange("priceRange", updated);
                // setState({ priceRange: updated });
              }}
            />
          </div>

          <span className="flex items-center">-</span>

          {/* Max Input */}
          <div className="relative w-full">
            <span className="absolute left-3 top-2 text-gray-600">₹</span>
            <Input
              type="text"
              className="pl-6 pr-0 bg-white"
              placeholder="Max."
              value={formatINR(state.priceRange?.[1] ?? 0)}
              onChange={(e) => {
                const newMax = parseINR(e.target.value);
                const newMin = Math.min(newMax, state.priceRange?.[0] ?? 0);
                const updated = [newMin, newMax];
                handleChange("priceRange", updated);
                // setState({ priceRange: updated });
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Bedrooms</div>

        <div className="flex flex-wrap gap-2">
          {["Any", "2+", "3+", "4+", "5+"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="bedrooms"
                checked={state.bedrooms === option}
                onChange={() => handleChange("bedrooms", option)}
                className="peer hidden"
              />
              <span className="flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:border-red-400 peer-checked:border-red-500">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Bathrooms</div>
        <div className="flex flex-wrap gap-2">
          {["Any", "2+", "3+", "4+", "5+"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="bathrooms"
                checked={state.bathrooms === option}
                onChange={() => handleChange("bathrooms", option)}
                className="peer hidden"
              />
              <span className="flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:border-red-400 peer-checked:border-red-500">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Furnishing</div>
        <div className="space-y-2">
          {FURNISHING_TYPE?.map((option) => (
            <label
              key={option?.value}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={state.furnishing?.some(
                  (t) => t.value === option.value
                )}
                onChange={(e) => {
                  let updated;
                  if (e.target.checked) {
                    // ✅ Allow only one selected option
                    updated = [option];
                  } else {
                    // ✅ Uncheck all if the same option is clicked again
                    updated = [];
                  }
                  handleChange("furnishing", updated);
                }}
              />
              <span>{option?.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Square Feet</div>
        <div className="flex gap-3">
          <Input
          className="bg-white"
            type="number"
            placeholder="Min."
            value={state.sqftMin}
            onChange={(e) => handleChange("sqftMin", e.target.value)}
          />
          <span className="flex items-center">-</span>
          <Input
          className="bg-white"
            type="number"
            placeholder="Max."
            value={state.sqftMax}
            onChange={(e) => handleChange("sqftMax", e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Year Built</div>
        <div className="flex gap-3">
          <Input
          className="bg-white"
            type="number"
            placeholder=""
            value={state.yearBuiltMin}
            onChange={(e) => handleChange("yearBuiltMin", e.target.value)}
          />
          <Input
          className="bg-white"
            type="number"
            placeholder=""
            value={state.yearBuiltMax}
            onChange={(e) => handleChange("yearBuiltMax", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
