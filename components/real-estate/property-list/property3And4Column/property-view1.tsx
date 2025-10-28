import { PropertyCard } from "./property-card";
import { useEffect, useState, useRef, useCallback } from "react";
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
  Sidebar,
  Filter,
  X,
} from "lucide-react";
import FilterDropdown from "../../FilterDropdown.component";
import Modal from "@/components/common-components/modal";
import { useSetState } from "@/utils/function.utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import useDebounce from "@/components/common-components/useDebounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { PropertyCardSkeleton } from "../../../common-components/skeleton/PropertyCardSkeleton.componenet";
import { SidebarContent } from "../../SidebarContent.components";

export function PropertyView1(props: any) {
  const {
    properties,
    title = "List View",
    filters,
    loading,
    isLoadingMore,
    handNext,
    loadMore,
    categoryList,
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
    sidebarOpen: false,
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
      className="max-w-[85rem] mx-auto p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* --- Sidebar for desktop --- */}
        <aside className="hidden lg:block space-y-6 lg:col-span-1">
          <SidebarContent
            state={state}
            handleChange={handleChange}
            resetFilter={resetFilter}
            categoryList={categoryList}
            parseINR={parseINR}
            formatINR={formatINR}
          />
        </aside>

        {/* --- Main Section --- */}
        <section className="lg:col-span-3 space-y-6">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
            {/* Toggle Button for Mobile */}
            <div className="lg:hidden">
              <Sheet open={state.sidebarOpen} onOpenChange={(open) => setState({ sidebarOpen: open })} >
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-80 p-4 overflow-y-auto">
                  <SheetHeader className="flex items-center justify-between">
                    <SheetTitle>Filters</SheetTitle>
                    
                  </SheetHeader>

                  <div className="mt-4 space-y-6">
                    <SidebarContent
                      state={state}
                      handleChange={handleChange}
                      resetFilter={() => {
                        resetFilter();
                       setState({sidebarOpen:true})
                      }}
                       categoryList={categoryList}
                      parseINR={parseINR}
                      formatINR={formatINR}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Example right content */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-auto text-sm font-medium text-gray-900">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Properties grid/list here */}

          <section className="lg:col-span-3 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
              <span className="text-sm text-gray-600"></span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Sort by:
                  </span>
                  <Select defaultValue="newest">
                    <SelectTrigger className=" border-0 shadow-none focus:ring-0 p-0 h-auto text-sm font-medium text-gray-900">
                      <SelectValue placeholder="Newest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
