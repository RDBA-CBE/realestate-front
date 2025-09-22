import { PropertyCard } from "./property-card";
import { useState } from "react";

export function PropertyGrid(props: any) {
  const {
    properties,
    title = "New York Homes for Sale",
    showFilters = true,
  } = props;

  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">Home / For Rent</nav>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing 1–{properties.length} of {properties.length} results
        </p>

        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 rounded-md border ${
                view === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded-md border ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="hidden lg:block lg:w-1/4 xl:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-4">Find your home</h3>

              <div className="space-y-6">
                {/* Listing Status */}
                <div>
                  <h4 className="font-medium mb-3">Listing Status</h4>
                  {["All", "Buy", "Rent"].map((status) => (
                    <label key={status} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="listingStatus"
                        className="mr-2"
                      />
                      {status}
                    </label>
                  ))}
                </div>

                {/* Property Type */}
                <div>
                  <h4 className="font-medium mb-3">Property Type</h4>
                  {["All", "Houses", "Apartments"].map((type) => (
                    <label key={type} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="propertyType"
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <input type="range" min="0" max="100000" className="w-full" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <h4 className="font-medium mb-3">Bedrooms</h4>
                  {["Any", "1+", "2+", "3+", "4+", "5+"].map((val) => (
                    <button
                      key={val}
                      className="px-3 py-1 border rounded-md text-sm mr-2 mb-2 hover:bg-gray-100"
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Bathrooms */}
                <div>
                  <h4 className="font-medium mb-3">Bathrooms</h4>
                  {["Any", "1+", "2+", "3+", "4+", "5+"].map((val) => (
                    <button
                      key={val}
                      className="px-3 py-1 border rounded-md text-sm mr-2 mb-2 hover:bg-gray-100"
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Location */}
                <div>
                  <h4 className="font-medium mb-3">Location</h4>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>All Cities</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>San Diego</option>
                  </select>
                </div>

                {/* Square Feet */}
                <div>
                  <h4 className="font-medium mb-3">Square Feet</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 border px-2 py-1 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 border px-2 py-1 rounded-md"
                    />
                  </div>
                </div>

                {/* Year Built */}
                <div>
                  <h4 className="font-medium mb-3">Year Built</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="2019"
                      className="w-1/2 border px-2 py-1 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="2022"
                      className="w-1/2 border px-2 py-1 rounded-md"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Search
                  </button>
                  <button className="w-full border border-gray-300 text-gray-600 py-2 rounded-md hover:bg-gray-50">
                    Reset all filters
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Properties Grid */}
        <div
          className={`flex-1 transition-all ${
            showFilters ? "lg:w-3/4 xl:w-3/4" : "w-full"
          }`}
        >
          <div
            className={`grid ${
              view === "grid"
                ? showFilters
                  ? "grid-cols-1 md:grid-cols-2 gap-6" // 2 per row if filters visible
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" // 3 per row otherwise
                : "grid-cols-1 gap-6"
            }`}
          >
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} view={view} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
