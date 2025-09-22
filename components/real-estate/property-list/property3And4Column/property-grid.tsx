import { PropertyCard } from "./property-card";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import FilterDropdown from "../../FilterDropdown.component";

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
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterDropdown
          title="For Sale"
          subtitle="Listing Status"
          type="radio"
          options={["All", "Buy", "Rent"]}
          onChange={(val) => console.log("Selected:", val)}
        />
        <FilterDropdown
          title=" Property Type"
          subtitle="Select Options"
          type="checkbox"
          options={["All", "Villa", "Office"]}
          onChange={(val) => console.log("Checked:", val)}
        />
        <FilterDropdown
          title="Price"
          subtitle="Price Range"
          type="range"
          onChange={(val) => console.log("Range:", val)}
        />

        <Button
          variant="outline"
          className="rounded-full bg-white text-gray-800 px-5 py-2 shadow-sm hover:bg-gray-50"
        >
          More Filter
        </Button>

        {/* Grid/List Toggle */}
        <div className="ml-auto flex gap-2">
          <Button
            onClick={() => setView("grid")}
            className={`rounded-full px-5 py-2 ${
              view === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border shadow-sm hover:bg-gray-50"
            }`}
          >
            Grid
          </Button>
          <Button
            onClick={() => setView("list")}
            className={`rounded-full px-5 py-2 ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border shadow-sm hover:bg-gray-50"
            }`}
          >
            List
          </Button>
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
