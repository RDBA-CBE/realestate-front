"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
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
    previousFiltersRef.current = {}; // Call parent clear filter
    if (clearFilter) {
      clearFilter();
    }
  };
  useEffect(() => {
    if (initialLoadRef.current && minPrice > 0 && maxPrice > 0) {
      setState({ minPrice, maxPrice, priceRange: [minPrice, maxPrice] });
      initialLoadRef.current = false;
    }
  }, [minPrice, maxPrice]);
  useEffect(() => {
    filters(state);
  }, [state.sort]);
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
    <div className="lg:hidden fixed inset-0 z-50 bg-white">
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
  dragConstraints={{ top: -500, bottom: 0 }} // top = fully open, bottom = collapsed
  dragElastic={0.2}
  onDragEnd={(event, info) => {
    // Snap logic after drag
    if (info.point.y < 200) {
      setOpen(true); // fully open
    } else {
      setOpen(false); // collapsed
      setShowDetail(false); // optionally hide detail when collapsed
    }
  }}
  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50"
  style={{
    touchAction: "none",
    maxHeight: open ? "90vh" : "35vh",
  }}
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
        <h2 className="text-lg font-semibold">Properties Nearby</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-gray-700"
        >
          Filter
        </Button>
      </div>
      <div
        className={`transition-all duration-300 overflow-y-auto pb-6`}
        style={{ maxHeight: open ? "calc(90vh - 50px)" : "calc(35vh - 50px)" }}
      >
        <div className="space-y-3 px-4">
          {properties?.map((property: any, index: number) => (
            <Card
              key={index}
              onClick={() => {
                setState({ selectedProperty: property });
                setShowDetail(true);
                setOpen(true); // fully open when detail is shown
              }}
              className="cursor-pointer hover:shadow-md transition"
            >
              <CardContent className="p-0">
                <PropertyCard property={property} view="grid" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  ) : (
    <div className="p-4 relative overflow-y-auto" ref={propertyDetailRef} style={{ maxHeight: "calc(90vh - 50px)" }}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={() => setShowDetail(false)}
      >
        <X className="w-5 h-5 text-gray-600" />
      </Button>
      <div className="flex items-center gap-2 mb-4">
        <ChevronUp className="w-4 h-4 text-gray-400" />
        <p className="text-gray-500 text-sm">Swipe up for details</p>
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

    </div>
  );
}
