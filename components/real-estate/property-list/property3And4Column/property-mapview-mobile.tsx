"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "@/components/common-components/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SlidersHorizontal,
  X,
  SearchIcon,
  RotateCcw,
  ChevronUp,
} from "lucide-react";
import { PropertyCard } from "./property-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSetState } from "@/utils/function.utils";
import PriceRangeSlider from "@/components/common-components/priceRange";
import { FURNISHING_TYPE } from "@/utils/constant.utils";
import { TextInput } from "@/components/common-components/textInput";
import { PropertyMapCardSkeleton } from "@/components/common-components/skeleton/PropertyMapCardSkeleton.component";
import GoogleMapPropertyList from "../../property-detail/gooleMapPropertyList.component";
import PropertyDetailInline from "../../property-detail/PropertyDetailInline.component";
import { Card, CardContent } from "@/components/ui/card";
export function MobileMapView(props) {
  const {
    properties = [],
    filters,
    loading,
    isFilterLoading,
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
    initialPropertyType,
    initialLocation,
    initialArea,
    initialDeveloper,
    initialFurnishingList,
  } = props;
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [state, setState] = useSetState({
    view: "grid",
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
    priceMinInput: "",
    priceMaxInput: "",
    minPrice: 0,
    maxPrice: 0,
    bedrooms: "",
    bathrooms: "",
    sqftMin: "",
    sqftMax: "",
    yearBuiltMin: "",
    yearBuiltMax: "",
    sort: null,
    isOpen: false,
  });
  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);
  const previousFiltersRef = useRef({});
  const observer = useRef<IntersectionObserver | null>(null);
  const propertyDetailRef = useRef<HTMLDivElement>(null);
  const lastPropertyElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && handNext) {
          loadMore(state);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, handNext, loadMore, state]
  );
  const resetFilters = () => {
    setState({
      search: "",
      listingStatus: "All",
      propertyType: [],
      furnishing: [],
      location: [],
      area: [],
      project: [],
      developer: [],
      floorPlan: [],
      priceRange: [minPrice, maxPrice],
      priceMinInput: "",
      priceMaxInput: "",
      bedrooms: "",
      bathrooms: "",
      sqftMin: "",
      sqftMax: "",
      yearBuiltMin: "",
      yearBuiltMax: "",
      isOpen: false,
    });
    previousFiltersRef.current = {};
    if (clearFilter) clearFilter();
  };
  useEffect(() => {
    if (initialLoadRef.current && minPrice > 0 && maxPrice > 0) {
      setState({ minPrice, maxPrice, priceRange: [minPrice, maxPrice] });
      initialLoadRef.current = false;
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setState({
      search: initialSearch || "",
      listingStatus: initialListingStatus || "All",
      propertyType: initialPropertyType || [],
      location: initialLocation || [],
      area: initialArea || [],
      developer: initialDeveloper || [],
      furnishing: initialFurnishingList || [],
    });
    const t = setTimeout(() => { initialLoadRef.current = false; }, 500);
    return () => clearTimeout(t);
  }, [initialSearch, initialListingStatus, initialPropertyType, initialLocation, initialArea, initialDeveloper, initialFurnishingList]);
  // Debounced filter values — exact same as desktop mapview
  const debouncedSearch = useDebounce(state.search, 500);
  const debouncedSqftMin = useDebounce(state.sqftMin, 500);
  const debouncedSqftMax = useDebounce(state.sqftMax, 500);
  const debouncedYearBuiltMin = useDebounce(state.yearBuiltMin, 500);
  const debouncedYearBuiltMax = useDebounce(state.yearBuiltMax, 500);
  const debouncedPriceMinInput = useDebounce(state.priceMinInput, 500);
  const debouncedPriceMaxInput = useDebounce(state.priceMaxInput, 500);

  // Auto-trigger filters + onFilterChange on every filter change — exact same logic as desktop
  useEffect(() => {
    if (initialLoadRef.current) return;
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);

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
      sqftMin: debouncedSqftMin,
      sqftMax: debouncedSqftMax,
      yearBuiltMin: debouncedYearBuiltMin,
      yearBuiltMax: debouncedYearBuiltMax,
      sort: state.sort,
      prefferedLocation: state.prefferedLocation,
      priceMinInput: debouncedPriceMinInput,
      priceMaxInput: debouncedPriceMaxInput,
    };

    const hasFiltersChanged =
      JSON.stringify(currentFilters) !== JSON.stringify(previousFiltersRef.current);

    if (hasFiltersChanged) {
      filterTimeoutRef.current = setTimeout(() => {
        filters(currentFilters);
        if (props.onFilterChange) props.onFilterChange(currentFilters);
        previousFiltersRef.current = currentFilters;
      }, 400);
    }

    return () => { if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current); };
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
    debouncedSqftMin,
    debouncedSqftMax,
    debouncedYearBuiltMin,
    debouncedYearBuiltMax,
    debouncedPriceMinInput,
    debouncedPriceMaxInput,
    state.prefferedLocation,
    state.sort,
  ]);

  useEffect(() => {
    if (state.selectedProperty && propertyDetailRef.current) {
      propertyDetailRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.selectedProperty]);
  useEffect(() => {
    if (properties.length > 0 && !isLoadingMore) {
      const lastElement = document.querySelector(
        ".property-item:last-child"
      ) as HTMLElement | null;
      if (lastElement) lastPropertyElementRef(lastElement);
    }
  }, [properties, isLoadingMore, lastPropertyElementRef]);
  // Lock body scroll when filter sheet is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [state.isOpen]);

  const handleChange = (name: string, value: any) => {
    setState({ [name]: value });
  };
  const formatINR = (value: number) => {
    if (isNaN(value)) return "";
    return value.toLocaleString("en-IN");
  };
  const parseINR = (value: string) => Number(value.replace(/,/g, ""));
  const handleFilter = () => {
    // useEffect auto-fires filters — just close the sheet
    setState({ isOpen: false });
  };

  const removeSelection = (key: string, value: any) => {
    setState({ [key]: (state[key] || []).filter((item: any) => item?.value !== value) });
  };

  const activeFilters = [
    ...(state.search ? [{ label: `"${state.search}"`, remove: () => setState({ search: "" }) }] : []),
    ...(state.listingStatus && state.listingStatus !== "All"
      ? [{ label: state.listingStatus, remove: () => setState({ listingStatus: "All" }) }]
      : []),
    ...(state.propertyType || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("propertyType", item.value),
    })),
    ...(state.location || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("location", item.value),
    })),
    ...(state.area || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("area", item.value),
    })),
    ...(state.developer || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("developer", item.value),
    })),
    ...(state.project || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("project", item.value),
    })),
    ...(state.floorPlan || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("floorPlan", item.value),
    })),
    ...(state.furnishing || []).map((item: any) => ({
      label: item.label, remove: () => removeSelection("furnishing", item.value),
    })),
    ...(state.priceMinInput || state.priceMaxInput
      ? [{ label: `₹${state.priceMinInput || "0"} – ₹${state.priceMaxInput || "Any"}`, remove: () => setState({ priceMinInput: "", priceMaxInput: "" }) }]
      : []),
    ...(state.bedrooms && state.bedrooms !== "Any"
      ? [{ label: `${state.bedrooms} Bed`, remove: () => setState({ bedrooms: "" }) }]
      : []),
    ...(state.sort
      ? [{ label: state.sort === "price" ? "Price ↑" : state.sort === "-price" ? "Price ↓" : "Newest", remove: () => setState({ sort: null }) }]
      : []),
  ];

  return (
    <div className="xl:hidden relative min-h-[calc(100dvh-65px)] bg-white overflow-hidden">
      {/* Full Map */}
      <div className="absolute inset-0">
        <GoogleMapPropertyList
          properties={properties}
          selectedProperties={state.selectedProperty}
        />
      </div>
      {/* Draggable Bottom Sheet */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          // Use drag distance, not the pointer's absolute screen position.
          if (info.offset.y < -60) {
            setOpen(true);
          } else if (info.offset.y > 60) {
            setOpen(false);
            setShowDetail(false);
          }
        }}
        animate={{ height: open ? "90dvh" : "35dvh" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden rounded-t-2xl bg-white shadow-lg"
        style={{ touchAction: "none" }}
      >
  {/* Drag handle */}
  <div
    className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 cursor-grab"
    onClick={() => setOpen(!open)}
  ></div>

  {!showDetail ? (
    <>
      {/* Property List */}
      <div className="px-4 flex items-center justify-between mb-2">
        <h2 className="section-in-ti">Properties Nearby</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-gray-700"
          onClick={() => setState({ isOpen: true })}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" /> Filter
        </Button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="px-4 mb-2 flex flex-wrap gap-1.5">
          {activeFilters.map((filter, index) => (
            <button
              key={`${filter.label}-${index}`}
              type="button"
              onClick={filter.remove}
              className="inline-flex items-center gap-1 rounded-full border border-dred/30 bg-red-50 px-2.5 py-1 text-xs font-medium text-dred"
            >
              {filter.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
          >
            Clear all
          </button>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <div className="space-y-3 px-4 mt-2">
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading || isFilterLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <PropertyMapCardSkeleton key={index} view="grid" row={1} />
            ))
          ) : properties?.map((property: any, index: number) => (
            <Card
              key={index}
              onClick={() => {
                setState({ selectedProperty: property });
                setShowDetail(true);
                setOpen(true); // fully open when detail is shown
              }}
              className="cursor-pointer border-none shadow-none transition"
            >
              {/* <CardContent className="p-0"> */}
                <PropertyCard
                  property={property}
                  view="grid"
                  handleClick={() => {
                    setState({ selectedProperty: property });
                    setShowDetail(true);
                    setOpen(true);
                  }}
                />
              {/* </CardContent> */}
            </Card>
          ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="relative min-h-0 flex-1 overflow-y-auto " ref={propertyDetailRef}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 -top-2"
        onClick={() => setShowDetail(false)}
      >
        <X className="w-5 h-5 text-gray-600" />
      </Button>
      <div className="flex items-start gap-2 ">
        <ChevronUp className="w-4 h-4 text-gray-400 mt-0.5 ms-4" />
        <p className="text-gray-500 text-sm pb-0">Swipe up for details</p>
      </div>

      {/* Property Detail */}
      <PropertyDetailInline
        id={state.selectedProperty?.id}
        handleClick={() => setShowDetail(false)}
        clickSimilarProperty={(data: any) =>
          setState({ selectedProperty: data })
        }
      />
    </div>
  )}
</motion.div>

      <AnimatePresence>
        {state.isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-[60] bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ isOpen: false })}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] flex flex-col rounded-t-3xl bg-white shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0 border-b">
                <h2 className="section-in-ti">Filter properties</h2>
                <button type="button" onClick={() => setState({ isOpen: false })} className="rounded-full p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                className="overflow-y-auto overscroll-contain flex-1 px-5 py-5"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="space-y-5">
                  {/* Search */}
                  <TextInput
                    placeholder="Search properties"
                    value={state.search}
                    onChange={(event) => handleChange("search", event.target.value)}
                  />

                  {/* Listing Status */}
                  <div>
                    <p className="mb-2 text-sm font-semibold">Listing status</p>
                    <div className="flex gap-2 flex-wrap">
                      {["All", ...((listingTypeList || []).map((o: any) => o.label))].map((option) => (
                        <button key={option} type="button" onClick={() => handleChange("listingStatus", option)}
                          className={`rounded-full border px-3 py-1.5 text-sm ${state.listingStatus === option ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  {categoryList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Property type</p>
                      <div className="flex flex-wrap gap-2">
                        {categoryList.map((option: any) => {
                          const selected = state.propertyType.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("propertyType", selected
                                ? state.propertyType.filter((item: any) => item.value !== option.value)
                                : [...state.propertyType, option])}
                              className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {locationList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Location</p>
                      <div className="flex flex-wrap gap-2">
                        {locationList.map((option: any) => {
                          const selected = state.location.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("location", selected
                                ? state.location.filter((item: any) => item.value !== option.value)
                                : [...state.location, option])}
                              className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Area */}
                  {areaList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Area</p>
                      <div className="flex flex-wrap gap-2">
                        {areaList.map((option: any) => {
                          const selected = state.area.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("area", selected
                                ? state.area.filter((item: any) => item.value !== option.value)
                                : [...state.area, option])}
                              className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Developer */}
                  {developerList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Developer</p>
                      <div className="flex flex-wrap gap-2">
                        {developerList.map((option: any) => {
                          const selected = state.developer.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("developer", selected
                                ? state.developer.filter((item: any) => item.value !== option.value)
                                : [...state.developer, option])}
                              className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  {projectList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Project</p>
                      <div className="flex flex-wrap gap-2">
                        {projectList.map((option: any) => {
                          const selected = state.project.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("project", selected
                                ? state.project.filter((item: any) => item.value !== option.value)
                                : [...state.project, option])}
                              className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Budget */}
                  <div>
                    <p className="mb-2 text-sm font-semibold">Budget</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Min budget" inputMode="numeric" value={state.priceMinInput} onChange={(event) => handleChange("priceMinInput", event.target.value)} />
                      <Input placeholder="Max budget" inputMode="numeric" value={state.priceMaxInput} onChange={(event) => handleChange("priceMaxInput", event.target.value)} />
                    </div>
                  </div>

                  {/* Unit Configuration / Floor Plan */}
                  {floorPlanList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Unit configuration</p>
                      <div className="flex flex-wrap gap-2">
                        {floorPlanList.map((option: any) => {
                          const selected = state.floorPlan.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("floorPlan", selected
                                ? state.floorPlan.filter((item: any) => item.value !== option.value)
                                : [...state.floorPlan, option])}
                              className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${selected ? "border-dred text-dred bg-red-50" : "border-gray-300 text-gray-700 bg-white"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bedrooms */}
                  {bedroomList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Bedrooms</p>
                      <div className="flex flex-wrap gap-2">
                        {["Any", ...bedroomList].map((option: any) => (
                          <button key={option} type="button"
                            onClick={() => handleChange("bedrooms", option === "Any" ? "" : option)}
                            className={`rounded-full border px-3 py-1.5 text-sm ${
                              (option === "Any" && !state.bedrooms) || state.bedrooms === option
                                ? "border-dred bg-red-50 text-dred"
                                : "border-gray-200"
                            }`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Furnishing */}
                  {furnishingList.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Furnishing</p>
                      <div className="flex flex-wrap gap-2">
                        {furnishingList.map((option: any) => {
                          const selected = state.furnishing.some((item: any) => item.value === option.value);
                          return (
                            <button key={option.value} type="button"
                              onClick={() => handleChange("furnishing", selected
                                ? state.furnishing.filter((item: any) => item.value !== option.value)
                                : [...state.furnishing, option])}
                              className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-dred bg-red-50 text-dred" : "border-gray-200"}`}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>{/* end scrollable */}

              {/* Fixed footer — always visible, never scrolls away */}
              <div className="flex-shrink-0 grid grid-cols-2 gap-3 px-5 py-4 border-t bg-white">
                <Button variant="outline" onClick={resetFilters}>Clear all</Button>
                <Button className="bg-color2 hover:bg-color2" onClick={handleFilter}>Show properties</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
