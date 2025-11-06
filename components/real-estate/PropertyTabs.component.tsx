// "use client";

// import { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";

// const sections = [
//   { id: "overview", label: "Overview" },
//   { id: "desc", label: "Desc" },
//   { id: "map", label: "Map" },
//   { id: "amenities", label: "Amenities" },
//   { id: "floorplans", label: "FloorPlans" },
//   { id: "video", label: "Video" },
//   { id: "virtualtour", label: "Virtual Tour" },
//   { id: "nearby", label: "Nearby" },
//   { id: "walkscore", label: "Walk Score" },
//   { id: "reviews", label: "Reviews" },
// ];

// export default function PropertyTabs() {
//   const [active, setActive] = useState("overview");
//   const [showTabs, setShowTabs] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       // Check if ANY section from overview to reviews is in view
//       const overviewEl = document.getElementById("overview");
//       const reviewsEl = document.getElementById("reviews");

//       if (overviewEl && reviewsEl) {
//         const overviewRect = overviewEl.getBoundingClientRect();
//         const reviewsRect = reviewsEl.getBoundingClientRect();

//         // Show tabs when overview enters viewport
//         const overviewInView = overviewRect.top <= 100;

//         // Hide tabs only when we've scrolled past the entire reviews section
//         const reviewsFullyPassed = reviewsRect.bottom <= 0;

//         // Show tabs from overview until we completely scroll past reviews
//         setShowTabs(overviewInView && !reviewsFullyPassed);
//       }

//       // Update active tab based on scroll position
//       let current = "overview";
//       sections.forEach((section) => {
//         const el = document.getElementById(section.id);
//         if (el) {
//           const rect = el.getBoundingClientRect();
//           if (rect.top <= 100 && rect.bottom > 100) {
//             current = section.id;
//           }
//         }
//       });
//       setActive(current);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });

//     // Initial check
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollTo = (id: string) => {
//     const el = document.getElementById(id);
//     if (el) {
//       const offsetTop = el.offsetTop - 100;
//       window.scrollTo({
//         top: offsetTop,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Don't render anything if tabs shouldn't be shown
//   if (!showTabs) {
//     return null;
//   }

//   return (
//     <div className="sticky top-[60px] z-40 bg-white shadow-md border-b rounded-b-lg">
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="flex flex-wrap gap-x-8 gap-y-2 py-3">
//           {sections.map((s) => (
//             <button
//               key={s.id}
//               onClick={() => scrollTo(s.id)}
//               className={cn(
//                 "text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap",
//                 active === s.id
//                   ? "border-red-500 text-red-600"
//                   : "border-transparent text-gray-500 hover:text-gray-800"
//               )}
//             >
//               {s.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

//  const sections = [
//   { id: "overview", label: "Overview" },
//   { id: "desc", label: "Desc" },
//   { id: "map", label: "Map" },
//   { id: "amenities", label: "Amenities" },
//   { id: "floorplans", label: "FloorPlans" },
//   { id: "video", label: "Video" },
//   { id: "virtualtour", label: "Virtual Tour" },
//   { id: "nearby", label: "Nearby" },
//   { id: "walkscore", label: "Walk Score" },
//   { id: "reviews", label: "Reviews" },
// ];

"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { capitalizeFLetter } from "@/utils/function.utils";

export default function PropertyTabs({ sections }) {
  const [active, setActive] = useState("overview");
  const [showTabs, setShowTabs] = useState(false);
  const lastScrollY = useRef(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [triggerPoint, setTriggerPoint] = useState(0);

  useEffect(() => {
    // Store the original position of the tab container
    if (tabsRef.current) {
      const rect = tabsRef.current.getBoundingClientRect();
      setTriggerPoint(rect.top + window.scrollY); // absolute scroll position
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // ✅ Show tabs only after passing original position
      if (currentScroll > triggerPoint + 300) {
        if (currentScroll > lastScrollY.current + 10) {
          // scrolling down past trigger point -> show
          setShowTabs(true);
        } else if (currentScroll < lastScrollY.current - 10) {
          // scrolling up -> hide
          setShowTabs(false);
        }
      } else {
        // before reaching trigger point -> always hide
        setShowTabs(false);
      }

      lastScrollY.current = currentScroll <= 0 ? 0 : currentScroll;

      // ✅ Update active tab only when actually in view
      let current = active;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            current = section.id;
            break;
          }
        }
      }
      setActive(current);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, triggerPoint, active]);

  // ✅ On click: scroll + update active immediately
  const scrollTo = (id: string) => {
    setActive(id); // immediately highlight
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120; // adjust for sticky header height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* The invisible placeholder div marks the tab's original position */}
      <div ref={tabsRef} />

      {/* Floating tab bar */}
      <div
        className={cn(
          "sticky top-[65px] z-40 bg-white shadow-md border-b rounded-b-lg transition-all duration-500 overflow-hidden ",
          showTabs
            ? "opacity-100 translate-y-0 pointer-events-auto h-auto mt-5 mb-5"
            : "opacity-0 -translate-y-5 pointer-events-none h-0 mt-2 mb-2 xl:mt-3 xl:mb-3"
        )}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-x-8 gap-y-2 py-3 overflow-auto scrollbar-hide thin-scrollbar">
            {sections?.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "text-sm font-medium border-b transition-colors whitespace-nowrap",
                  active === s.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                )}
              >
                {capitalizeFLetter(s.label)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
