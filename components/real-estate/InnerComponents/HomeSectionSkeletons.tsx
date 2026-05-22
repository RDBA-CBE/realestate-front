"use client";

const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

/* ── PropertyByCity skeleton ── */
export const PropertyByCitySkeleton = () => (
  <div className="section-pad bg-white">
    <div className="section-wid">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <Pulse className="h-7 w-48" />
          <Pulse className="h-4 w-64" />
        </div>
        <Pulse className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Pulse className="w-16 h-16 rounded-full" />
            <Pulse className="h-4 w-20" />
            <Pulse className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── FeaturedListings skeleton ── */
export const FeaturedListingsSkeleton = () => (
  <div className="section-pad bg-[#f8f8f8]">
    <div className="section-wid">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <Pulse className="h-7 w-52" />
          <Pulse className="h-4 w-72" />
        </div>
        <Pulse className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Pulse className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Pulse className="h-5 w-3/4" />
              <Pulse className="h-4 w-1/2" />
              <Pulse className="h-4 w-2/3" />
              <div className="flex gap-3 pt-2">
                <Pulse className="h-3 w-16" />
                <Pulse className="h-3 w-16" />
                <Pulse className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── PropertyByType skeleton ── */
export const PropertyByTypeSkeleton = () => (
  <div className="section-pad bg-white">
    <div className="section-wid">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <Pulse className="h-7 w-48" />
          <Pulse className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100">
            <Pulse className="w-14 h-14 rounded-xl" />
            <Pulse className="h-4 w-24" />
            <Pulse className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── FeaturedDevelopers skeleton ── */
export const FeaturedDevelopersSkeleton = () => (
  <div className="section-pad bg-[#f8f8f8]">
    <div className="section-wid">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <Pulse className="h-7 w-52" />
          <Pulse className="h-4 w-72" />
        </div>
        <Pulse className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <Pulse className="w-14 h-14 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Pulse className="h-5 w-3/4" />
              <Pulse className="h-3 w-1/2" />
              <Pulse className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── NewPopularProperties skeleton ── */
export const NewPopularPropertiesSkeleton = () => (
  <div className="section-pad bg-[#f8f8f8]">
    <div className="section-wid">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div className="space-y-2">
          <Pulse className="h-7 w-56" />
          <Pulse className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Pulse className="h-9 w-28 rounded-full" />
          <Pulse className="h-9 w-24 rounded-full" />
          <Pulse className="h-9 w-24 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Pulse className="h-52 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Pulse className="h-5 w-3/4" />
              <Pulse className="h-4 w-1/2" />
              <Pulse className="h-4 w-2/3" />
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Pulse className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Pulse className="h-3 w-24" />
                  <Pulse className="h-3 w-16" />
                </div>
                <Pulse className="h-8 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
