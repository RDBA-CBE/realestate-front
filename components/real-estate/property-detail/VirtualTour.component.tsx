"use client";

import { Compass, Eye } from "lucide-react";

const TOUR_TYPE_LABELS: Record<string, string> = {
  "360_view": "360° View",
  "3d_walkthrough": "3D Walkthrough",
  "vr_tour": "VR Tour",
};

export default function VirtualTour({ data }: { data?: any[] }) {
  if (!data?.length) return null;

  return (
    <>
      <h3 className="section-in-ti mb-4 flex items-center gap-2">
        <Compass className="w-5 h-5" />
        Virtual Tours
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((tour) => (
          <div
            key={tour.id}
            className="relative rounded-xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-700 h-48 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:from-gray-800 hover:to-gray-600 transition-all duration-300"
          >
            {tour.thumbnail ? (
              <img
                src={tour.thumbnail}
                alt="Virtual Tour"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity"
              />
            ) : null}
            <div className="relative z-10 flex flex-col items-center gap-2 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Eye className="w-8 h-8" />
              </div>
              <span className="text-sm font-semibold tracking-wide">
                {TOUR_TYPE_LABELS[tour.tour_type] ?? tour.tour_type}
              </span>
              {tour.provider ? (
                <span className="text-xs text-white/70">{tour.provider}</span>
              ) : null}
            </div>
            <div className="absolute inset-0 ring-2 ring-inset ring-white/10 rounded-xl pointer-events-none" />
          </div>
        ))}
      </div>
    </>
  );
}
