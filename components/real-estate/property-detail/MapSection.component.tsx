"use client";

import { Card, CardContent } from "@/components/ui/card";
import { KEY } from "@/utils/constant.utils";
import { useEffect, useRef, useState } from "react";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

export default function MapSection(props) {
  const { data } = props;

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [map, setMap] = useState(null);
  const [activeFilter, setActiveFilter] = useState("popular");
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const radius = 3000; // 3km
  const maxPlaces = 5;

  const placeTypes = {
    popular: {
      label: "Popular",
      color: "#f59e0b",
      apiTypes: ["tourist_attraction", "point_of_interest"],
    },
    education: {
      label: "Education",
      color: "#3F51B5",
      apiTypes: ["school", "university"],
    },
    healthcare: {
      label: "Healthcare",
      color: "#E91E63",
      apiTypes: ["hospital", "pharmacy"],
    },
    shopping: {
      label: "Shopping",
      color: "#009688",
      apiTypes: ["shopping_mall", "supermarket"],
    },
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: KEY,
    libraries: ["places"],
  });

  // Deep clean place data to remove ALL deprecated properties
  const deepCleanPlaceData = (place) => {
    if (!place || typeof place !== 'object') return place;
    
    // Create a clean copy without deprecated properties
    const cleaned = JSON.parse(JSON.stringify(place));
    
    // Recursively remove deprecated properties from all nested objects
    const removeDeprecated = (obj) => {
      if (obj && typeof obj === 'object') {
        // Remove both deprecated properties
        if (obj.hasOwnProperty('permanently_closed')) {
          delete obj.permanently_closed;
        }
        if (obj.hasOwnProperty('open_now')) {
          delete obj.open_now;
        }
        
        // Recursively clean all nested objects and arrays
        Object.keys(obj).forEach(key => {
          if (obj[key] && typeof obj[key] === 'object') {
            removeDeprecated(obj[key]);
          }
        });
      }
    };
    
    removeDeprecated(cleaned);
    return cleaned;
  };

  // Initialize map center
  useEffect(() => {
    if (!isLoaded) return;
    
    const propertyLocation = data?.latitude && data?.longitude
      ? { 
          lat: parseFloat(data.latitude), 
          lng: parseFloat(data.longitude) 
        }
      : { lat: 13.0827, lng: 80.2707 }; // Chennai fallback

    setMapCenter(propertyLocation);
    setUserLocation(propertyLocation);
    setIsLoading(false);
  }, [isLoaded, data]);

  // Setup directions service
  useEffect(() => {
    if (isLoaded && map) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#2563EB",
          strokeWeight: 5,
        },
      });
    }
  }, [isLoaded, map]);

  // Load places when filter changes or on initial load
  useEffect(() => {
    if (!isLoaded || !map || !userLocation) return;
    loadPlaces(activeFilter);
  }, [isLoaded, map, userLocation, activeFilter]);

  // Load places by category with proper error handling
  const loadPlaces = (filterType) => {
    if (!map || !userLocation) return;

    const types = placeTypes[filterType].apiTypes;
    const service = new window.google.maps.places.PlacesService(map);

    let collected = [];
    let requestsCompleted = 0;

    types.forEach((type) => {
      service.nearbySearch(
        { 
          location: userLocation, 
          radius, 
          type 
        },
        (results, status) => {
          requestsCompleted++;
          
          if (status === "OK" && results) {
            const validResults = results
              .filter((r) =>
                r.geometry?.location &&
                r.business_status !== "CLOSED_PERMANENTLY"
              )
              .slice(0, maxPlaces)
              .map((r) => ({ 
                ...deepCleanPlaceData(r), 
                category: filterType 
              }));

            collected = [...collected, ...validResults];
          }

          // When all requests for this filter are complete
          if (requestsCompleted === types.length) {
            // Remove duplicates and limit to maxPlaces
            const uniquePlaces = collected.reduce((acc, current) => {
              if (!acc.find(place => place.place_id === current.place_id)) {
                acc.push(current);
              }
              return acc;
            }, []).slice(0, maxPlaces);

            setPlaces(uniquePlaces);
            
            // Adjust zoom if we have places
            if (uniquePlaces.length > 0) {
              setZoomLevel(14);
            }
          }
        }
      );
    });
  };

  // Handle filter selection
  const handleFilterClick = (filterType) => {
    if (filterType === activeFilter) {
      // If clicking the same filter, toggle back to popular
      setActiveFilter("popular");
    } else {
      setActiveFilter(filterType);
    }
    setSelectedPlace(null);
    clearDirections();
  };

  // Directions calculation
  const calculateRoute = (destination) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    directionsServiceRef.current.route(
      {
        origin: userLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  // Clear directions
  const clearDirections = () => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
    setDistance(null);
    setDuration(null);
  };

  // Marker Icons
  const createPropertyMarker = () => ({
    url: "data:image/svg+xml," + encodeURIComponent(`
      <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" fill="#1D4ED8" stroke="white" stroke-width="3"/>
        <path d="M20 35L30 20L40 35V45H20V35Z" fill="white"/>
        <rect x="26" y="38" width="8" height="7" fill="#1D4ED8"/>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(50, 50),
    anchor: new window.google.maps.Point(25, 50),
  });

  const createPlaceMarker = (place) => {
    const color = placeTypes[place.category]?.color || "#666";
    return {
      url: "data:image/svg+xml," + encodeURIComponent(`
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="30" fill="${color}" opacity="0.9" />
          <path d="M25 48L40 28L55 48V55H25V48Z" fill="white"/>
          <rect x="35" y="50" width="10" height="8" fill="${color}"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(45, 45),
      anchor: new window.google.maps.Point(22, 45),
    };
  };

  const getPlacePhotoUrl = (place) => {
    if (place.photos?.[0]?.getUrl) {
      return place.photos[0].getUrl({ width: 300, height: 150 });
    }
    return `https://via.placeholder.com/300x150/f3f4f6/6b7280?text=${encodeURIComponent(place.name)}`;
  };

  // Handle map click to clear selection
  const handleMapClick = () => {
    setSelectedPlace(null);
    clearDirections();
  };

  if (loadError) {
    return (
      <Card className="rounded-2xl shadow p-6">
        <div className="text-center text-red-500 py-8">
          Error loading Google Maps. Please try again later.
        </div>
      </Card>
    );
  }

  if (!isLoaded || isLoading || !mapCenter) {
    return (
      <Card className="rounded-2xl shadow p-6">
        <div className="text-center text-gray-500 py-8">
          Loading map...
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">
        Location & Nearby Amenities
      </h3>

      <CardContent className="space-y-2 mb-6">
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-700">Address</span>
          <span>{data?.address || "Not specified"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-700">City</span>
          <span>{data?.city || "Not specified"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-700">State</span>
          <span>{data?.state || "Not specified"}</span>
        </div>
      </CardContent>

      <div style={{ position: "relative", width: "100%", height: "70vh" }}>
        <GoogleMap
          zoom={zoomLevel}
          center={mapCenter}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={(mapInstance) => setMap(mapInstance)}
          onClick={handleMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Property Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={createPropertyMarker()}
              title="Project Location"
              zIndex={1000}
            />
          )}

          {/* Nearby Places */}
          {places.map((place) => (
            <Marker
              key={place.place_id}
              position={place.geometry.location}
              icon={createPlaceMarker(place)}
              title={place.name}
              onClick={() => {
                const cleanedPlace = deepCleanPlaceData(place);
                setSelectedPlace(cleanedPlace);
                calculateRoute(cleanedPlace.geometry.location);
              }}
            />
          ))}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.geometry.location}
              onCloseClick={() => {
                setSelectedPlace(null);
                clearDirections();
              }}
            >
              <div style={{ maxWidth: "280px", padding: "0" }}>
                <img
                  src={getPlacePhotoUrl(selectedPlace)}
                  alt={selectedPlace.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <div style={{ padding: "12px" }}>
                  <h4 style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: "16px", 
                    fontWeight: "600" 
                  }}>
                    {selectedPlace.name}
                  </h4>
                  <p style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: "14px", 
                    color: "#666" 
                  }}>
                    {selectedPlace.vicinity}
                  </p>
                  {selectedPlace.rating && (
                    <p style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "14px" 
                    }}>
                      ⭐ {selectedPlace.rating} 
                      {selectedPlace.user_ratings_total && 
                        ` (${selectedPlace.user_ratings_total} reviews)`
                      }
                    </p>
                  )}
                  {distance && duration && (
                    <p style={{ 
                      margin: "0", 
                      fontSize: "14px", 
                      color: "#2563EB",
                      fontWeight: "500"
                    }}>
                      🚗 {distance} • {duration}
                    </p>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Radius Circle */}
          {activeFilter && activeFilter !== "popular" && (
            <Circle
              center={userLocation}
              radius={radius}
              options={{
                fillColor: placeTypes[activeFilter].color + "20",
                fillOpacity: 0.1,
                strokeColor: placeTypes[activeFilter].color,
                strokeOpacity: 0.3,
                strokeWeight: 1,
              }}
            />
          )}
        </GoogleMap>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {Object.entries(placeTypes).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleFilterClick(key)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                activeFilter === key 
                  ? 'text-white shadow-md' 
                  : 'text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
              style={{
                backgroundColor: activeFilter === key ? cfg.color : 'white',
                borderColor: activeFilter === key ? cfg.color : '#E5E7EB',
              }}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Status Info */}
        <div className="text-center mt-2 text-sm text-gray-600">
          {activeFilter === "popular" 
            ? "Showing popular places nearby" 
            : `Showing ${places.length} ${placeTypes[activeFilter].label.toLowerCase()} places within 3km`
          }
        </div>
      </div>
    </Card>
  );
}