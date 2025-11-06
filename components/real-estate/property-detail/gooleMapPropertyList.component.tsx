"use client";
import { Card } from "@/components/ui/card";
import { KEY } from "@/utils/constant.utils";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, MapPin } from "lucide-react";
import { formatPriceRange } from "@/utils/function.utils";

interface Property {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  price: string;
  listing_type: "rent" | "sale" | "lease";
  bedrooms: number;
  bathrooms: number;
  total_area: string;
  city: string;
  state: string;
  address: string;
  primary_image?: string;
  price_per_sqft?: string;
  status: string;
  is_approved: boolean;
  description?: string;
  property_type?: {
    name: string;
  };
  images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
  lat?: number;
  lng?: number;
  price_range?: any;
}

interface GoogleMapsProps {
  properties?: Property[];
  selectedProperties?: any;
}

// Calculate distance between two coordinates in kilometers
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const GoogleMapPropertyList = (props: GoogleMapsProps) => {
  const { properties = [], selectedProperties } = props;

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [currentZoom, setCurrentZoom] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    bounds?: google.maps.LatLngBounds;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number>(50); // Default 50km radius

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: KEY,
    libraries: ["places"],
  });

  const isInIndia = (lat: number, lng: number): boolean => {
    return lat >= 6.0 && lat <= 36.0 && lng >= 68.0 && lng <= 98.0;
  };

  const calculateCenter = useCallback((properties: Property[]) => {
    const validProperties = properties.filter((property) => {
      const lat = parseFloat(property.latitude);
      const lng = parseFloat(property.longitude);
      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        property.is_approved &&
        property.status === "available"
      );
    });

    const indianProperties = validProperties.filter((property) =>
      isInIndia(parseFloat(property.latitude), parseFloat(property.longitude))
    );

    if (indianProperties.length > 0) {
      const avgLat =
        indianProperties.reduce(
          (sum, prop) => sum + parseFloat(prop.latitude),
          0
        ) / indianProperties.length;
      const avgLng =
        indianProperties.reduce(
          (sum, prop) => sum + parseFloat(prop.longitude),
          0
        ) / indianProperties.length;
      return { lat: avgLat, lng: avgLng };
    }

    if (validProperties.length > 0) {
      const avgLat =
        validProperties.reduce(
          (sum, prop) => sum + parseFloat(prop.latitude),
          0
        ) / validProperties.length;
      const avgLng =
        validProperties.reduce(
          (sum, prop) => sum + parseFloat(prop.longitude),
          0
        ) / validProperties.length;
      return { lat: avgLat, lng: avgLng };
    }

    return { lat: 20.5937, lng: 78.9629 };
  }, []);

  const propertiesWithCoords = useMemo(() => {
    const processedProperties = properties
      .filter((property) => {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);
        const isValid =
          !isNaN(lat) &&
          !isNaN(lng) &&
          property.is_approved &&
          property.status === "available";
        return isValid;
      })
      .map((property) => ({
        ...property,
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude),
        isIndian: isInIndia(
          parseFloat(property.latitude),
          parseFloat(property.longitude)
        ),
      }));

    console.log("Properties with coordinates:", processedProperties.length);
    return processedProperties;
  }, [properties]);

  // Filter properties based on geographic proximity - IMPROVED
  const filteredProperties = useMemo(() => {
    if (!searchLocation) {
      return propertiesWithCoords;
    }

    const filtered = propertiesWithCoords.filter((property) => {
      // Check if property has valid coordinates
      if (!property.lat || !property.lng) return false;

      const distance = calculateDistance(
        searchLocation.lat,
        searchLocation.lng,
        property.lat,
        property.lng
      );

      // Return properties within the search radius
      return distance <= searchRadius;
    });

    console.log(
      `Found ${filtered.length} properties within ${searchRadius}km of ${searchLocation.address}`
    );

    // Debug: Log distances for first few properties
    if (filtered.length > 0) {
      filtered.slice(0, 5).forEach((prop, index) => {
        const distance = calculateDistance(
          searchLocation.lat,
          searchLocation.lng,
          prop.lat!,
          prop.lng!
        );
        console.log(
          `Property ${index + 1}: "${prop.title}" in ${
            prop.city
          } - ${distance.toFixed(2)}km`
        );
      });
    }

    return filtered;
  }, [propertiesWithCoords, searchLocation, searchRadius]);

  const selectedPropertyWithCoords = useMemo(() => {
    if (
      !selectedProperties ||
      !selectedProperties.latitude ||
      !selectedProperties.longitude
    ) {
      return null;
    }

    const lat = parseFloat(selectedProperties.latitude);
    const lng = parseFloat(selectedProperties.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    return {
      ...selectedProperties,
      lat: lat,
      lng: lng,
      isIndian: isInIndia(lat, lng),
    };
  }, [selectedProperties]);

  // Update center when properties or selected property changes - IMPROVED
  useEffect(() => {
    if (selectedPropertyWithCoords) {
      setMapCenter({
        lat: selectedPropertyWithCoords.lat!,
        lng: selectedPropertyWithCoords.lng!,
      });
      setCurrentZoom(15);
    } else if (filteredProperties.length > 0 && searchLocation) {
      // Fit bounds to show all properties around search location
      if (mapRef.current) {
        const bounds = new google.maps.LatLngBounds();

        // Add search location
        bounds.extend(
          new google.maps.LatLng(searchLocation.lat, searchLocation.lng)
        );

        // Add all filtered properties
        filteredProperties.forEach((property) => {
          if (property.lat && property.lng) {
            bounds.extend(new google.maps.LatLng(property.lat, property.lng));
          }
        });

        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, 50);
        }
      }
    } else if (filteredProperties.length > 0) {
      const newCenter = calculateCenter(filteredProperties);
      setMapCenter(newCenter);

      if (filteredProperties.length === 1) {
        setCurrentZoom(12);
      } else {
        setCurrentZoom(8);
      }
    }
  }, [
    filteredProperties,
    selectedPropertyWithCoords,
    calculateCenter,
    searchLocation,
  ]);

  useEffect(() => {
    if (mapRef.current && selectedPropertyWithCoords) {
      const newPosition = {
        lat: selectedPropertyWithCoords.lat!,
        lng: selectedPropertyWithCoords.lng!,
      };

      mapRef.current.panTo(newPosition);
      mapRef.current.setZoom(15);
    }
  }, [selectedPropertyWithCoords]);

  // Initialize autocomplete - FIXED
  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
    autocomplete.setOptions({
      types: ["(regions)"], // ✅ Fixed: Using only one type
      componentRestrictions: { country: "in" },
    });
  };

  // Handle place selection - IMPROVED
  // Handle place selection - IMPROVED
