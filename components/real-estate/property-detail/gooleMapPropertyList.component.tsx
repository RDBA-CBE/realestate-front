"use client";
import { Card } from "@/components/ui/card";
import { KEY } from "@/utils/constant.utils";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Property interface matching your data structure
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
  lat?:any;
  lng?:any
}

interface GoogleMapsProps {
  properties?: Property[];
}

const GoogleMapPropertyList = (props: GoogleMapsProps) => {
  const { properties = [] } = props;
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: KEY,
    libraries: ["places"],
  });

  // Use useMemo to prevent recalculating on every render
  const propertiesWithCoords = useMemo(() => {
    return properties
      .filter(property => {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);
        const isValid = !isNaN(lat) && !isNaN(lng) && property.is_approved && property.status === 'available';
        return isValid;
      })
      .map(property => ({
        ...property,
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude)
      }));
  }, [properties]);

  // Generate property logo with first letters
  const getPropertyLogo = (title: string, listingType: string) => {
    const letters = title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors: Record<string, string> = {
      sale: '#EF4444', // red
      rent: '#3B82F6', // blue
      lease: '#10B981' // green
    };

    const color = colors[listingType] || '#6B7280'; // gray as fallback

    // Create SVG for custom marker
    const svg = `
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer circle with shadow -->
        <circle cx="25" cy="25" r="24" fill="white" stroke="${color}" stroke-width="2"/>
        <!-- Inner colored circle -->
        <circle cx="25" cy="25" r="18" fill="${color}"/>
        <!-- Text -->
        <text x="25" y="30" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${letters}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Get marker icon based on listing type with property logo
  const getPropertyMarkerIcon = (property: Property) => {
    const imageUrl = getPropertyLogo(property.title, property.listing_type);
    
    return {
      url: imageUrl,
      scaledSize: new window.google.maps.Size(50, 50),
      anchor: new window.google.maps.Point(25, 25),
    };
  };

  // Format price for display
  const formatPrice = (price: string, listingType: string) => {
    const numericPrice = parseFloat(price);
    if (numericPrice >= 10000000) {
      // Convert to Crores
      return `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
    } else if (numericPrice >= 100000) {
      // Convert to Lakhs
      return `₹${(numericPrice / 100000).toFixed(2)} L`;
    } else {
      const formatter = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
      });
      return `₹${formatter.format(numericPrice)}`;
    }
  };

  // Get listing type badge color
  const getListingTypeColor = (listingType: string) => {
    switch (listingType) {
      case 'sale': return 'bg-red-100 text-red-800 border-red-200';
      case 'rent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lease': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get listing type color for hover tooltip
  const getListingTypeBorderColor = (listingType: string) => {
    switch (listingType) {
      case 'sale': return 'border-red-500';
      case 'rent': return 'border-blue-500';
      case 'lease': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

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
      <div className="relative w-full h-[700px]">
        <GoogleMap
          zoom={6}
          center={{ lat: 20.5937, lng: 78.9629 }}
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
              position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
            },
          }}
          onClick={() => setSelectedProperty(null)}
        >
          {/* Property markers */}
          {propertiesWithCoords.map((property) => (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              icon={getPropertyMarkerIcon(property)}
              onClick={() => setSelectedProperty(property)}
              onMouseOver={() => setHoveredProperty(property)}
              onMouseOut={() => setHoveredProperty(null)}
            />
          ))}

          {/* Hover Tooltip */}
          {hoveredProperty && !selectedProperty && (
            <InfoWindow
              position={{
                lat: hoveredProperty.lat,
                lng: hoveredProperty.lng
              }}
              options={{
                disableAutoPan: true,
                pixelOffset: new window.google.maps.Size(0, -60),
              }}
            >
              <div className={`bg-white rounded-lg shadow-lg border-2 ${getListingTypeBorderColor(hoveredProperty.listing_type)} p-3 max-w-xs`}>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {hoveredProperty.title}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {hoveredProperty.city}, {hoveredProperty.state}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {formatPrice(hoveredProperty.price, hoveredProperty.listing_type)}
                  {hoveredProperty.listing_type === 'rent' && '/mo'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {hoveredProperty.bedrooms > 0 && `${hoveredProperty.bedrooms} Beds • `}
                  {hoveredProperty.bathrooms > 0 && `${hoveredProperty.bathrooms} Baths • `}
                  {hoveredProperty.total_area} sqft
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Property Info Window */}
          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.lat,
                lng: selectedProperty.lng
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="w-80 bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  {selectedProperty.primary_image || (selectedProperty.images && selectedProperty.images[0]?.image_url) ? (
                    <img 
                      src={selectedProperty.primary_image || selectedProperty.images![0].image_url} 
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl mb-2">🏠</div>
                        <div className="text-sm">No Image Available</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`px-3 py-1.5 text-sm font-semibold ${getListingTypeColor(selectedProperty.listing_type)}`}>
                      {formatPrice(selectedProperty.price, selectedProperty.listing_type)}
                      {selectedProperty.listing_type === 'rent' && '/mo'}
                    </Badge>
                  </div>
                  
                  {/* Listing Type Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium">
                      For {selectedProperty.listing_type}
                    </Badge>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {selectedProperty.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-2">📍</span>
                    <span className="line-clamp-1">
                      {selectedProperty.city}, {selectedProperty.state}
                    </span>
                  </div>

                  {/* Property Features */}
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

                  {/* Price per sqft */}
                  {selectedProperty.price_per_sqft && (
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>₹{parseFloat(selectedProperty.price_per_sqft).toLocaleString()}</strong> per sqft
                    </div>
                  )}

                  {/* Property Type */}
                  {selectedProperty.property_type && (
                    <div className="text-xs text-gray-500 mb-3">
                      Type: {selectedProperty.property_type.name}
                    </div>
                  )}

                  {/* Description */}
                  {selectedProperty.description && (
                    <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {selectedProperty.description}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Properties Summary */}
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3 min-w-[200px]">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Properties Overview
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total Properties:</span>
              <span className="font-semibold">{propertiesWithCoords.length}</span>
            </div>
            <div className="flex justify-between">
              <span>For Sale:</span>
              <span className="font-semibold text-red-600">
                {propertiesWithCoords.filter(p => p.listing_type === 'sale').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>For Rent:</span>
              <span className="font-semibold text-blue-600">
                {propertiesWithCoords.filter(p => p.listing_type === 'rent').length}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3">
          <div className="text-sm font-semibold text-gray-900 mb-3">Property Types</div>
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
          </div>
        </div>

        {/* Quick Stats */}
        {propertiesWithCoords.length > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg px-4 py-3">
            <div className="text-sm font-semibold text-gray-900 mb-2">Market Stats</div>
            <div className="text-xs text-gray-600">
              <div>Cities: {new Set(propertiesWithCoords.map(p => p.city)).size}</div>
              <div>Avg Price: ₹{
                (propertiesWithCoords.reduce((sum, p) => sum + parseFloat(p.price), 0) / propertiesWithCoords.length / 100000).toFixed(1)
              }L</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GoogleMapPropertyList;