import { PropertyCard } from "./property-card";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
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
  Search,
  Search as SearchIcon,
  Loader,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  MapPinHouseIcon,
  ChevronDown,
  X,
  ListCollapseIcon,
  LayoutGrid,
} from "lucide-react";
import FilterDropdown from "../../FilterDropdown.component";
import Modal from "@/components/common-components/modal";
import { getPriceLabel, truncateText, useSetState } from "@/utils/function.utils";
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
import { FilterListPopup, PopupPortal } from "./FilterListPopup";
import { useRouter } from "next/navigation";
import Models from "@/imports/models.import";
import CustomMultiSelect from "@/components/common-components/multi-select";
import { Dropdown, Success, Failure } from "@/utils/function.utils";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

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
    initialArea,
    initialFurnishingList,
    propertyTypeFilter,
    onFilterChange,
    isFilterLoading = false,
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
    openPriceDropdown: null,
    openDropdown: null,
    isMobileFormOpen: false,
    selectedProperty: null,
    showAllLocations: false,
    showAllArea: false,
    showAllDeveloper: false,
    showAllProject: false,
    activePopup: null as string | null,
    popupPos: { left: 0, top: 0 },
    userPreferredLocations: [] as any[],
    showNoPreferredModal: false,
    showChooseLocationModal: false,
    chooseLocation: [] as string[],
    locationList: [] as any[],
    userId: null as string | null,
  });

  const [filterPopupPos, setFilterPopupPos] = useState<Record<string, { left: number; top: number }>>({});

  // console.log("state", state); // Commented out for cleaner console

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);
  const previousFiltersRef = useRef({});
  const priceFloorRef = useRef(0);
  const priceCeilingRef = useRef(0);
  const isResettingRef = useRef(false);
  const hasBeenClearedRef = useRef(false);
  const dropdownRef = useRef(null);
  const sqftDropdownRef = useRef(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const alphabetRefs = useRef<Record<string, HTMLElement | null>>({});

  const areaSectionRef = useRef<HTMLDivElement>(null);
  const developerSectionRef = useRef<HTMLDivElement>(null);
  const projectSectionRef = useRef<HTMLDivElement>(null);

  // one ref map for all filter section anchors
  const filterSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});


  useEffect(() => {
    if (state.isMobileFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [state.isMobileFormOpen]);





  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) {
        setState({ openPriceDropdown: null });
      }
      if (sqftDropdownRef.current && !(sqftDropdownRef.current as any).contains(e.target)) {
        setState({ openDropdown: null });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setState({ userLoggedIn: !!token, userId });
    if (token && userId) {
      fetchUserPreferredLocations(userId);
    }
    fetchLocationList();
  }, []);

  const fetchUserPreferredLocations = async (userId: string) => {
    try {
      const res: any = await Models.user.details(userId);
      const preferred = res?.preferred_locations || [];
      setState({ userPreferredLocations: preferred });
    } catch (error) {
      console.log("error fetching user preferred locations", error);
    }
  };

  const fetchLocationList = async () => {
    try {
      const res: any = await Models.dropdowns.city(1, {});
      setState({ locationList: Dropdown(res?.results, "name") });
    } catch (error) {
      console.log("error fetching location list", error);
    }
  };

  const handlePreferredLocationClick = () => {
    if (state.userPreferredLocations?.length > 0) {
      setState({ prefferedLocation: !state.prefferedLocation });
    } else {
      setState({ showNoPreferredModal: true });
    }
  };

  const handleSavePreferredLocation = async () => {
    try {
      await Models.user.update({ preferred_locations: state.chooseLocation }, state.userId);
      Success("Preferred Locations Updated");
      setState({ showChooseLocationModal: false, showNoPreferredModal: false });
      await fetchUserPreferredLocations(state.userId);
      setState({ prefferedLocation: true });
    } catch (error) {
      Failure("Failed to update preferred locations");
    }
  };


  
  

  useEffect(() => {
    if (propertyTypeFilter) setState({ propertyType: propertyTypeFilter });
    if (initialSearch) setState({ search: initialSearch });
    setState({ listingStatus: initialListingStatus || "All" });
    setState({ location: initialLocation || [] });
    setState({ developer: initialDeveloper || [], furnishing: initialFurnishingList || [] });
    if (initialArea?.length && !hasBeenClearedRef.current) setState({ area: initialArea });

    // Ensure propertyType is handled as an array (it might be a string from URL)
    if (initialPropertyType) {
      const typeArray = Array.isArray(initialPropertyType)
        ? initialPropertyType
        : [initialPropertyType];
      setState({ propertyType: typeArray });
    }

    // Mark initial load done after all initial props are applied
    const t = setTimeout(() => { initialLoadRef.current = false; }, 500);
    return () => clearTimeout(t);
  }, [
    propertyTypeFilter,
    initialSearch,
    initialListingStatus,
    initialLocation,
    initialPropertyType,
    initialDeveloper,
    initialArea,
    initialFurnishingList,
  ]);

  // Reconcile selected filters against updated dynamic filter lists
  // When dynamic filters update (e.g. selecting Coimbatore removes Agricultural from categoryList),
  // remove any selected items that no longer exist in the updated lists
  useEffect(() => {
    if (initialLoadRef.current) return;

    const reconcile = (selected: any[], list: any[]) => {
      if (!selected?.length || !list?.length) return selected;
      const validValues = new Set(list.map((i) => i.value));
      return selected.filter((i) => validValues.has(i.value));
    };

    const updates: any = {};

    if (categoryList?.length) {
      const next = reconcile(state.propertyType, categoryList);
      if (next.length !== state.propertyType.length) updates.propertyType = next;
    }
    if (locationList?.length) {
      const next = reconcile(state.location, locationList);
      if (next.length !== state.location.length) updates.location = next;
    }
    if (areaList?.length) {
      const next = reconcile(state.area, areaList);
      if (next.length !== state.area.length) updates.area = next;
    }
    if (developerList?.length) {
      const next = reconcile(state.developer, developerList);
      if (next.length !== state.developer.length) updates.developer = next;
    }
    if (projectList?.length) {
      const next = reconcile(state.project, projectList);
      if (next.length !== state.project.length) updates.project = next;
    }
    if (floorPlanList?.length) {
      const next = reconcile(state.floorPlan, floorPlanList);
      if (next.length !== state.floorPlan.length) updates.floorPlan = next;
    }
    if (furnishingList?.length) {
      const next = reconcile(state.furnishing, furnishingList);
      if (next.length !== state.furnishing.length) updates.furnishing = next;
    }

    if (Object.keys(updates).length > 0) setState(updates);
  }, [categoryList, locationList, areaList, developerList, projectList, floorPlanList, furnishingList]);
  

  // Resolve string-based property types (names from URL) to objects with IDs once categoryList is loaded
  useEffect(() => {
    if (categoryList?.length > 0 && state.propertyType?.length > 0) {
      const hasStrings = state.propertyType.some((t: any) => typeof t === "string");
      if (hasStrings) {
        const resolved = state.propertyType.map((item: any) => {
          if (typeof item === "string") {
            return categoryList.find((cat) => cat.label.toLowerCase() === item.toLowerCase());
          }
          return item;
        }).filter(Boolean);
        if (resolved.length > 0) setState({ propertyType: resolved });
      }
    }
  }, [categoryList, state.propertyType]);

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
      sqftMin: debouncedSqftMin,
      sqftMax: debouncedSqftMax,
      yearBuiltMin: debouncedYearBuiltMin,
      yearBuiltMax: debouncedYearBuiltMax,
      sort: state.sort,
      prefferedLocation: state.prefferedLocation,
      priceMinInput: debouncedPriceMinInput,
      priceMaxInput: debouncedPriceMaxInput,
    };


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
    debouncedSqftMin,
    debouncedSqftMax,
    debouncedYearBuiltMin,
    debouncedYearBuiltMax,
    debouncedPriceMinInput,
    debouncedPriceMaxInput,
    state.prefferedLocation,
    state.sort,
  ]);

  const isMobile = useIsMobile();

  const calcPopupPos = (key: string, ref: React.RefObject<HTMLDivElement>) => {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setFilterPopupPos((prev) => ({ ...prev, [key]: { left: rect.left, top: rect.bottom + 8 } }));
    }
  };

  const openPopup = (key: string) => {
    const el = filterSectionRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      setState({ activePopup: key, popupPos: { left: rect.left, top: rect.top + 8 } });
    } else {
      setState({ activePopup: key, popupPos: { left: 0, top: 0 } });
    }
  };

  const closePopup = () => setState({ activePopup: null });

  const handleChange = (name, value) => {
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

    hasBeenClearedRef.current = true;
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
            <h3 className="mb-2 font-semibold text-gray-900">Filters</h3>
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

            {/* <TextInput
              placeholder="What are you looking for?"
              value={state.search}
              onChange={(e) => handleChange("search", e.target.value)}
            /> */}

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
                    className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="listingStatus"
                        checked={state.listingStatus === option.label}
                        onChange={() => handleChange("listingStatus", option.label)}
                      />
                      {option.label}
                    </div>
                    {option.count !== undefined && (
                      <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                    )}
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
                      className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
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
                      </div>
                      {option.count !== undefined && (
                        <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {locationList.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">Location</div>
                <div className="space-y-2" ref={locationSectionRef}>
                  {(locationList || []).slice(0, 5).map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
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
                      </div>
                      {option.count !== undefined && (
                        <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                      )}
                    </label>
                  ))}

                  {locationList && locationList?.length > 5 && (
                    <div className="relative mt-2">
                      <button
                        onClick={() => { setState({ showAllLocations: true }); setTimeout(() => calcPopupPos("location", locationSectionRef), 0); }}
                        className="text-xs font-medium flex items-center gap-1 text-dred w-full rounded-full px-3 ps-5"
                      >
                        View more
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <FilterListPopup
              open={state.showAllLocations}
              onClose={() => setState({ showAllLocations: false })}
              title="Location"
              items={locationList}
              selected={state.location}
              onChange={(updated) => handleChange("location", updated)}
              anchorPos={filterPopupPos["location"] ?? { left: 0, top: 0 }}
              isMobile={isMobile}
              showAlphabetNav
            />
            {areaList.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">Area</div>
                <div className="space-y-2" ref={areaSectionRef}>
                  {(areaList || []).slice(0, 5).map((option) => (
                    <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="cursor-pointer"
                          checked={state.area.some((t) => t.value === option.value)}
                          onChange={(e) => handleChange("area", e.target.checked ? [...state.area, option] : state.area.filter((t) => t.value !== option.value))}
                        />
                        <span>{option.label}</span>
                      </div>
                      {option.count !== undefined && (
                        <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                      )}
                    </label>
                  ))}
                  {areaList.length > 5 && (
                    <button
                      onClick={() => { setState({ showAllArea: true }); setTimeout(() => calcPopupPos("area", areaSectionRef), 0); }}
                      className="text-xs font-medium flex items-center gap-1 text-dred w-full rounded-full px-3 ps-5"
                    >
                      View more
                    </button>
                  )}
                </div>
              </div>
            )}

            <FilterListPopup
              open={state.showAllArea}
              onClose={() => setState({ showAllArea: false })}
              title="Area"
              items={areaList}
              selected={state.area}
              onChange={(updated) => handleChange("area", updated)}
              anchorPos={filterPopupPos["area"] ?? { left: 0, top: 0 }}
              isMobile={isMobile}
              showAlphabetNav
            />

            {developerList?.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">Developer</div>
                <div className="space-y-2" ref={developerSectionRef}>
                  {(developerList || []).slice(0, 5).map((option) => (
                    <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="cursor-pointer"
                          checked={state.developer.some((t) => t.value === option.value)}
                          onChange={(e) => handleChange("developer", e.target.checked ? [...state.developer, option] : state.developer.filter((t) => t.value !== option.value))}
                        />
                        <span className="  block" title={option.label}>{truncateText(option.label, 22)}</span>
                      </div>
                      {option.count !== undefined && (
                        <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                      )}
                    </label>
                  ))}
                  {developerList.length > 5 && (
                    <button
                      onClick={() => { setState({ showAllDeveloper: true }); setTimeout(() => calcPopupPos("developer", developerSectionRef), 0); }}
                      className="text-xs font-medium flex items-center gap-1 text-dred w-full rounded-full px-3 ps-5"
                    >
                      View more
                    </button>
                  )}
                </div>
              </div>
            )}

            <FilterListPopup
              open={state.showAllDeveloper}
              onClose={() => setState({ showAllDeveloper: false })}
              title="Developer"
              items={developerList}
              selected={state.developer}
              onChange={(updated) => handleChange("developer", updated)}
              anchorPos={filterPopupPos["developer"] ?? { left: 0, top: 0 }}
              isMobile={isMobile}
              showAlphabetNav
            />

            {projectList.length > 0 && (
              <div>
                <div className="mb-2 font-semibold text-gray-900">Project</div>
                <div className="space-y-2" ref={projectSectionRef}>
                  {(projectList || []).slice(0, 5).map((option) => (
                    <label key={option.value} className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="cursor-pointer"
                          checked={state.project.some((t) => t.value === option.value)}
                          onChange={(e) => handleChange("project", e.target.checked ? [...state.project, option] : state.project.filter((t) => t.value !== option.value))}
                        />
                        <span>{option.label}</span>
                      </div>
                      {option.count  && (
                        <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                      )}
                    </label>
                  ))}
                  {projectList.length > 5 && (
                    <button
                      onClick={() => { setState({ showAllProject: true }); setTimeout(() => calcPopupPos("project", projectSectionRef), 0); }}
                      className="text-xs font-medium flex items-center gap-1 text-dred w-full rounded-full px-3 ps-5"
                    >
                      View more
                    </button>
                  )}
                </div>
              </div>
            )}

            <FilterListPopup
              open={state.showAllProject}
              onClose={() => setState({ showAllProject: false })}
              title="Project"
              items={projectList}
              selected={state.project}
              onChange={(updated) => handleChange("project", updated)}
              anchorPos={filterPopupPos["project"] ?? { left: 0, top: 0 }}
              isMobile={isMobile}
              showAlphabetNav
            />
            <div ref={dropdownRef}>
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
        w-full px-2 py-1 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
                  >
                    <span className="whitespace-nowrap text-sm">
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
                    <div className="absolute z-50 bottom-full mb-2 min-w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto">
                      <button
                        className="w-full px-2 py-1 text-left hover:bg-gray-100"
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
                          className="w-full px-2 py-3 text-left hover:bg-gray-100"
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
        w-full px-2 py-1 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
                  >
                    <span className="whitespace-nowrap text-sm">
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
                    <div className="absolute z-50 bottom-full mb-2 min-w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto">
                      <button
                        className="w-full px-5 py-3 text-left hover:bg-gray-100 whitespace-nowrap"
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
                          className="w-full px-5 py-3 text-left hover:bg-gray-100 whitespace-nowrap"
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


            {/* <div>
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
            </div> */}

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
                    className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={state.furnishing.some(
                          (t) => t.value === option.value,
                        )}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...state.furnishing, option]
                            : state.furnishing.filter((t) => t.value !== option.value);
                          handleChange("furnishing", updated);
                        }}
                      />
                      <span>{option?.label}</span>
                    </div>
                    {option.count !== undefined && (
                      <span className="text-[11px] bg-dred/10 text-black rounded-full px-[8px] py-[1.6px]">{option.count}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div ref={sqftDropdownRef}>
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
        w-full px-2 py-1 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
                  >
                    <span className="whitespace-nowrap text-sm">{state.sqftMin || "No min"}</span>

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        state.openDropdown === "min" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {state.openDropdown === "min" && (
                    <div
                    className="absolute z-50 bottom-full mb-2 min-w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto"
                  >
                      <button
                        className="w-full px-2 py-3 text-left hover:bg-gray-100"
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
                          className="w-full px-2 py-3 text-left hover:bg-gray-100"
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
        w-full px-2 py-1 rounded-full
        border border-gray-300 bg-white
        flex items-center justify-between
        text-gray-700
      "
                  >
                    <span className="whitespace-nowrap text-sm">{state.sqftMax || "No max"}</span>

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        state.openDropdown === "max" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {state.openDropdown === "max" && (
                  <div
                  className="absolute z-50 bottom-full mb-2 min-w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto"
                >
                      <button
                        className="w-full px-2 py-3 text-left hover:bg-gray-100"
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
                          className="w-full px-5 py-3 text-left hover:bg-gray-100 whitespace-nowrap"
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

        <section className="xl:col-span-4 space-y-2 xl:space-y-6">
          <div className="sticky top-[75px] z-50">
            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 px-2 py-1.5 bg-color1 border-gray rounded-full border shadow-sm">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dred z-10" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={state.search}
                  onChange={(e) => handleChange("search", e.target.value)}
                  className="pl-11 h-8 md:h-10 border-none  rounded-full shadow-none focus-visible:outline-none focus-visible:ring-0 w-full "
                />
              </div>
            
              <div className="hidden md:flex items-center justify-between md:justify-normal gap-4 w-full sm:w-auto">
                {/* --------responsive filter sidebar start---------- */}

                

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
                  className="px-2 py-1 h-6.5 rounded-2xl text-xs  
                      border-dred  bg-dred text-white
                      hover:bg-dred hover:text-white
                         shadow-none "
                  onClick={handlePreferredLocationClick}
                >
                  <MapPinHouseIcon />
                  Preffered Location
                </Button>
                ) :
                (
                   <Button
                  variant="outline"
                  className="px-2 py-1 h-6.5 rounded-2xl text-xs bg-[#fff6f6]  text-dred 
                      border-dred hover:text-dred
                     
                      shadow-none "
                  onClick={handlePreferredLocationClick}
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

                <div className="hidden sm:flex items-center gap-2 overflow-hidden pe-3">
                  <Button
                    onClick={() => setState({ view: "grid" })}
                    variant="ghost"
                    className={`px-2 md:px-2 h-8 text-sm font-medium flex items-center gap-1 transition-colors  ${
                      state.view === "grid"
                        ? "text-white bg-dred hover:bg-dred hover:text-white"
                        : "text-gray-600  hover:text-dred hover:bg-transparent"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <Button
                    onClick={() => setState({ view: "list" })}
                    variant="ghost"
                    className={` px-2 md:px-2 h-8 text-sm font-medium flex items-center gap-1 transition-colors ${
                      state.view === "list"
                        ? " text-white bg-dred hover:bg-dred hover:text-white"
                        : "text-gray-600  hover:text-dred hover:bg-transparent"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="w-full">
              <DeveloperCard variant="horizontal" />
            </div> */}

            
          </div>

          <div className=" flex xl:hidden items-center justify-between gap-4 w-full">
                {/* --------responsive filter sidebar start---------- */}

                <div className="xl:hidden">
                  <Sheet
                    open={state.sidebarOpen}
                    onOpenChange={(open) => setState({ sidebarOpen: open })}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-none bg-transparent shadow-none px-2  "
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>

                    <SheetContent
                      side="left"
                      className="w-full max-w-full sm:w-[92vw] sm:max-w-[440px] p-0 overflow-y-auto overflow-x-hidden bg-color1"
                      onPointerDownOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('[data-filter-popup]')) e.preventDefault();
                      }}
                      onInteractOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('[data-filter-popup]')) e.preventDefault();
                      }}
                      onFocusOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('[data-filter-popup]')) e.preventDefault();
                      }}
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
                  className="flex md:hidden px-2 py-1 h-6.5 rounded-2xl text-xs  
                      border-dred  bg-dred text-white
                      hover:bg-dred hover:text-white
                        shadow-none "
                  onClick={handlePreferredLocationClick}
                >
                  <MapPinHouseIcon />
                  Preffered Location
                </Button>
                ) :
                (
                   <Button
                  variant="outline"
                  className="flex md:hidden px-2 py-1 h-6.5 rounded-2xl text-xs bg-[#fff6f6]  text-dred 
                      border-dred hover:text-dred
                     shadow-none "
                  onClick={handlePreferredLocationClick}
                >
                  <MapPinHouseIcon />
                  Preffered Location
                </Button>
                ))}
          </div>

              
            

        

          <ActiveFilters
            state={state}
            handleChange={handleChange}
            resetFilter={resetFilter}
            onClearPrice={() => setState({ priceMinInput: "", priceMaxInput: "" })}
            onClearSqft={() => setState({ sqftMin: "", sqftMax: "" })}
          />

          {/* Initial load skeleton — only when no properties yet */}
          {loading && properties?.length === 0 ? (
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
          ) : properties?.length === 0 && !loading ? (
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
                  `transition-opacity duration-200 ${(loading || isFilterLoading) ? "opacity-50 pointer-events-none" : "opacity-100"} ` +
                  (state.view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 !gap-5"
                    : "flex flex-col !gap-5")
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

      {/* No Preferred Location Info Modal */}
      <AnimatePresence>
        {state.showNoPreferredModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ showNoPreferredModal: false })}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 py-8 px-5 flex flex-col items-center text-center ]">
                <div className="w-14 h-14 rounded-full bg-[#fff6f6] flex items-center justify-center">
                  <MapPinHouseIcon className="w-7 h-7 text-dred" />
                </div>
                <h3 className="text-lg text-black">No Preferred Location</h3>
                <p className="text-sm text-[#383838] ">You don&apos;t have any preferred location set.</p>
                <div className="flex gap-3 w-full mt-5">
                  <button
                    className="flex-1 py-2 px-3 rounded-xl border border-gray-300 text-gray-600 text-sm "
                    onClick={() => setState({ showNoPreferredModal: false })}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 px-3 rounded-xl bg-dred text-white text-sm "
                    onClick={() => setState({ showNoPreferredModal: false, showChooseLocationModal: true, chooseLocation: [] })}
                  >
                    Choose Preferred Location
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Choose Preferred Location Modal */}
      <AnimatePresence>
        {state.showChooseLocationModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ showChooseLocationModal: false })}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg  text-black">Choose Preferred Location</h3>
                  <button onClick={() => setState({ showChooseLocationModal: false })} className="mt-[-40px]">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <CustomMultiSelect
                  className="border border-gray-200 bg-white"
                  options={state.locationList}
                  value={state.chooseLocation}
                  onChange={(value) => setState({ chooseLocation: value })}
                  placeholder="Select location"
                  isMulti={true}
                  loadOptions={({ search }) => fetchLocationList()}
                />
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm "
                    onClick={() => setState({ showChooseLocationModal: false })}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 rounded-xl bg-dred text-white text-sm "
                    onClick={handleSavePreferredLocation}
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
