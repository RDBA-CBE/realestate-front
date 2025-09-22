import { PropertyCard } from "./property-card";
import { useState } from "react";
import { motion } from "framer-motion";

export function PropertyGrid(props: any) {
  const { properties, title = "New York Homes for Sale" } = props;

  const [view, setView] = useState<"grid" | "list">("grid");
  const [col, setCol] = useState(4);

  return (
    // <div className="container mx-auto px-4 py-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto space-y-8 p-6"
    >
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
          For Sale
        </button>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Property Type</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Price</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Beds / Baths</option>
        </select>
        <button className="border border-gray-300 text-sm px-4 py-2 rounded-md">
          More Filter
        </button>

        {/* Grid/List Toggle */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2 rounded-md border ${
              view === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 rounded-md border ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Properties */}
      <div
        className={
          view === "grid"
            ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${col} gap-6`
            : "grid grid-cols-1 md:grid-cols-2 gap-6"
        }
      >
        {properties.map((property: any) => (
          <PropertyCard key={property.id} property={property} view={view} />
        ))}
      </div>
    </motion.div>
  );
}
