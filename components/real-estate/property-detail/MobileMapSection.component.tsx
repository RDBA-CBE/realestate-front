"use client";
import { Card, CardContent } from "@/components/ui/card";
import { KEY } from "@/utils/constant.utils";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import {
  BusIcon,
  HospitalIcon,
  Icon,
  MapPin,
  School,
  School2,
  ShoppingBag,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const GoogleMaps = (props) => {
  const { data } = props;
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState(null); // Start with null to indicate loading
  const [map, setMap] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showList, setShowList] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const autocompleteRef = useRef(null);
  const radius = 3000; // 3km radius

  const [showMap, setShowMap] = useState(false);


  // Place type configuration
  const placeTypes = {
    education: {
      apiType: "school",
      label: "Education",
      icon: School2,
      iconUrl: "/assets/images/school.png",
      color: "#3F51B5",
    },
    healthcare: {
      apiType: "hospital",
      label: "Healthcare",
      icon: HospitalIcon,
      iconUrl: "/assets/images/hospital.jpg",
      color: "#E91E63",
    },
    commute: {
      apiType: "transit_station",
      label: "Commute",
      icon: BusIcon,
      iconUrl: "/assets/images/subway_station.jpg",
      color: "#009688",
    },
    food: {
      apiType: "restaurant",
      label: "Food & Dining",
      icon: UtensilsCrossed,
      iconUrl: "/assets/images/restaurant.jpg",
      color: "#FF5722",
    },
    shopping: {
      apiType: "shopping_mall",
      label: "Shopping",
      icon: ShoppingBag,
      iconUrl: "/assets/images/shopping_mall.png",
      color: "#795548",
    },
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: KEY,
    libraries: ["places"],
  });

  // Get user's current location when component mounts
  useEffect(() => {
    if (!isLoaded) return;

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            setMapCenter(location);
            setIsLoading(false);
          },
          (error) => {
            console.log("Geolocation error:", error);
            // Fallback to default location (Chennai)
            const defaultLocation = { lat: 13.0827, lng: 80.2707 };
            setUserLocation(defaultLocation);
            setMapCenter(defaultLocation);
            setIsLoading(false);
          }
        );
      } else {
        // Browser doesn't support Geolocation
        const defaultLocation = { lat: 13.0827, lng: 80.2707 };
        setUserLocation(defaultLocation);
        setMapCenter(defaultLocation);
        setIsLoading(false);
      }
    };

    getLocation();
  }, [isLoaded]);

  // Load places when filter changes or when user location is detected
  useEffect(() => {
    if (!isLoaded || !map || !activeFilter || !userLocation) return;

    const service = new window.google.maps.places.PlacesService(map);
    const placeType = placeTypes[activeFilter].apiType;

    service.nearbySearch(
      {
        location: userLocation,
        radius: radius,
        type: placeType,
      },
      (results, status) => {
        if (status === "OK" && results) {
          const filteredPlaces = results.filter(
            (result) => result.geometry?.location
          );
          setPlaces(filteredPlaces);
          setShowList(true);
        }
      }
    );
  }, [isLoaded, map, activeFilter, userLocation]);

  // Get current location when user clicks the locate button
  const handleLocateMe = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          if (map) {
            map.panTo(location);
          }
          setIsLoading(false);
        },
        () => {
          alert("Unable to get your location. Using current location.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
    setSelectedPlace(null);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log("place", place);

      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(location);
        setUserLocation(location);
        if (map) {
          map.panTo(location);
        }
        setPlaces([]);
        setShowList(false);
      }
    }
  };

  if (loadError) {
    return <div>Error loading map. Please try again later.</div>;
  }

  if (!isLoaded || isLoading || !mapCenter) {
    return <div>Loading map and your location...</div>;
  }

  return (
    <>
    {/* ---- Property Card ---- */}
      <Card
        className="flex items-center gap-3 p-4 mt-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 w-[100%] cursor-pointer "
        onClick={() => setShowMap(true)}
      >
        <div className="flex items-center justify-center w-20 h-14 xs:w-12 xs:h-12  sm:w-14 sm:h-14  bg-white rounded-full border border-gray-200">
          <MapPin className="text-red-600 w-6 h-6" />
        </div>

        <CardContent className="p-0">
          <p className="text-xs text-gray-500">Property Location</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {data?.address || "Not specified"}
          </p>
          <a
            href="#"
            className="text-xs text-red-600 hover:underline font-medium"
          >
            View on Map
          </a>
        </CardContent>
      </Card>

      {/* ---- Full Screen Map Overlay ---- */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Close button */}
          <button
            onClick={() => setShowMap(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* ---- MAP SECTION ---- */}
          <div className="flex-1 relative">
            <GoogleMap
              zoom={15}
              center={mapCenter}
              onLoad={(map) => setMap(map)}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onClick={() => setSelectedPlace(null)}
            >
              {/* Current location marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "/assets/images/park.png",
                  }}
                  zIndex={1000}
                />
              )}

              {/* Nearby markers */}
              {activeFilter &&
                places.map((place) => (
                  <Marker
                    key={place.place_id}
                    position={place.geometry.location}
                    icon={{
                      url: placeTypes[activeFilter].iconUrl,
                    }}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}

              {/* InfoWindow */}
              {selectedPlace && (
                <InfoWindow
                  position={selectedPlace.geometry.location}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div style={{ padding: "8px", maxWidth: "250px" }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                      {selectedPlace.name}
                    </h3>
                    <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                      {selectedPlace.vicinity}
                    </p>
                    {selectedPlace.rating && (
                      <p style={{ margin: "0 0 8px 0" }}>
                        ★ {selectedPlace.rating} (
                        {selectedPlace.user_ratings_total || 0} reviews)
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        backgroundColor: "#4285F4",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      View Details
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* ---- Search box ---- */}
            <div className="absolute top-5 left-5 z-50 w-[300px]">
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                  autocomplete.setComponentRestrictions({ country: "in" });
                }}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full px-4 py-2 rounded-full border border-gray-200 shadow-lg outline-none"
                />
              </Autocomplete>
            </div>

            {/* ---- Locate Me Button ---- */}
            <button
              onClick={handleLocateMe}
              className="absolute top-[90px] left-5 z-50 p-2 bg-white border border-gray-200 rounded-md shadow-md hover:bg-gray-50"
            >
              <img
                src="/assets/images/locate-me.png"
                alt="Locate me"
                className="w-5 h-5"
              />
            </button>

            {/* ---- Places List Panel ---- */}
            {showList && activeFilter && (
              <div className="absolute bottom-0 left-5 right-5 z-50 bg-white shadow-xl rounded-t-2xl max-h-[50vh] overflow-y-auto border-t">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-1">
                      {(() => {
                        const ActiveIcon = placeTypes[activeFilter]?.icon;
                        if (!ActiveIcon) return null;
                        return (
                          <ActiveIcon
                            className="w-5 h-5"
                            style={{
                              color: placeTypes[activeFilter]?.color,
                            }}
                          />
                        );
                      })()}
                      {places.length} {placeTypes[activeFilter]?.label} nearby
                    </h3>
                    <button
                      onClick={() => setShowList(false)}
                      className="text-2xl font-bold text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  {places.slice(0, 10).map((place) => (
                    <div
                      key={place.place_id}
                      onClick={() => {
                        setSelectedPlace(place);
                        map.panTo(place.geometry.location);
                        map.setZoom(16);
                        setShowList(false);
                      }}
                      className={`p-2 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedPlace?.place_id === place.place_id
                          ? "bg-gray-100"
                          : ""
                      }`}
                    >
                      <h4 className="font-medium text-sm">{place.name}</h4>
                      <p className="text-xs text-gray-600">
                        {place.vicinity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- Filter Buttons ---- */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 bg-white border-t overflow-x-auto z-50">
              {Object.entries(placeTypes).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleFilterClick(key)}
                  className={`px-4 py-1 rounded-full border text-sm font-medium flex items-center gap-2 whitespace-nowrap transition ${
                    activeFilter === key
                      ? "bg-opacity-10 font-semibold"
                      : "bg-white"
                  }`}
                  style={{
                    color: config.color,
                    borderColor: config.color,
                    backgroundColor:
                      activeFilter === key ? config.color + "20" : "#fff",
                  }}
                >
                  <config.icon className="w-4" />
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleMaps;
