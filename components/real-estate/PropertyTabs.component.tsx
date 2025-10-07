"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "desc", label: "Desc" },
  { id: "map", label: "Map" },
  { id: "amenities", label: "Amenities" },
  { id: "floorplans", label: "FloorPlans" },
  { id: "video", label: "Video" },
  { id: "virtualtour", label: "Virtual Tour" },
  { id: "nearby", label: "Nearby" },
  { id: "walkscore", label: "Walk Score" },
  { id: "reviews", label: "Reviews" },
];

export default function PropertyTabs() {
  const [active, setActive] = useState("overview");
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if ANY section from overview to reviews is in view
      const overviewEl = document.getElementById("overview");
      const reviewsEl = document.getElementById("reviews");
      
      if (overviewEl && reviewsEl) {
        const overviewRect = overviewEl.getBoundingClientRect();
        const reviewsRect = reviewsEl.getBoundingClientRect();
        
        // Show tabs when overview enters viewport
        const overviewInView = overviewRect.top <= 100;
        
        // Hide tabs only when we've scrolled past the entire reviews section
        const reviewsFullyPassed = reviewsRect.bottom <= 0;
        
        // Show tabs from overview until we completely scroll past reviews
        setShowTabs(overviewInView && !reviewsFullyPassed);
      }

      // Update active tab based on scroll position
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Don't render anything if tabs shouldn't be shown
  if (!showTabs) {
    return null;
  }

  return (
    <div className="sticky top-[60px] z-40 bg-white shadow-md border-b rounded-b-lg">
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