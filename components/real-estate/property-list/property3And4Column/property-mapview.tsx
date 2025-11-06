"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, X, SearchIcon, RotateCcw } from "lucide-react";
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

export function MapView(props) {
  const {
    properties = [],
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
    view: "grid",
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
      isOpen: false,
    });
    previousFiltersRef.current = {};

    // Call parent clear filter
    if (clearFilter) {
      clearFilter();
    }
  };

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

  useEffect(() => {
    filters(state);
  }, [state.sort]);

  useEffect(() => {
    if (state.selectedProperty && propertyDetailRef.current) {
      propertyDetailRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

  const skeletonCount = state.view === "grid" ? 2 : 1;

  const handleChange = (name: string, value: any) => {
    setState({ [name]: value });
  };

  const formatINR = (value: number) => {
    if (isNaN(value)) return "";
    return value.toLocaleString("en-IN");
  };

  const parseINR = (value: string) => Number(value.replace(/,/g, ""));

  const handleFilter = () => {
    filters(state);
    setState({ isOpen: false });
  };

  return (
    <div className="min-h-[91vh] bg-white">
      <div className="grid grid-cols-1 xl:grid-cols-12 !gap-0 min-h-[91vh]">
        <div className=" xl:col-span-3 p-6 lg:py-8 px-3 overflow-y-auto h-[calc(100vh-65px)] flex flex-col items-start">
          {/* First sticky header */}
          <div className="sticky top-0 lg:-top-8 z-10 w-full p-3 rounded-lg mb-3 bg-gray-100">
            {/* First sticky header */}
            <div className="flex items-center justify-between  w-full">
              <Button
                onClick={() => setState({ isOpen: true })}
                variant="outline"
                className="rounded-full text-gray-800 px-4 py-2 border shadow-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" /> More Filter
              </Button>
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Sort by:
                  </span>
                  <Select
                    defaultValue="default"
                    onValueChange={(value) => {
                      let sortValue = "new";
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
              </div>
            </div>{" "}
            {/* Second sticky header */}
            {/* <div className="flex items-center justify-between mb-2 w-full">
              <div className="flex items-center gap-0 rounded-lg overflow-hidden border">
                <Button
                  onClick={() => setState({ view: "grid" })}
                  variant="ghost"
                  className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                    state.view === "grid"
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  Grid
                </Button>
                <div className="h-4 w-px bg-gray-300"></div>
                <Button
                  onClick={() => setState({ view: "list" })}
                  variant="ghost"
                  className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                    state.view === "list"
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  List
                </Button>
              </div>
            </div> */}
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Showing 1–{properties?.length} of {properties?.length} results
          </p>

          {/* Rest of the content remains the same */}
          {loading ? (
            <div className={"flex flex-col w-full gap-6"}>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <PropertyMapCardSkeleton
                  key={`skeleton-${index}`}
                  view={state.view}
                  row={2}
                />
              ))}
            </div>
          ) : properties?.length === 0 ? (
            <div className="flex flex-col justify-center items-center w-full ">
              <img
                src="/assets/images/not_founds.jpg"
                alt="No Property Found"
                className="w-80 h-auto mb-4"
              />
            </div>
          ) : (
            <>
              <div
                className={
                  state.view === "list"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 w-full"
                    : "flex flex-col gap-6 w-full"
                }
              >
                {properties?.map((property: any, index: number) => (
                  <div
                    key={index}
                    className="property-item"
                    ref={
                      index === properties.length - 1
                        ? lastPropertyElementRef
                        : null
                    }
                  >
                    <PropertyCard
                      property={property}
                      view={state.view}
                      handleClick={() => {
                        setState({ selectedProperty: property });
                      }}
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
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {Array.from({ length: skeletonCount }).map((_, index) => (
                    <PropertyMapCardSkeleton
                      key={`skeleton-load-${index}`}
                      view={state.view}
                      row={1}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {state.selectedProperty && (
          <div
            className="xl:col-span-3 h-[calc(100vh-65px)] overflow-y-auto"
            ref={propertyDetailRef}
          >
            <PropertyDetailInline
              id={state.selectedProperty?.id}
              handleClick={() => setState({ selectedProperty: null })}
              clickSimilarProperty={(data) =>
                setState({ selectedProperty: data })
              }
            />
          </div>
        )}

        {/* Map section remains the same */}
        <div
          className={`${
            state.selectedProperty ? "xl:col-span-6" : "xl:col-span-9 "
          } relative h-full bg-gray-200`}
        >
          {/* <iframe
            title='Map'
            className='w-full h-full'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31510.7524969315!2d-118.343!3d34.052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c0!2sLos%20Angeles!5e0!3m2!1sen!2sus!4v1700000000000'
            loading='lazy'
          ></iframe> */}
          <GoogleMapPropertyList
            properties={properties}
            selectedProperties={state.selectedProperty}
          />
        </div>
      </div>

      {/* Filter modal remains the same */}
      <AnimatePresence>
        {state.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setState({ isOpen: false })}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filters
                  </h3>

                  <div className="flex items-center gap-3">
                    <Button
                      className="bg-[#F35C48] hover:bg-[#d94d3c] flex items-center justify-center gap-2"
                      onClick={() => {
                        handleFilter();
                      }}
                    >
                      <SearchIcon className="h-4 w-4" />
                      Search
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={resetFilters}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setState({ isOpen: false })}
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                  <div className="space-y-6">
                    <div className=" font-semibold text-gray-900">
                      Search Property
                      <div className="mt-3">
                        <TextInput
                          placeholder="What are you looking for?"
                          value={state.search}
                          onChange={(e) =>
                            handleChange("search", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 font-semibold text-gray-900">
                        Listing Status
                      </div>

                      <div className="flex items-center justify-start gap-6">
                        {["All", "Sale", "Rent", "Lease"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="listingStatus"
                              checked={state.listingStatus === option}
                              onChange={() =>
                                handleChange("listingStatus", option)
                              }
                              className="accent-blue-600 cursor-pointer"
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
                      <div className="flex items-center justify-start gap-6">
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
                                  updated = [option];
                                } else {
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
                        <div className="relative w-full">
                          <span className="absolute left-3 top-2 text-gray-600">
                            ₹
                          </span>
                          <Input
                            type="text"
                            className="pl-6 pr-0"
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

                        <div className="relative w-full">
                          <span className="absolute left-3 top-2 text-gray-600">
                            ₹
                          </span>
                          <Input
                            type="text"
                            className="pl-6 pr-0"
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
                      <div className="mb-2 font-semibold text-gray-900">
                        Bedrooms
                      </div>

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
                      <div className="mb-2 font-semibold text-gray-900">
                        Bathrooms
                      </div>
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
                      <div className="mb-2 font-semibold text-gray-900">
                        Furnishing
                      </div>
                      <div className="flex items-center justify-start gap-6">
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
                                  updated = [option];
                                } else {
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
                          type="number"
                          placeholder="Min."
                          value={state.sqftMin}
                          onChange={(e) =>
                            handleChange("sqftMin", e.target.value)
                          }
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="number"
                          placeholder="Max."
                          value={state.sqftMax}
                          onChange={(e) =>
                            handleChange("sqftMax", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 font-semibold text-gray-900">
                        Year Built
                      </div>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder=""
                          value={state.yearBuiltMin}
                          onChange={(e) =>
                            handleChange("yearBuiltMin", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder=""
                          value={state.yearBuiltMax}
                          onChange={(e) =>
                            handleChange("yearBuiltMax", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
