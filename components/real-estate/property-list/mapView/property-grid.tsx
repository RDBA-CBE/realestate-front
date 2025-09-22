"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PropertyCard } from "./property-card";
import FilterMenu from "./filterMenu";

export function PropertyGrid({
  properties,
  title,
}: {
  properties: any[];
  title: string;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 20 },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Show Filter
            </button>
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={`flex-1 overflow-y-auto px-6 pt-5 pb-6 ${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
              : "flex flex-col gap-6"
          }`}
        >
          {properties.map((property) => (
            <motion.div key={property.id} variants={cardVariants}>
              <PropertyCard property={property} view={view} />
            </motion.div>
          ))}

          <div className="md:hidden w-full h-64 mt-6 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">[Google Map Placeholder]</p>
          </div>
        </motion.div>
      </div>

      <div className="hidden md:flex md:w-1/2 fixed right-0 top-0 h-full bg-gray-200 items-center justify-center">
        <p className="text-gray-500">[Google Map Placeholder]</p>
      </div>

      {/* Filter Menu */}
      <FilterMenu open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
