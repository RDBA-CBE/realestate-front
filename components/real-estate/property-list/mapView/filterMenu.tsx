"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function FilterMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: open ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 80 }}
      className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Listing Filter</h2>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-lg p-2"
        />

        <div>
          <p className="font-medium">Listing Status</p>
          <div className="flex flex-col space-y-2 mt-2">
            <label><input type="radio" name="status" defaultChecked /> All</label>
            <label><input type="radio" name="status" /> Buy</label>
            <label><input type="radio" name="status" /> Rent</label>
          </div>
        </div>

        <div>
          <p className="font-medium">Property Type</p>
          <div className="flex flex-col space-y-2 mt-2">
            <label><input type="checkbox" defaultChecked /> All</label>
            <label><input type="checkbox" /> Houses</label>
            <label><input type="checkbox" /> Apartments</label>
            <label><input type="checkbox" /> Office</label>
            <label><input type="checkbox" /> Villa</label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
