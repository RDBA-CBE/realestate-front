import { PropertyCard } from "./property-card";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import FilterDropdown from "../../FilterDropdown.component";
import Modal from "@/components/common-components/modal";
import { useSetState } from "@/utils/function.utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import useDebounce from "@/components/common-components/useDebounce";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";
import PriceRangeSlider from "@/components/common-components/priceRange";
import { FURNISHING_TYPE } from "@/utils/constant.utils";
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

export function PropertyView(props: any) {
  const {
    properties,
    title = "List View",
    filters,
    loading,
    isLoadingMore,
    handNext,
    loadMore,
    categoryList,
    minPrice,
    maxPrice,
    updateList,
    clearFilter,
  } = props;

  const [state, setState] = useSetState({
    isOpen: false,
    search: "",
    listingStatus: "",
    propertyType: [],
    furnishing: [],
    priceRange: [0, 0],
    minPrice: 0,
    maxPrice: 0,
    bedrooms: "",
    bathrooms: "",
    location: "",
    sqftMin: "",
    sqftMax: "",
    yearBuiltMin: "",
    yearBuiltMax: "",
    view: "grid",
    sort: null,
  });

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);
  const previousFiltersRef = useRef({});

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
    [isLoadingMore, handNext, loadMore]
  );

  useEffect(() => {
    if (initialLoadRef.current && minPrice > 0 && maxPrice > 0) {
      setState({
        minPrice,
        maxPrice,
        priceRange: [minPrice, maxPrice],
      });
      initialLoadRef.current = false;
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
  const debouncedYearBuiltMax = useDebounce(state.yearBuiltMax, 500);
  const debouncedPriceRange = useDebounce(state.priceRange, 500);
  const debouncedMinPrice = useDebounce(state.minPrice, 500);
  const debouncedMaxPrice = useDebounce(state.maxPrice, 500);

  // useEffect(() => {
  //   filters({ ...state, ...debouncedState });
  // }, [
  //   state.listingStatus,
  //   state.propertyType,
  //   state.bedrooms,
  //   state.bathrooms,
  //   state.location,
  //   state.furnishing,
  //   debouncedState.search,
  //   debouncedState.priceRange,
  //   debouncedState.minPrice,
  //   debouncedState.maxPrice,
  //   debouncedState.sqftMin,
  //   debouncedState.sqftMax,
  //   debouncedState.yearBuiltMin,
  //   debouncedState.yearBuiltMax,
  //   state.sort,
  // ]);

  useEffect(() => {
    // Skip initial load
    if (initialLoadRef.current) {
      return;
    }

    // Clear any existing timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    // Create current filter object
    const currentFilters = {
      listingStatus: state.listingStatus,
      propertyType: state.propertyType,
      bedrooms: state.bedrooms,
      bathrooms: state.bathrooms,
      location: state.location,
      furnishing: state.furnishing,
      search: debouncedSearch,
      priceRange: state.priceRange,
      sqftMin: debouncedSqftMin,
      sqftMax: debouncedSqftMax,
      yearBuiltMin: debouncedYearBuiltMin,
      yearBuiltMax: debouncedYearBuiltMax,
      sort: state.sort,
    };

    // Check if filters actually changed
    const hasFiltersChanged =
      JSON.stringify(currentFilters) !==
      JSON.stringify(previousFiltersRef.current);

    if (hasFiltersChanged) {
      filterTimeoutRef.current = setTimeout(() => {
        filters(currentFilters);
        previousFiltersRef.current = currentFilters;
      }, 400); // Increased debounce time
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
    state.furnishing,
    debouncedSearch,
    state.priceRange,
    debouncedSqftMin,
    debouncedSqftMax,
    debouncedYearBuiltMin,
    debouncedYearBuiltMax,
    state.sort,
    filters,
    debouncedPriceRange,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  const handleChange = (name, value) => {
    setState({ [name]: value });
  };

  //   const handleChange = (name: string, value: any) => {
  //   setState((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const resetFilter = () => {
    setState({
      search: "",
      listingStatus: "",
      propertyType: [],
      priceRange: [minPrice, maxPrice],
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
      sqftMin: "",
      sqftMax: "",
      yearBuiltMin: "",
      yearBuiltMax: "",
    });
    previousFiltersRef.current = {};

    // Call parent clear filter
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="xl:max-w-[110rem] max-w-[85rem] mx-auto p-6"
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start min-h-screen">
        <aside className="space-y-6 lg:col-span-1 xl:sticky md:top-16 lg:top-16  hidden xl:block ">
          <div className="p-4 pb-8 border rounded-lg space-y-6 bg-gray-100 border-none h-[91vh] overflow-auto thin-scrollbar">
            <div className="w-full flex justify-end">
              <Button
                onClick={() => resetFilter()}
                variant="ghost"
                className="text-sm text-gray-500 underline flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

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
                  setState({ priceRange: val });
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
                      const newMax = Math.max(
                        newMin,
                        state.priceRange?.[1] ?? 0
                      );
                      const updated = [newMin, newMax];
                      handleChange("priceRange", updated);
                      setState({ priceRange: updated });
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
                      const newMin = Math.min(
                        newMax,
                        state.priceRange?.[0] ?? 0
                      );
                      const updated = [newMin, newMax];
                      handleChange("priceRange", updated);
                      setState({ priceRange: updated });
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
                      checked={state.furnishing.some(
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
              <div className="mb-2 font-semibold text-gray-900">
                Square Feet
              </div>
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
        </aside>

        <section className="xl:col-span-3 space-y-6">
          <div className="sticky top-16 z-10">
            <div className="flex flex-wrap items-center justify-between gap-1 md:gap-4 p-4 bg-gray-100 border-none rounded-lg border shadow-sm">
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
                        className="flex items-center gap-2 border-none bg-transparent shadow-none px-0 "
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>

                    <SheetContent
                      side="left"
                      className="w-100 p-0 overflow-y-auto bg-gray-100 "
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
                            parseINR={parseINR}
                            formatINR={formatINR}
                          />
                        </div>
                      </div>

                      <SheetFooter
                        className="sticky bottom-0 left-0  border-t cursor-pointer"
                        onClick={()=>setState({ sidebarOpen: false })}
                      >
                        <div className="bg-red-600 hover:bg-red-500 py-5 px-3 text-white w-full text-center text-lg font-semibold">
                          View {properties.length} Properties
                        </div>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* --------responsive filter sidebar end---------- */}

                <Link href="/property-listmv" className="no-underline hidden xl:block">
                  <Button
                    variant="outline"
                    className="px-4 py-2 h-9 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 
                      border-none 
                      md:border 
                      md:border-gray-300 
                      hover:border-red-200 bg-transparent md:bg-white px-0 md:px-3 shadow-none md:shadow-sm"
                  >
                    <MapPinHouseIcon />
                    Map View
                  </Button>
                </Link>
                {/* <span className="text-sm text-gray-600"></span> */}
              </div>

              <div className="flex items-center gap-4 justify-between md:justify-normal  w-auto">
                <div className="flex items-center gap-2">
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
                          sortValue = "created_at";
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

                <div className="hidden sm:flex items-center gap-0 rounded-md overflow-hidden md:bg-white/70 md:shadow-sm">
                  <Button
                    onClick={() => setState({ view: "grid" })}
                    variant="ghost"
                    className={`px-2 md:px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors ${
                      state.view === "grid"
                        ? "text-red-600 hover:text-red-600 hover:bg-transparent"
                        : "text-gray-600  hover:text-red-600 hover:bg-transparent"
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
                        ? " text-red-600 hover:text-red-600 hover:bg-transparent"
                        : "text-gray-600  hover:text-red-600 hover:bg-transparent"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div
              className={
                state.view === "grid"
                  ? "flex flex-wrap gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {properties?.map((property: any, index: number) => (
                <div
                  key={index}
                  className={
                    state.view === "grid"
                      ? "flex-1 min-w-[300px] md:min-w-[calc(33.333%-1rem)]"
                      : "w-full"
                  }
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
                  />
                </div>
              ))}
            </div>
          ) : properties?.length == 0 ? (
            <div className="flex flex-col justify-center items-center w-full ">
              <img
                src="/assets/images/not_founds.jpg"
                alt="No Property Found"
                className="w-65 h-auto mb-4"
              />
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
    </motion.div>
  );
}
