import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Filter, X } from "lucide-react";
import { useSetState } from "@/utils/function.utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const FilterPopup = (props: any) => {
  const { state, setState, resetFilter, handleChange } = props;

  // Disable background scroll when modal is open
  useEffect(() => {
    if (state.modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [state.modalOpen]);

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 cursor-pointer hover:bg-red-50 px-3 py-2 rounded-md transition bg-white/70"
        onClick={() => setState({ modalOpen: true })}
      >
        <Filter className="w-5 h-5 text-red-500" /> <span className="text-sm font-medium text-gray-700">Filter</span>
      </Button>

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
                  <label className="block text-sm font-medium mb-1">Listing Status</label>
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
                  <label className="block text-sm font-medium mb-1">Property Type</label>
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
                  <label className="block text-sm font-medium mb-1">Price Range</label>
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
                    <label className="block text-sm font-medium mb-1">Bedrooms</label>
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
                    <label className="block text-sm font-medium mb-1">Bathrooms</label>
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
                  <label className="block text-sm font-medium mb-1">Location</label>
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
    </>
  );
};