const onPlaceChanged = () => {
  if (autocompleteRef.current) {
    const place = autocompleteRef.current.getPlace();

    console.log("Place found:", place);

    // ✅ FIX: Add proper null/undefined checks for place object
    if (!place) {
      console.log("No place selected or place is undefined");
      return;
    }

    // ✅ FIX: Check if place has geometry property before accessing it
    if (place.geometry && place.geometry.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name || "",
        bounds: place.geometry.viewport || undefined,
      };

      console.log("Search location:", location);
      console.log("Total properties available:", propertiesWithCoords.length);

      setSearchLocation(location);
      setSearchQuery(place.formatted_address || place.name || "");
      setIsSearching(true);

      // Center map on searched location
      if (mapRef.current) {
        mapRef.current.panTo({ lat: location.lat, lng: location.lng });
        // Don't set zoom here - let the bounds calculation handle it
      }

      // Debug filtered properties
      setTimeout(() => {
        console.log("Properties after search filter:", filteredProperties);
      }, 500);
    } else {
      // ✅ FIX: Handle cases where place doesn't have geometry
      console.warn("Selected place has no geometry data:", place);
      
      // You might want to show a user-friendly message here
      if (place.formatted_address || place.name) {
        setSearchQuery(place.formatted_address || place.name || "");
        // Optionally show an error message to the user
        console.error("The selected location doesn't have precise coordinates. Please try a different location.");
      }
    }
  }
};

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchLocation(null);
    setIsSearching(false);
    setSelectedProperty(null);

    // Reset to show all properties
    if (mapRef.current && propertiesWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      propertiesWithCoords.forEach((property) => {
        if (property.lat && property.lng) {
          bounds.extend(new google.maps.LatLng(property.lat, property.lng));
        }
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, 50);
      }
    }
  };

  // Update search radius
  const updateSearchRadius = (radius: number) => {
    setSearchRadius(radius);
  };

  const getPropertyImageUrl = (property: any): string => {
    if (property.images && property.images.length > 0) {
      const primaryImage = property.images.find((img: any) => img.is_primary);
      if (primaryImage) return primaryImage.image_url;
      return property.images[0].image_url;
    }

    if (property.primary_image) {
      return property.primary_image;
    }

    return "";
  };

  // Create circular image marker
  const createCircularImageMarker = (
    imageUrl: string,
    listingType: string,
    isSelected: boolean = false
  ): google.maps.Icon => {
    const colors: Record<string, string> = {
      sale: "#EF4444",
      rent: "#3B82F6",
      lease: "#10B981",
    };

    const selectedColors: Record<string, string> = {
      sale: "#DC2626",
      rent: "#1D4ED8",
      lease: "#047857",
    };

    const color = isSelected
      ? selectedColors[listingType]
      : colors[listingType] || "#6B7280";
    const size = isSelected ? 60 : 50;
    const borderWidth = isSelected ? 4 : 2;

    if (!imageUrl) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      if (context) {
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
        context.fillStyle = "white";
        context.fill();
        context.strokeStyle = color;
        context.lineWidth = borderWidth;
        context.stroke();

        context.beginPath();
        context.arc(size / 2, size / 2, size / 2 - 6, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();

        if (isSelected) {
          context.beginPath();
          context.arc(size / 2, size / 2, size / 2 + 2, 0, 2 * Math.PI);
          context.strokeStyle = color + "80";
          context.lineWidth = 2;
          context.stroke();
        }
      }

      return {
        url: canvas.toDataURL(),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size / 2),
      };
    }

    return {
      url: imageUrl,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size / 2),
    };
  };

  const getPropertyMarkerIcon = (
    property: any,
    isSelected: boolean = false
  ) => {
    const imageUrl = getPropertyImageUrl(property);
    return createCircularImageMarker(
      imageUrl,
      property.listing_type,
      isSelected
    );
  };

  const formatPrice = (price: string, listingType: string) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return "Price not available";

    if (numericPrice >= 10000000) {
      return `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
    } else if (numericPrice >= 100000) {
      return `₹${(numericPrice / 100000).toFixed(2)} L`;
    } else {
      const formatter = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      });
      return `₹${formatter.format(numericPrice)}`;
    }
  };

  const getListingTypeColor = (listingType: string) => {
    switch (listingType) {
      case "sale":
        return "bg-red-100 text-red-800 border-red-200";
      case "rent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "lease":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getListingTypeBorderColor = (listingType: string) => {
    switch (listingType) {
      case "sale":
        return "border-red-500";
      case "rent":
        return "border-blue-500";
      case "lease":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  // Handle map load - IMPROVED
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Always fit bounds to show all available properties initially
      if (propertiesWithCoords.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        propertiesWithCoords.forEach((property) => {
          if (property.lat && property.lng) {
            bounds.extend(new google.maps.LatLng(property.lat, property.lng));
          }
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 50);
        }
      }

      if (selectedPropertyWithCoords) {
        map.panTo({
          lat: selectedPropertyWithCoords.lat!,
          lng: selectedPropertyWithCoords.lng!,
        });
        map.setZoom(15);
      }
    },
    [propertiesWithCoords, selectedPropertyWithCoords]
  );

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const displayProperties = filteredProperties.filter((property) =>
    isInIndia(property.lat!, property.lng!)
  );

  if (loadError) {
    return (
      <Card className="p-4">
        <div className="text-red-500 text-center">
          Error loading Google Maps. Please check your API key and try again.
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="p-4">
        <div className="text-center">Loading Google Maps...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="relative w-full h-[calc(100vh-65px)]">
        {/* Search Bar */}
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-80`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10 pointer-events-none" />
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <Input
                type="text"
                placeholder="Search for a city or region in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-white/95 backdrop-blur-sm border-gray-300 focus:border-blue-500 rounded-xl w-full"
              />
            </Autocomplete>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Info */}
          {isSearching && (
            <div className="mt-2 bg-white rounded-lg shadow-lg p-3">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {searchLocation?.address}
                  </div>
                  <div className="text-xs text-gray-600">
                    {displayProperties.length} properties within {searchRadius}
                    km
                    {displayProperties.length > 0 && (
                      <span className="text-green-600 font-semibold ml-2">
                        ✓ Showing {displayProperties.length} properties
                      </span>
                    )}
                    {displayProperties.length === 0 && (
                      <span className="text-red-600 font-semibold ml-2">
                        ✗ No properties found in this area
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Radius Selector */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">
                  Search Radius:
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[10, 25, 50, 100, 200].map((radius) => (
                    <Button
                      key={radius}
                      size="sm"
                      variant={searchRadius === radius ? "default" : "outline"}
                      onClick={() => updateSearchRadius(radius)}
                      className="text-xs h-7"
                    >
                      {radius}km
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <GoogleMap
          zoom={currentZoom}
          center={mapCenter}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            mapTypeControlOptions: {
              position: google.maps.ControlPosition.TOP_RIGHT,
            },
          }}
          onLoad={onMapLoad}
          onClick={() => setSelectedProperty(null)}
        >
          {displayProperties.map((property) => (
            <Marker
              key={property.id}
              position={{ lat: property.lat!, lng: property.lng! }}
              icon={getPropertyMarkerIcon(property, false)}
              onClick={() => handleMarkerClick(property)}
              onMouseOver={() => setHoveredProperty(property)}
              onMouseOut={() => setHoveredProperty(null)}
            />
          ))}

          {selectedPropertyWithCoords && (
            <Marker
              key={`selected-${selectedPropertyWithCoords.id}`}
              position={{
                lat: selectedPropertyWithCoords.lat!,
                lng: selectedPropertyWithCoords.lng!,
              }}
              icon={getPropertyMarkerIcon(selectedPropertyWithCoords, true)}
              onClick={() => handleMarkerClick(selectedPropertyWithCoords)}
              onMouseOver={() => setHoveredProperty(selectedPropertyWithCoords)}
              onMouseOut={() => setHoveredProperty(null)}
              zIndex={1000}
            />
          )}

          {/* Search Location Marker */}
          {searchLocation && (
            <Marker
              position={{
                lat: searchLocation.lat,
                lng: searchLocation.lng,
              }}
              icon={{
                url:
                  "data:image/svg+xml;base64," +
                  btoa(`
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#3B82F6" fill-opacity="0.2"/>
                    <circle cx="16" cy="16" r="8" fill="#3B82F6"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16),
              }}
              zIndex={500}
            />
          )}

          {hoveredProperty && !selectedProperty && (
            <InfoWindow
              position={{
                lat: hoveredProperty.lat!,
                lng: hoveredProperty.lng!,
              }}
              options={{
                disableAutoPan: true,
                pixelOffset: new google.maps.Size(0, -70),
              }}
            >
              <div
                className={`bg-white rounded-lg shadow-lg border-2 ${getListingTypeBorderColor(
                  hoveredProperty.listing_type
                )} p-3 max-w-xs`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                    <img
                      src={getPropertyImageUrl(hoveredProperty)}
                      alt={hoveredProperty.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                            <span class="text-lg">🏠</span>
                          </div>
                        `;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {hoveredProperty.title}
                    </div>
                    <div className="text-xs text-gray-600 mb-1 line-clamp-1">
                      {hoveredProperty.city}, {hoveredProperty.state}
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatPriceRange(
                        hoveredProperty?.price_range?.minimum_price,
                        hoveredProperty?.price_range?.maximum_price
                      )}
                      {hoveredProperty.listing_type === "rent" && "/mo"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {hoveredProperty.bedrooms > 0 &&
                        `${hoveredProperty.bedrooms} Beds • `}
                      {hoveredProperty.bathrooms > 0 &&
                        `${hoveredProperty.bathrooms} Baths • `}
                      {hoveredProperty.total_area} sqft
                    </div>
                    {searchLocation && (
                      <div className="text-xs text-blue-600 mt-1">
                        {calculateDistance(
                          searchLocation.lat,
                          searchLocation.lng,
                          hoveredProperty.lat!,
                          hoveredProperty.lng!
                        ).toFixed(1)}
                        km from search location
                      </div>
                    )}
                    {selectedPropertyWithCoords &&
                      selectedPropertyWithCoords.id === hoveredProperty.id && (
                        <div className="mt-1">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Selected
                          </Badge>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.lat!,
                lng: selectedProperty.lng!,
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="w-80 bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={getPropertyImageUrl(selectedProperty)}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg">
                          <div class="text-gray-400 text-center">
                            <div class="text-4xl mb-2">🏠</div>
                            <div class="text-sm">No Image Available</div>
                          </div>
                        </div>
                      `;
                    }}
                  />

                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`px-3 py-1.5 text-sm font-semibold ${getListingTypeColor(
                        selectedProperty.listing_type
                      )}`}
                    >
                      {formatPriceRange(
                        selectedProperty?.price_range?.minimum_price,
                        selectedProperty?.price_range?.maximum_price
                      )}{" "}
                      {selectedProperty.listing_type === "rent" && "/mo"}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium"
                    >
                      For {selectedProperty.listing_type}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {selectedProperty.title}
                  </h3>
                  {selectedProperty.property_type && (
                    <div className="text-xs text-gray-500 mb-3">
                      Type: {selectedProperty.property_type.name}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-2">📍</span>
                    <span className="line-clamp-1">
                      {selectedProperty.city}, {selectedProperty.state}
                    </span>
                  </div>

                  {searchLocation && (
                    <div className="text-xs text-blue-600 mb-3">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {calculateDistance(
                        searchLocation.lat,
                        searchLocation.lng,
                        selectedProperty.lat!,
                        selectedProperty.lng!
                      ).toFixed(1)}
                      km from {searchLocation.address.split(",")[0]}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-700">
                    {selectedProperty.bedrooms > 0 && (
                      <div className="flex items-center">
                        <span className="mr-1">🛏️</span>
                        <span>{selectedProperty.bedrooms} Bed</span>
                      </div>
                    )}
                    {selectedProperty.bathrooms > 0 && (
                      <div className="flex items-center">
                        <span className="mr-1">🚿</span>
                        <span>{selectedProperty.bathrooms} Bath</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="mr-1">📐</span>
                      <span>{selectedProperty.total_area} sqft</span>
                    </div>
                  </div>

                  {selectedProperty.price_per_sqft && (
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>
                        ₹
                        {parseFloat(
                          selectedProperty.price_per_sqft
                        ).toLocaleString()}
                      </strong>{" "}
                      per sqft
                    </div>
                  )}

                  {selectedProperty.description && (
                    <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {selectedProperty.description}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3">
          <div className="text-sm font-semibold text-gray-900 mb-3">
            Property Types
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">For Sale</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">For Rent</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">For Lease</span>
            </div>
            {selectedPropertyWithCoords && (
              <div className="flex items-center text-xs">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-medium">Selected Property</span>
              </div>
            )}
            {searchLocation && (
              <div className="flex items-center text-xs">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-medium">Search Center</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoogleMapPropertyList;
