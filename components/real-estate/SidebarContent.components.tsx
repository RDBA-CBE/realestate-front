import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { ChevronDown, RotateCcw } from "lucide-react";
import PriceRangeSlider from "../common-components/priceRange";
import { TextInput } from "../common-components/textInput";
import { priceOptions, sqftOptions } from "@/utils/constant.utils";
import { getPriceLabel } from "@/utils/function.utils";

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

  console.log("state", state, floorPlanList);

  useEffect(() => {
    const handleClickOutside = (event) => {
      handleChange("openPriceDropdown", null);
      handleChange("openSqftDropdown", null);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const maxPriceOptions = state.priceMinInput
    ? priceOptions.filter((item) => item.value >= state.priceMinInput)
    : priceOptions;

  const maxSqftOptions = state.sqftMin
    ? sqftOptions.filter((item) => item.value >= state.sqftMin)
    : sqftOptions;

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
          {[{ label: "All", value: "All" }, ...(listingTypeList || [])].map(
            (option) => (
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
            ),
          )}
        </div>
      </div>

      {locationList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Location</div>
          <div className="space-y-2">
            {(locationList || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.location?.some(
                    (t) => t.value === option.value,
                  )}
                  onChange={(e) =>
                    handleChange(
                      "location",
                      e.target.checked
                        ? [...(state.location || []), option]
                        : state.location.filter(
                            (t) => t.value !== option.value,
                          ),
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {areaList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Area</div>
          <div className="space-y-2">
            {(areaList || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.area?.some((t) => t.value === option.value)}
                  onChange={(e) =>
                    handleChange(
                      "area",
                      e.target.checked
                        ? [...(state.area || []), option]
                        : state.area.filter((t) => t.value !== option.value),
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {projectList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Project</div>
          <div className="space-y-2">
            {(projectList || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.project?.some((t) => t.value === option.value)}
                  onChange={(e) =>
                    handleChange(
                      "project",
                      e.target.checked
                        ? [...(state.project || []), option]
                        : state.project.filter((t) => t.value !== option.value),
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {developerList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">Developer</div>
          <div className="space-y-2">
            {(developerList || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={state.developer?.some(
                    (t) => t.value === option.value,
                  )}
                  onChange={(e) =>
                    handleChange(
                      "developer",
                      e.target.checked
                        ? [...(state.developer || []), option]
                        : state.developer.filter(
                            (t) => t.value !== option.value,
                          ),
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {categoryList.length > 0 && (
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
                    (t) => t.value === option.value,
                  )}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...state.propertyType, option]
                      : state.propertyType.filter(
                          (t) => t.value !== option.value,
                        );
                    handleChange("propertyType", updated);
                  }}
                />
                <span>{option?.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="font-semibold text-gray-900">Budget</div>

        <div className="flex gap-4 mt-4">
          {/* MIN */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() =>
                handleChange(
                  "openPriceDropdown",
                  state.openPriceDropdown === "min" ? null : "min",
                )
              }
              className="w-full px-5 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700"
            >
              <span>
                {state.priceMinInput !== "" && state.priceMinInput != null
                  ? getPriceLabel(Number(state.priceMinInput), priceOptions)
                  : "No min"}
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  state.openPriceDropdown === "min" ? "rotate-180" : ""
                }`}
              />
            </button>

            {state.openPriceDropdown === "min" && (
              <div className="absolute z-50 bottom-full mb-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto">
                <button
                  className="w-full px-5 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    handleChange("priceMinInput", "");
                    handleChange("priceMaxInput", "");
                    handleChange("openPriceDropdown", null);
                  }}
                >
                  No min
                </button>

                {priceOptions.map((item) => (
                  <button
                    key={item.value}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100"
                    onClick={() => {
                      console.log("item", item);
                      handleChange("priceMinInput", item.value);
                      // handleChange("priceMaxInput", "");
                      // handleChange("openPriceDropdown", null);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MAX */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() =>
                handleChange(
                  "openPriceDropdown",
                  state.openPriceDropdown === "max" ? null : "max",
                )
              }
              className="w-full px-5 py-2 rounded-full border border-gray-300 bg-white flex items-center justify-between text-gray-700"
            >
              <span>
                {state.priceMaxInput !== "" && state.priceMaxInput != null
                  ? getPriceLabel(Number(state.priceMaxInput), priceOptions)
                  : "No max"}
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  state.openPriceDropdown === "max" ? "rotate-180" : ""
                }`}
              />
            </button>

            {state.openPriceDropdown === "max" && (
              <div className="absolute z-50 bottom-full mb-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto">
                <button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    handleChange("priceMaxInput", "");
                    handleChange("openPriceDropdown", null);
                  }}
                >
                  No max
                </button>

                {(state.priceMinInput
                  ? priceOptions.filter(
                      (item) =>
                        Number(item.value) >= Number(state.priceMinInput),
                    )
                  : priceOptions
                ).map((item) => (
                  <button
                    key={item.value}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleChange("priceMaxInput", item.value);
                      handleChange("openPriceDropdown", null);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-gray-900">Budget</div>

        <div className="flex gap-4 mt-4">
          {/* Min Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() =>
                
                handleChange(
                  "openPriceDropdown",
                  state.openPriceDropdown === "min" ? null : "min",
                )
              }
              className="
        w-full px-5 py-2 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
            >
              <span>{state.sqftMin || "No min"}</span>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  state.openPriceDropdown === "min" ? "rotate-180" : ""
                }`}
              />
            </button>

            {state.openPriceDropdown === "min" && (
              <div
                className="
                      absolute z-50 bottom-full mb-2 w-full
                      bg-white border border-gray-200
                      rounded-2xl shadow-lg
                      max-h-72 overflow-y-auto
                    "
              >
                <button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    handleChange("priceMinInput", "");
                    handleChange("openPriceDropdown", "");
                    handleChange("priceMinInput", null);
                  }}
                >
                  No min
                </button>

                {priceOptions.map((item) => (
                  <button
                    key={item.value}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleChange("priceMinInput", item.value);
                      handleChange("sqftMax", "");
                      handleChange("openDropdown", null);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Max Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() =>
                handleChange(
                  "openDropdown",
                  state.openDropdown === "max" ? null : "max",
                )
              }
              className="
        w-full px-5 py-2 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
            >
              <span>{state.sqftMax || "No max"}</span>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  state.openDropdown === "max" ? "rotate-180" : ""
                }`}
              />
            </button>

            {state.openDropdown === "max" && (
              <div
                className="
                    absolute z-50 bottom-full mb-2 w-full
                    bg-white border border-gray-200
                    rounded-2xl shadow-lg
                    max-h-72 overflow-y-auto
                  "
              >
                <button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    handleChange("sqftMax", "");
                    handleChange("openDropdown", null);
                  }}
                >
                  No max
                </button>

                {maxSqftOptions.map((item) => (
                  <button
                    key={item.value}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleChange("sqftMax", item.value);
                      handleChange("openDropdown", null);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex gap-3">
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
              </div> */}
      </div>
      {floorPlanList.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-900">
            Unit Configuration
          </div>

          <div className="flex flex-wrap gap-2">
            {(floorPlanList || []).map((option) => {
              const isChecked = state.floorPlan?.some(
                (item) => item.value === option.value,
              );

              return (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={isChecked}
                    onChange={(e) => {
                      const updatedFloorPlan = e.target.checked
                        ? [...(state.floorPlan || []), option]
                        : (state.floorPlan || []).filter(
                            (item) => item.value !== option.value,
                          );

                      handleChange("floorPlan", updatedFloorPlan);
                    }}
                  />

                  <span
                    className="
              flex items-center justify-center
              px-4 py-2 rounded-lg border
              text-sm font-medium cursor-pointer
              transition-all duration-200
              border-gray-300 text-gray-700 bg-white
              peer-checked:border-red-600
              peer-checked:text-red-500
              peer-checked:shadow-md
            "
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

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
              <span
                className="
            flex items-center justify-center
            px-4 py-2 rounded-md border
            text-sm font-medium cursor-pointer
            transition-all duration-200

            border-gray-300 text-gray-700 bg-white
            hover:border-red-400 hover:text-red-500

          
            peer-checked:border-red-500
            peer-checked:text-red-500
            peer-checked:shadow-md
      
          "
              >
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
                checked={state.furnishing?.some(
                  (t) => t.value === option.value,
                )}
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
        <div className="mb-2 font-semibold text-gray-900">Area (sqft)</div>

        <div className="flex gap-4 mt-4">
          {/* Min Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() =>
                handleChange(
                  "openDropdown",
                  state.openDropdown === "min" ? null : "min",
                )
              }
              className="
        w-full px-5 py-2 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
            >
              <span>{state.sqftMin || "No min"}</span>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  state.openDropdown === "min" ? "rotate-180" : ""
                }`}
              />
            </button>

            {state.openDropdown === "min" && (
              <div
                className="
                      absolute z-50 bottom-full mb-2 w-full
                      bg-white border border-gray-200
                      rounded-2xl shadow-lg
                      max-h-72 overflow-y-auto
                    "
              >
                <button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    handleChange("sqftMin", "");
                    handleChange("sqftMax", "");
                    handleChange("openDropdown", null);
                  }}
                >
                  No min
                </button>

                {sqftOptions.map((item) => (
                  <button
                    key={item.value}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleChange("sqftMin", item.value);
                      handleChange("sqftMax", "");
                      handleChange("openDropdown", null);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Max Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() =>
                handleChange(
                  "openDropdown",
                  state.openDropdown === "max" ? null : "max",
                )
              }
              className="
        w-full px-5 py-2 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
            >
              <span>{state.sqftMax || "No max"}</span>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  state.openDropdown === "max" ? "rotate-180" : ""
                }`}
              />
            </button>

            {state.openDropdown === "max" && (
              <div
                className="
                    absolute z-50 bottom-full mb-2 w-full
                    bg-white border border-gray-200
                    rounded-2xl shadow-lg
                    max-h-72 overflow-y-auto
                  "
              >
                <button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    handleChange("sqftMax", "");
                    handleChange("openDropdown", null);
                  }}
                >
                  No max
                </button>

                {maxSqftOptions.map((item) => (
                  <button
                    key={item.value}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleChange("sqftMax", item.value);
                      handleChange("openDropdown", null);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex gap-3">
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
              </div> */}
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
