import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import PriceRangeSlider from "../common-components/priceRange";
import { TextInput } from "../common-components/textInput";

export const SidebarContent = (props: any) => {
  const {
    state,
    handleChange,
    resetFilter,
    categoryList,
    locationList,
    areaList,
    projectList,
    developerList,
    floorPlanList,
    furnishingList,
    listingTypeList,
    bedroomList,
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
          {([{ label: "All", value: "All" }, ...(listingTypeList || [])]).map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="listingStatus"
                checked={state.listingStatus === option.label}
                onChange={() => handleChange("listingStatus", option.label)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Location</div>
        <div className="space-y-2">
          {(locationList || []).map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="cursor-pointer"
                checked={state.location?.some((t) => t.value === option.value)}
                onChange={(e) => handleChange("location", e.target.checked ? [...(state.location || []), option] : state.location.filter((t) => t.value !== option.value))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Area</div>
        <div className="space-y-2">
          {(areaList || []).map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="cursor-pointer"
                checked={state.area?.some((t) => t.value === option.value)}
                onChange={(e) => handleChange("area", e.target.checked ? [...(state.area || []), option] : state.area.filter((t) => t.value !== option.value))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {projectList.length > 0 &&
      <div>
        <div className="mb-2 font-semibold text-gray-900">Project</div>
        <div className="space-y-2">
          {(projectList || []).map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="cursor-pointer"
                checked={state.project?.some((t) => t.value === option.value)}
                onChange={(e) => handleChange("project", e.target.checked ? [...(state.project || []), option] : state.project.filter((t) => t.value !== option.value))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>}

      <div>
        <div className="mb-2 font-semibold text-gray-900">Developer</div>
        <div className="space-y-2">
          {(developerList || []).map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="cursor-pointer"
                checked={state.developer?.some((t) => t.value === option.value)}
                onChange={(e) => handleChange("developer", e.target.checked ? [...(state.developer || []), option] : state.developer.filter((t) => t.value !== option.value))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Property Type</div>
        <div className="space-y-2">
          {categoryList?.map((option) => (
            <label key={option?.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="cursor-pointer"
                checked={state.propertyType.some((t) => t.value === option.value)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...state.propertyType, option]
                    : state.propertyType.filter((t) => t.value !== option.value);
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
        <div className="mb-2 font-semibold text-gray-900">Unit Configuration</div>
        <div className="flex flex-wrap gap-2">
          {(floorPlanList || []).map((option) => (
            <label key={option.value}>
              <input
                type="checkbox"
                checked={state.floorPlan?.some((t) => t.value === option.value)}
                onChange={(e) => handleChange("floorPlan", e.target.checked ? [...(state.floorPlan || []), option] : state.floorPlan.filter((t) => t.value !== option.value))}
                className="peer hidden"
              />
              <span className="flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700 cursor-pointer hover:border-red-400 peer-checked:border-dred peer-checked:bg-dred/10">
                {option.label}
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
              <span className="flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:border-red-400 peer-checked:border-dred">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Furnishing</div>
        <div className="space-y-2">
          {(furnishingList || [])?.map((option) => (
            <label
              key={option?.value}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={state.furnishing?.some((t) => t.value === option.value)}
                onChange={(e) => {
                  handleChange("furnishing", e.target.checked ? [option] : []);
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
