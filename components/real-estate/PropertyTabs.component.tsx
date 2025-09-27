"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "desc", label: "Desc" },
  { id: "map", label: "Map" },
  { id: "amenities", label: "Amenities" },
  { id: "floorplans", label: "FloorPlans" },
  { id: "nearby", label: "Nearby" },
  { id: "video", label: "Video" },
  { id: "virtualtour", label: "Virtual Tour" },
  { id: "walkscore", label: "Walk Score" },
  { id: "reviews", label: "Reviews" },
];

export default function PropertyTabs() {
  const [active, setActive] = useState("overview");
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTabs(window.scrollY > 10);

      let current = "overview";
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            current = section.id;
          }
        }
      });
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  if (!showTabs) return null;

  return (
    <div className="sticky top-20 z-40 bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-x-8 gap-y-2 py-3">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                "text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap",
                active === s.id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}