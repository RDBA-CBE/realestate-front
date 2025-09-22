"use client";

import { Heart, Share2, Copy, Printer, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      {/* Left side */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Equestrian Family Home</h1>
        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
          <span>New York City, CA, USA</span>
          <span className="flex items-center gap-1 text-red-500 font-medium">
            ● For sale
          </span>
          <span className="flex items-center gap-1">
            ⏱ 7 years ago
          </span>
          <span className="flex items-center gap-1">
            🔗 8721
          </span>
        </div>

        <div className="flex items-center gap-6 text-gray-700 mt-2">
          <div className="flex items-center gap-1">
            <Bed size={18} /> <span>1 bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} /> <span>2 bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={18} /> <span>1200 sqft</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="rounded-full">
            <Heart size={18} />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Copy size={18} />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Share2 size={18} />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Printer size={18} />
          </Button>
        </div>
        <div>
          <p className="text-2xl font-bold">$14,000</p>
          <p className="text-sm text-gray-600">$11.67/sq ft</p>
        </div>
      </div>
    </div>
  );
}
