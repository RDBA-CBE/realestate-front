"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { formatNumber } from "@/utils/function.utils";

interface FloorPlan {
  id: number;
  category: string;
  square_feet: string;
  price: string;
  image: string | null;
  type?: string;
}

interface Props {
  data: FloorPlan[];
}

const FloorPlans: React.FC<Props> = ({ data }) => {
  // ✅ Nested grouping: category → type → plans
  const groupedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return {};

    return data.reduce((acc, item) => {
      const category = item.category;
      const type = item.type || "";

      if (!acc[category]) acc[category] = {};
      if (!acc[category][type]) acc[category][type] = [];

      acc[category][type].push(item);

      return acc;
    }, {} as Record<string, Record<string, FloorPlan[]>>);
  }, [data]);

  const categories = Object.keys(groupedData);

  const [activeCategory, setActiveCategory] = useState("");
  const [activeType, setActiveType] = useState("");
  const [selectedSqft, setSelectedSqft] = useState("");

  // ✅ Initial selection
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstCategory = categories[0];
      const firstType = Object.keys(groupedData[firstCategory])[0];
      const firstPlan = groupedData[firstCategory][firstType][0];

      setActiveCategory(firstCategory);
      setActiveType(firstType);
      setSelectedSqft(firstPlan?.square_feet);
    }
  }, [categories, groupedData, activeCategory]);

  // ✅ Current plans
  const currentPlans =
    groupedData?.[activeCategory]?.[activeType] || [];

  const selectedPlan =
    currentPlans.find((p) => p.square_feet === selectedSqft) ||
    currentPlans[0];

  // ✅ Price formatter
  const formatPrice = (price: string) => {
    if (!price) return "₹0";
    const num = parseFloat(price);
    if (isNaN(num)) return "₹0";

    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;

    return `₹${num.toLocaleString()}`;
  };

  // ✅ Price range
  const getPriceRange = (plans: FloorPlan[]) => {
    if (!plans?.length) return "₹0";

    const prices = plans
      .map((p) => parseFloat(p.price || "0"))
      .filter((p) => !isNaN(p));

    if (!prices.length) return "₹0";

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return `${formatPrice(min.toString())} - ${formatPrice(max.toString())}`;
  };

  // ❌ Empty state
  if (!categories.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No floor plans available
      </div>
    );
  }
  console.log('✌️categories --->', categories);

  return (
    <div className="bg-transparent">
      <h3 className="text-xl font-semibold mb-6">
        Price & Floor Plan
      </h3>

      {/* ✅ Category + Type Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {categories.map((cat) =>
          Object.entries(groupedData[cat]).map(([type, plans]) => (
            <button
              key={`${cat}-${type}`}
              onClick={() => {
                setActiveCategory(cat);
                setActiveType(type);
                setSelectedSqft(plans[0]?.square_feet);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                activeCategory === cat && activeType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-color1 text-gray-700"
              }`}
            >
              <div className="font-semibold">
                {cat.toUpperCase()}  {type != null ? ` ${type}` : ""}
              </div>

              <div className="text-xs">
                {getPriceRange(plans)}
              </div>
            </button>
          ))
        )}
      </div>

      {/* ✅ SQFT Tabs */}
      {currentPlans.length > 0 && (
        <div className="flex gap-3 overflow-x-auto mt-4 border-b pb-2">
          {currentPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedSqft(plan.square_feet)}
              className={`px-3 py-1 border-b-2 ${
                selectedSqft === plan.square_feet
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              {formatNumber(plan.square_feet)} SQ.FT
            </button>
          ))}
        </div>
      )}

      {/* ✅ Price */}
      {selectedPlan && (
        <div className="mt-4 text-lg font-bold">
          {formatPrice(selectedPlan.price)}
        </div>
      )}

      {/* ✅ Image */}
      {selectedPlan?.image && (
        <div className="relative w-full h-80 mt-4 border rounded-xl overflow-hidden">
          <Image
            src={selectedPlan.image}
            alt="Floor Plan"
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* ✅ Details */}
      {selectedPlan && (
        <div className="flex justify-between mt-6 text-sm text-gray-700">
          <div>
            <p className="font-semibold">Plot Area</p>
            <p>{formatNumber(selectedPlan.square_feet)} sq.ft</p>
          </div>

          <div>
            <p className="font-semibold">Type</p>
            <p>{selectedPlan.type}</p>
          </div>

          <div>
            <p className="font-semibold">Status</p>
            <p className="text-green-600 font-semibold">
              Ready to Move
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlans;