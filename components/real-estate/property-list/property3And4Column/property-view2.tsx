import { PropertyCard } from "./property-card";
import { useEffect, useState, useRef, useCallback } from "react";
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
  Sidebar,
  Filter,
  X,
  ChevronDown,
  List,
  Grid,
} from "lucide-react";

import Modal from "@/components/common-components/modal";
import { useSetState } from "@/utils/function.utils";

import useDebounce from "@/components/common-components/useDebounce";

import { PropertyCardSkeleton } from "../../../common-components/skeleton/PropertyCardSkeleton.componenet";

import { FilterPopup } from "../../FilterPopup.component";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function PropertyView2(props: any) {
  const {
    properties,
    title = "List View",
    filters,
    loading,
    isLoadingMore,
    handNext,
    loadMore,
  } = props;

  const [state, setState] = useSetState({
    isOpen: false,
    search: "",
    listingStatus: "",
    propertyType: [],
    priceRange: [0, 50000000], // Changed to match your slider max
    minPrice: 0, // Add initial minPrice
    maxPrice: 50000000, // Add initial maxPrice
    bedrooms: "",
    bathrooms: "",
    location: "",
    sqftMin: "",
    sqftMax: "",
    yearBuiltMin: "",
    yearBuiltMax: "",
    view: "grid",
    popoverOpen: false,
  });
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

  // Disable background scroll when modal is open
    useEffect(() => {
      if (state.modalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }, [state.modalOpen]);

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

  useEffect(() => {
    filters({ ...state, ...debouncedState });
  }, [
    state.listingStatus,
    state.propertyType,
    state.bedrooms,
    state.bathrooms,
    state.location,
    ...Object.values(debouncedState),
  ]);

  const handleChange = (name, value) => {
    setState({ [name]: value });
  };

  const resetFilter = () => {
    setState({
      search: "",
      listingStatus: "",
      propertyType: [],
      priceRange: [0, 6000000],
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-[85rem] mx-auto p-6"
    >
      <section className="lg:col-span-3 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4   backdrop-blur-md rounded-2xl">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer hover:bg-red-50 px-3 py-2 rounded-md transition bg-white/70"
            onClick={() => setState({ modalOpen: true })}
          >
            <Filter className="w-5 h-5 text-red-500" />{" "}
            <span className="text-sm font-medium text-gray-700">Filter</span>
          </Button>

          {/* Sort & View */}
          <div className="flex items-center gap-4 ">
            {/* Sort */}
            <span className="text-sm text-gray-700 font-medium">Sort by:</span>
            <div className="flex items-center gap-2  rounded-md px-3  cursor-pointer hover:bg-red-50 transition bg-white/70">
              <Select defaultValue="newest">
                <SelectTrigger className="flex items-center justify-between gap-4 border-none  px-2 py-0 text-sm font-medium focus:ring-0 shadow-none">
                  <SelectValue placeholder="Newest" />
                  {/* <ChevronDown className="w-4 h-4 text-gray-500 ml-1" /> */}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-0 rounded-md overflow-hidden bg-white/70 shadow-sm">
              <Button
                onClick={() => setState({ view: "grid" })}
                variant="ghost"
                className={`px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors ${
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
                className={`px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors ${
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

        {/* Properties */}
        {loading ? (
          <div className="flex justify-center items-center w-full pt-40">
            <Loader size={60} />
          </div>
        ) : properties?.length == 0 ? (
          <div className="flex justify-center items-center w-full pt-40">
            <div>No Property Found</div>
          </div>
        ) : (
          <>
            <div
              className={
                state.view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {properties.map((property: any, index: number) => (
                <div
                  key={index}
                  ref={
                    index === properties.length - 1
                      ? lastPropertyElementRef
                      : null
                  }
                >
                  <PropertyCard property={property} view={state.view} />
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
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <AnimatePresence>
        {state.modalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ modalOpen: false })}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="w-[600px] max-w-[90vw] bg-white rounded-2xl shadow-lg p-6 overflow-y-auto relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setState({ modalOpen: false })}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Search */}
                <Input
                  placeholder="Search properties..."
                  value={state.search}
                  onChange={(e) => handleChange("search", e.target.value)}
                />

                {/* Listing Status */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Listing Status
                  </label>
                  {["All", "Buy", "Rent"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm cursor-pointer"
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

                {/* Property Type */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Property Type
                  </label>
                  {["Houses", "Apartments"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={state.propertyType.includes(option)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...state.propertyType, option]
                            : state.propertyType.filter((t) => t !== option);
                          handleChange("propertyType", updated);
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Price Range */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Price Range
                  </label>
                  <Slider
                    min={0}
                    max={6000000}
                    step={1000}
                    value={state.priceRange}
                    onValueChange={(v) => handleChange("priceRange", v)}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹{state.priceRange[0].toLocaleString()}</span>
                    <span>₹{state.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bedrooms
                    </label>
                    <Select
                      value={state.bedrooms}
                      onValueChange={(val) => handleChange("bedrooms", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Any", "2+", "3+", "4+", "5+"].map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bathrooms
                    </label>
                    <Select
                      value={state.bathrooms}
                      onValueChange={(val) => handleChange("bathrooms", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Any", "2+", "3+", "4+", "5+"].map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Select
                    value={state.location}
                    onValueChange={(val) => handleChange("location", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="la">Los Angeles</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Button */}
                <Button
                  variant="ghost"
                  className="w-full mt-6 text-gray-500"
                  onClick={resetFilter}
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Reset All
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
