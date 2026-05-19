import { PropertyCard } from "./property-card";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Search as SearchIcon,
  Loader,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  MapPinHouseIcon,
  ChevronDown,
} from "lucide-react";
import FilterDropdown from "../../FilterDropdown.component";
import Modal from "@/components/common-components/modal";
import { getPriceLabel, useSetState } from "@/utils/function.utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import useDebounce from "@/components/common-components/useDebounce";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";
import PriceRangeSlider from "@/components/common-components/priceRange";
import { TextInput } from "@/components/common-components/textInput";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "../../SidebarContent.components";
import DeveloperCard from "../../developerProfile.component";
import { priceOptions, sqftOptions } from "@/utils/constant.utils";
import ContactAgentForm from "../../property-detail/ContactAgentForm.component";
import { ActiveFilters } from "./ActiveFilters.component";
import { useRouter } from "next/navigation";

export function PropertyView(props: any) {
  const {
    properties,
    title = "List View",
    filters,
    loading,
    isLoadingMore,
    handNext,
    loadMore,
    categoryList = [],
    locationList = [],
    areaList = [],
    projectList = [],
    developerList = [],
    floorPlanList = [],
    furnishingList = [],
    listingTypeList = [],
    bedroomList = [],
    minPrice,
    maxPrice,
    updateList,
    clearFilter,
    initialSearch,
    initialListingStatus,
    initialLocation,
    initialPropertyType,
    initialDeveloper,
    propertyTypeFilter,
    onFilterChange,
  } = props;

  const router = useRouter();

  const [state, setState] = useSetState({
    isOpen: false,
    search: "",
    listingStatus: "All",
    propertyType: [],
    furnishing: [],
    location: [],
    area: [],
    project: [],
    developer: [],
    floorPlan: [],
    priceRange: [0, 0],
    minPrice: 0,
    maxPrice: 0,
    priceFloor: 0,
    priceCeiling: 0,
    priceMinInput: "",
    priceMaxInput: "",
    priceMinError: "",
    priceMaxError: "",
    bedrooms: "",
    bathrooms: "",
    sqftMin: "",
    sqftMax: "",
    yearBuiltMin: "",
    yearBuiltMax: "",
    view: "grid",
    sort: null,
    prefferedLocation: false,
    userLoggedIn: false,
    isMobileFormOpen: false,
    selectedProperty: null,
  });

  // console.log("state", state); // Commented out for cleaner console

  const initialLoadRef = useRef(false);
  const filterTimeoutRef = useRef(null);
  const previousFiltersRef = useRef({});
  const priceFloorRef = useRef(0);
  const priceCeilingRef = useRef(0);
  const isResettingRef = useRef(false);

  const skeletonCount = state.view == "grid" ? 3 : 1;

  const observer = useRef(null);

  const lastPropertyElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && handNext) {
          loadMore({ ...state, ...debouncedState });
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingMore, handNext, loadMore],
  );

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("token");
    setState({
      userLoggedIn : userLoggedIn ? true : false
    })
  }, []);


  useEffect(() => {
    if (propertyTypeFilter) setState({ propertyType: propertyTypeFilter });
    if (initialSearch) setState({ search: initialSearch });
    if (initialListingStatus) setState({ listingStatus: initialListingStatus });
    if (initialLocation?.length > 0) setState({ location: initialLocation });
    if (initialPropertyType?.length > 0) setState({ propertyType: initialPropertyType });
    if (initialDeveloper?.length > 0) setState({ developer: initialDeveloper });
  }, [
    propertyTypeFilter,
    initialSearch,
    initialListingStatus,
    initialLocation,
    initialPropertyType,
    initialDeveloper,
  ]);

  useEffect(() => {
    if (minPrice > 0 || maxPrice > 0) {
      priceFloorRef.current = minPrice;
      priceCeilingRef.current = maxPrice;
      setState({
        priceFloor: minPrice,
        priceCeiling: maxPrice,
        minPrice,
        maxPrice,
        priceRange: [minPrice, maxPrice],
        // priceMinInput: formatINR(minPrice),
        // priceMaxInput: formatINR(maxPrice),
        priceMinError: "",
        priceMaxError: "",
      });
    }
  }, [minPrice, maxPrice]);

  const debouncedState = {
    search: useDebounce(state.search),
    priceRange: useDebounce(state.priceRange),
    minPrice: useDebounce(state.minPrice),
    maxPrice: useDebounce(state.maxPrice),
    sqftMin: useDebounce(state.sqftMin),
    sqftMax: useDebounce(state.sqftMax),
    yearBuiltMin: useDebounce(state.yearBuiltMin),
    yearBuiltMax: useDebounce(state.yearBuiltMax),
  };

  const debouncedSearch = useDebounce(state.search, 500);
  const debouncedSqftMin = useDebounce(state.sqftMin, 500);
  const debouncedSqftMax = useDebounce(state.sqftMax, 500);
  const debouncedYearBuiltMin = useDebounce(state.yearBuiltMin, 500);
  const debouncedYearBuiltMax = useDebounce(state.yearBuiltMax, 500); // Keep this one
  
  // Debounced price inputs
  const debouncedPriceMinInput = useDebounce(state.priceMinInput, 500);
  const debouncedPriceMaxInput = useDebounce(state.priceMaxInput, 500);

  useEffect(() => {
    // Skip initial load or if currently resetting filters
    if (initialLoadRef.current || isResettingRef.current) {
      return;
    }

    // Clear any existing timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    // If resetting, skip this filter execution
    if (isResettingRef.current) {
      return;
    }

    // Create current filter object
    const currentFilters = {
      listingStatus: state.listingStatus,
      propertyType: state.propertyType,
      bedrooms: state.bedrooms,
      bathrooms: state.bathrooms,
      location: state.location,
      area: state.area,
      project: state.project,
      developer: state.developer,
      floorPlan: state.floorPlan,
      furnishing: state.furnishing,
      search: debouncedSearch,
      priceRange: state.priceRange,
      sqftMin: debouncedSqftMin,
      sqftMax: debouncedSqftMax,
      yearBuiltMin: debouncedYearBuiltMin,
      yearBuiltMax: debouncedYearBuiltMax,
      sort: state.sort,
      prefferedLocation: state.prefferedLocation,
      priceMinInput: state.priceMinInput,
      priceMaxInput: state.priceMaxInput,
    };

    console.log("PropertyView sending filters:", currentFilters); // Debug log

    // Check if filters actually changed
    const hasFiltersChanged =
      JSON.stringify(currentFilters) !==
      JSON.stringify(previousFiltersRef.current);

    if (hasFiltersChanged) {
      filterTimeoutRef.current = setTimeout(() => {
        filters(currentFilters);
        if (onFilterChange) onFilterChange(currentFilters);
        previousFiltersRef.current = currentFilters;
      }, 400);
    }

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [
    state.listingStatus,
    state.propertyType,
    state.bedrooms,
    state.bathrooms,
    state.location,
    state.area,
    state.project,
    state.developer,
    state.floorPlan,
    state.furnishing,
    debouncedSearch,
    state.priceRange,
    debouncedSqftMin,
    debouncedSqftMax,
    debouncedYearBuiltMin,
    debouncedYearBuiltMax,
  ]);

  const handleChange = (name, value) => {
    console.log("name", name, "value", value);
    setState({ [name]: value });
  };

  //   const handleChange = (name: string, value: any) => {
  //   setState((prev) => ({ // This is the correct way to use setState with a functional update
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const resetFilter = () => {
    // Set flag to prevent filter effect from firing during reset
    isResettingRef.current = true; // Set flag to true
    
    setState({
      search: "",
      listingStatus: "",
      propertyType: [],
      priceRange: [minPrice, maxPrice],
      minPrice: "",
      maxPrice: "",
      priceMinInput: "",
      priceMaxInput: "",
      priceMinError: "",
      priceMaxError: "",
      bedrooms: "",
      bathrooms: "",
      location: [],
      area: [],
      project: [],
      developer: [],
      floorPlan: [],
      furnishing: [],
      sqftMin: "",
      sqftMax: "",
      yearBuiltMin: "",
      yearBuiltMax: "",
    });
    previousFiltersRef.current = {};

    // Reset the flag immediately before calling parent
    isResettingRef.current = false;

    // Call parent clear filter (which calls propertyList)
    if (clearFilter) {
      clearFilter();
    }
  };

  const formatINR = (value: number) => {
    if (isNaN(value)) return "";
    return value.toLocaleString("en-IN");
  };

  const parseINR = (value: string) => {
    return Number(value.replace(/,/g, ""));
  };

  const applyPriceInputs = () => {
    const floor = priceFloorRef.current;
    const ceiling = priceCeilingRef.current;

    const newMin = state.priceMinInput
      ? parseINR(state.priceMinInput)
      : (state.priceRange?.[0] ?? floor);
    const newMax = state.priceMaxInput
      ? parseINR(state.priceMaxInput)
      : (state.priceRange?.[1] ?? ceiling);

    if (Number.isNaN(newMin) || newMin < 0) {
      setState({ priceMinError: "Enter a valid minimum price" });
      return;
    }
    if (Number.isNaN(newMax) || newMax < 0) {
      setState({ priceMaxError: "Enter a valid maximum price" });
      return;
    }
    if (newMin > newMax) {
      setState({
        priceMinError: "Minimum price cannot be greater than maximum price",
        priceMaxError: "",
      });
      return;
    }
    if (floor > 0 && newMin > ceiling) {
      setState({
        priceMinError: `No properties available above ₹${formatINR(ceiling)}`,
        priceMaxError: "",
      });
      return;
    }
    if (ceiling > 0 && newMax < floor) {
      setState({
        priceMaxError: `No properties available below ₹${formatINR(floor)}`,
        priceMinError: "",
      });
      return;
    }

    const updated = [newMin, newMax];
    setState({
      priceRange: updated,
      // priceMinInput: formatINR(newMin),
      // priceMaxInput: formatINR(newMax),
      priceMinError: "",
      priceMaxError: "",
    });
    handleChange("priceRange", updated);
  };

 

  

  const maxPriceOptions = state.priceMinInput
    ? priceOptions.filter((item) => item.value >= state.priceMinInput)
    : priceOptions;

  const maxSqftOptions = state.sqftMin
    ? sqftOptions.filter((item) => item.value >= state.sqftMin)
    : sqftOptions;

    const redirect = () => {
    router.push(`/property-list?developerId=${state.detail?.developer?.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="xl:max-w-[110rem] max-w-[85rem] mx-auto px-3 py-6 lg:p-6"
    >
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start min-h-screen">
        <aside className="space-y-6 lg:col-span-1 xl:sticky md:top-16 lg:top-16  hidden xl:block ">
          <div className="p-4 pb-8 border rounded-2xl space-y-6 bg-color1 border-gray h-[91vh] overflow-auto thin-scrollbar">
            {/* <div className="w-full flex justify-end">
              <Button
                onClick={() => resetFilter()}
                variant="ghost"
                className="text-sm text-gray-500 underline flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div> */}

            <TextInput
              placeholder="What are you looking for?"
              value={state.search}
              onChange={(e) => handleChange("search", e.target.value)}
            />

            <div>
              <div className="mb-2 font-semibold text-gray-900">
                Listing Status
              </div>
              <div className="space-y-2">
                {[
                  { label: "All", value: "All" },
                  ...(listingTypeList || []),
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="listingStatus"
                      checked={state.listingStatus === option.label}
                      onChange={() =>
                        handleChange("listingStatus", option.label)
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            {categoryList.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">
                  Property Type
                </div>
                <div className="space-y-2">
                  {categoryList?.map((option) => (
                    <label
                      key={option?.value}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={state.propertyType?.some(
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
                        checked={state.location.some(
                          (t) => t.value === option.value,
                        )}
                        onChange={(e) =>
                          handleChange(
                            "location",
                            e.target.checked
                              ? [...state.location, option]
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
                        checked={state.area.some(
                          (t) => t.value === option.value,
                        )}
                        onChange={(e) =>
                          handleChange(
                            "area",
                            e.target.checked
                              ? [...state.area, option]
                              : state.area.filter(
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
            {developerList.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">
                  Developer
                </div>
                <div className="space-y-2">
                  {(developerList || []).map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={state.developer.some(
                          (t) => t.value === option.value,
                        )}
                        onChange={(e) =>
                          handleChange(
                            "developer",
                            e.target.checked
                              ? [...state.developer, option]
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
                        checked={state.project.some(
                          (t) => t.value === option.value,
                        )}
                        onChange={(e) =>
                          handleChange(
                            "project",
                            e.target.checked
                              ? [...state.project, option]
                              : state.project.filter(
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
            <div>
              {/* <PriceRangeSlider
                  min={state.minPrice || 0}
                  max={state.maxPrice || 50000000}
                  value={state.priceRange}
                  onChange={(val) => {
                    setState({ priceRange: val });
                    handleChange("minPrice", val[0]);
                    handleChange("maxPrice", val[1]);
                  }}
                /> */}
              <div className=" font-semibold text-gray-900">Budget</div>

              <div className="flex gap-4 mt-2">
                {/* MIN */}
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setState({
                        openPriceDropdown:
                          state.openPriceDropdown === "min" ? null : "min",
                      })
                    }
                    className="
        w-full px-5 py-1 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
                  >
                    <span>
                      {state.priceMinInput
                        ? getPriceLabel(state.priceMinInput, priceOptions)
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
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto">
                      <button
                        className="w-full px-5 py-1 text-left hover:bg-gray-100"
                        onClick={() =>
                          setState({
                            priceMinInput: "",
                            priceMaxInput: "",
                            openPriceDropdown: null,
                          })
                        }
                      >
                        No min
                      </button>

                      {priceOptions.map((item) => (
                        <button
                          key={item.value}
                          className="w-full px-5 py-3 text-left hover:bg-gray-100"
                          onClick={() =>
                            setState({
                              priceMinInput: item.value,
                              priceMaxInput: "",
                              openPriceDropdown: null,
                            })
                          }
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
                      setState({
                        openPriceDropdown:
                          state.openPriceDropdown === "max" ? null : "max",
                      })
                    }
                    className="
        w-full px-5 py-2 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
                  >
                    <span>
                      {state.priceMaxInput
                        ? getPriceLabel(state.priceMaxInput, maxPriceOptions)
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
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto">
                      <button
                        className="w-full px-5 py-3 text-left hover:bg-gray-100"
                        onClick={() =>
                          setState({
                            priceMaxInput: "",
                            openPriceDropdown: null,
                          })
                        }
                      >
                        No max
                      </button>

                      {maxPriceOptions.map((item) => (
                        <button
                          key={item.value}
                          className="w-full px-5 py-3 text-left hover:bg-gray-100"
                          onClick={() =>
                            setState({
                              priceMaxInput: item.value,
                              openPriceDropdown: null,
                            })
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {floorPlanList.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">
                  Unit Configuration
                </div>
                <div className="flex flex-wrap gap-2">
                  {(floorPlanList || []).map((option) => (
                    <label key={option.value}>
                      <input
                        type="checkbox"
                        checked={state.floorPlan.some(
                          (t) => t.value === option.value,
                        )}
                        onChange={(e) =>
                          handleChange(
                            "floorPlan",
                            e.target.checked
                              ? [...state.floorPlan, option]
                              : state.floorPlan.filter(
                                  (t) => t.value !== option.value,
                                ),
                          )
                        }
                        className="peer hidden"
                      />

                      <span
                        className="
              flex items-center justify-center
              px-4 py-1 rounded-lg border
              text-sm font-medium cursor-pointer
              transition-all duration-200
              border-gray-300 text-gray-700 bg-white
              peer-checked:border-red-600
              peer-checked:text-red-500
            "
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="mb-2 font-semibold text-gray-900">Bathrooms</div>

              <div className="flex flex-wrap gap-2">
                {["Any", "2+", "3+", "4+", "5+"].map((option) => {
                  const isSelected =
                    option === "Any"
                      ? state.bathrooms === ""
                      : state.bathrooms === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (option === "Any") {
                          handleChange("bathrooms", "");
                        } else {
                          handleChange(
                            "bathrooms",
                            state.bathrooms === option ? "" : option,
                          );
                        }
                      }}
                      className={`
            flex items-center justify-center
            px-4 py-1 rounded-md border
            text-sm font-medium cursor-pointer
            transition-all duration-200

            ${
              isSelected
                ? "border-red-500 text-red-500 "
                : "border-gray-300 text-gray-700 bg-white hover:border-red-400 hover:text-red-500"
            }
          `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* <div>
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
            </div> */}

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
                      checked={state.furnishing.some(
                        (t) => t.value === option.value,
                      )}
                      onChange={(e) => {
                        handleChange(
                          "furnishing",
                          e.target.checked ? [option] : [],
                        );
                      }}
                    />
                    <span>{option?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 font-semibold text-gray-900">
                Area (sqft)
              </div>

              <div className="flex gap-4 mt-2">
                {/* Min Dropdown */}
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setState({
                        openDropdown:
                          state.openDropdown === "min" ? null : "min",
                      })
                    }
                    className="
        w-full px-5 py-1 rounded-full
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
                          setState({
                            sqftMin: "",
                            sqftMax: "",
                          });
                          setState({
                            openDropdown: null,
                          });
                        }}
                      >
                        No min
                      </button>

                      {sqftOptions.map((item) => (
                        <button
                          key={item.value}
                          className="w-full px-5 py-3 text-left hover:bg-gray-100"
                          onClick={() => {
                            setState({
                              sqftMin: item.value,
                              sqftMax: "",
                            });
                            setState({
                              openDropdown: null,
                            });
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
                      setState({
                        openDropdown:
                          state.openDropdown === "max" ? null : "max",
                      })
                    }
                    className="
        w-full px-5 py-1 rounded-full
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
                          setState({
                            sqftMax: "",
                          });
                          setState({
                            openDropdown: null,
                          });
                        }}
                      >
                        No max
                      </button>

                      {maxSqftOptions.map((item) => (
                        <button
                          key={item.value}
                          className="w-full px-5 py-3 text-left hover:bg-gray-100"
                          onClick={() => {
                            setState({
                              sqftMax: item.value,
                            });
                            setState({
                              openDropdown: null,
                            });
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

            {/* <div>
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
            </div> */}
          </div>
        </aside>

        <section className="xl:col-span-4 space-y-6">
          <div className="sticky top-[75px] z-10">
            <div className="flex flex-wrap items-center justify-between gap-1 md:gap-4 px-2 py-2  bg-color1 border-gray  rounded-full border">
              <div className="flex items-center justify-between md:justify-normal gap-4 w-auto">
                {/* --------responsive filter sidebar start---------- */}

                <div className="xl:hidden">
                  <Sheet
                    open={state.sidebarOpen}
                    onOpenChange={(open) => setState({ sidebarOpen: open })}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray bg-transparent shadow-none px-2 "
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>

                    <SheetContent
                      side="left"
                      className="w-100 p-0 overflow-y-auto bg-color1 "
                    >
                      <div className="p-4">
                        <SheetHeader className="flex items-center justify-between">
                          <SheetTitle>{""}</SheetTitle>
                        </SheetHeader>

                        <div className="mt-4 space-y-6">
                          <SidebarContent
                            state={state}
                            handleChange={handleChange}
                            resetFilter={() => {
                              resetFilter();
                              setState((prev) => ({
                                ...prev,
                                sidebarOpen: true,
                              }));
                            }}
                            categoryList={categoryList}
                            locationList={locationList}
                            areaList={areaList}
                            projectList={projectList}
                            developerList={developerList}
                            floorPlanList={floorPlanList}
                            furnishingList={furnishingList}
                            listingTypeList={listingTypeList}
                            bedroomList={bedroomList}
                            parseINR={parseINR}
                            formatINR={formatINR}
                          />
                        </div>
                      </div>

                      <SheetFooter
                        className="sticky bottom-0 left-0  border-t cursor-pointer"
                        onClick={() => setState({ sidebarOpen: false })}
                      >
                        <div className="bg-color2 hover:bg-color2 py-5 px-3 text-white w-full text-center text-lg font-semibold">
                          View {properties.length} Properties
                        </div>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* --------responsive filter sidebar end---------- */}

                {/* <Link
                  href="/property-listmv"
                  className="no-underline hidden xl:block"
                >
                  <Button
                    variant="outline"
                    className="px-4 py-2 h-9  rounded-lg text-sm font-medium text-gray-600 hover:text-dred 
                      border-gray 
                      md:!border 
                      md:!border-theme 
                      hover:border-red-200 bg-transparent md:bg-white px-2 md:px-3 shadow-none"
                  >
                    <MapPinHouseIcon />
                    Map View
                  </Button>
                </Link> */}
                {/* <span className="text-sm text-gray-600"></span> */}

                    {  state.userLoggedIn &&
               (state.prefferedLocation == true ? ( 
               <Button
                  variant="outline"
                  className="px-4 py-2 h-8 rounded-2xl text-sm  
                      border-dred  bg-dred text-white
                      hover:bg-dred hover:text-white
                         px-2 md:px-3 shadow-none "
                  onClick={() => {
                    setState({
                      prefferedLocation: !state.prefferedLocation,
                    });
                  }}
                >
                  <MapPinHouseIcon />
                  Preffered Location
                </Button>
                ) :
                (
                   <Button
                  variant="outline"
                  className="px-4 py-2 h-8 rounded-2xl text-sm  text-dred 
                      border-dred hover:text-dred
                     
                      px-2 md:px-3 shadow-none "
                  onClick={() => {
                    setState({
                      prefferedLocation: !state.prefferedLocation,
                    });
                  }}
                >
                  <MapPinHouseIcon />
                  Preffered Location
                </Button>
                ))}
              </div>

              <div className="flex items-center gap-4 justify-between md:justify-normal  w-auto">
           

                <div className="flex items-center gap-2 hidden md:flex">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Sort by:
                  </span>
                  <Select
                    defaultValue="default"
                    onValueChange={(value) => {
                      let sortValue = "new"; // default
                      switch (value) {
                        case "price-low":
                          sortValue = "price";
                          break;
                        case "price-high":
                          sortValue = "-price";
                          break;
                        case "default":
                          sortValue = "";
                          break;
                        case "newest":
                          sortValue = "-created_at";
                          break;
                      }
                      handleChange("sort", sortValue);
                    }}
                  >
                    <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-auto text-sm font-medium text-gray-900">
                      <SelectValue placeholder="Newest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>

                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden sm:flex items-center gap-0 overflow-hidden md:bg-white/70 md:shadow-sm border-gray rounded-full">
                  <Button
                    onClick={() => setState({ view: "grid" })}
                    variant="ghost"
                    className={`px-2 md:px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors  ${
                      state.view === "grid"
                        ? "text-dred hover:text-dred hover:bg-transparent"
                        : "text-gray-600  hover:text-dred hover:bg-transparent"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Grid
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <Button
                    onClick={() => setState({ view: "list" })}
                    variant="ghost"
                    className={`pe-0 px-2 md:px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors ${
                      state.view === "list"
                        ? " text-dred hover:text-dred hover:bg-transparent"
                        : "text-gray-600  hover:text-dred hover:bg-transparent"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="w-full">
              <DeveloperCard variant="horizontal" />
            </div> */}
          </div>

          <ActiveFilters
            state={state}
            handleChange={handleChange}
            resetFilter={resetFilter}
            onClearPrice={() => setState({ priceMinInput: "", priceMaxInput: "" })}
            onClearSqft={() => setState({ sqftMin: "", sqftMax: "" })}
          />

          {loading ? (
            <div
              className={
                state.view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "flex flex-col gap-5"
              }
            >
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <PropertyCardSkeleton
                  key={`skeleton-${index}`}
                  view={state.view}
                  row={1}
                />
              ))}
            </div>
          ) : properties?.length === 0 ? (
            <div className="flex flex-col justify-center items-center w-full py-12">
              <svg
                className="w-20 h-20 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12a9 9 0 110-18 9 9 0 010 18zm0 0a9.001 9.001 0 008.154-14.856m0 0A9 9 0 1122.154 9.144m0 0a9.001 9.001 0 00-8.154 14.856"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Properties Available</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">We couldn&apos;t find any properties matching your criteria. Try adjusting your filters or search terms.</p>
              <Button
                className="bg-dred hover:bg-[#7d0c07] text-white px-6 py-2 rounded-lg"
                onClick={resetFilter}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={
                  state.view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 !gap-5"
                    : "flex flex-col !gap-5"
                }
              >
                {properties?.map((property: any, index: number) => (
                  <div
                    key={index}
                    ref={
                      index === properties.length - 1
                        ? lastPropertyElementRef
                        : null
                    }
                  >
                    <PropertyCard
                      property={property}
                      view={state.view}
                      list={properties}
                      updateList={(data) => updateList(data)}
                      onContactClick={(prop) => setState({ isMobileFormOpen: true, selectedProperty: prop })}
                    />
                  </div>
                ))}
              </div>

              {isLoadingMore && (
                <div
                  className={
                    state.view === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {Array.from({ length: skeletonCount }).map((_, index) => (
                    <PropertyCardSkeleton
                      key={`skeleton-${index}`}
                      view={state.view}
                      row={1}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Modal
        isOpen={state.isOpen}
        setIsOpen={() => setState({ isOpen: false })}
        title="More Filter"
        width="700px"
        renderComponent={() => <div>...same filter options...</div>}
      />

      <AnimatePresence>
        {state.isMobileFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ isMobileFormOpen: false })}
            />

            {/* Modal Wrapper */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4 "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ContactAgentForm
                data={state.selectedProperty}
                token={state.token}
                onClose={() => setState({ isMobileFormOpen: false })}
                industryClick={() => redirect()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
