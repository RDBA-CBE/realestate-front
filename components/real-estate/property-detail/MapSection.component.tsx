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
  School,
  School2,
  ShoppingBag,
  UtensilsCrossed,
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
    <Card className="border-none shadow-none bg-transparent">
      <h3 className="text-xl font-semibold mb-4">
        Location & Nearby Amenities
      </h3>

      <CardContent className="space-y-2 mb-6">
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-500">Address</span>
          <span>{data?.address || "Not specified"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-500">City</span>
          <span>{data?.city || "Not specified"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-500">State</span>
          <span>{data?.state || "Not specified"}</span>
        </div>
      </CardContent>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Map */}
          <div style={{ flex: 1 }}>
            <GoogleMap
              zoom={15}
              center={mapCenter}
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map)}
              onClick={() => {
                setSelectedPlace(null);
              }}
            >
              {/* Current location marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "/assets/images/park.png",
                    // scaledSize: { width: 60, height: 40 },
                  }}
                  zIndex={1000}
                />
              )}

              {/* Place markers */}
              {activeFilter &&
                places.map((place) => (
                  <Marker
                    key={place.place_id}
                    position={place.geometry.location}
                    icon={{
                      url: placeTypes[activeFilter].iconUrl,
                      // scaledSize: { width: 32, height: 32 },
                    }}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}

              {/* Info window */}
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
          </div>

          {/* Search box */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              zIndex: 10,
              width: "300px",
            }}
          >
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
                style={{
                  width: "100%",
                  padding: "8px 12px ",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  boxShadow: "0 2px 10px 7px #00000033",
                  outline: "none",
                }}
              />
            </Autocomplete>
          </div>

          {/* Locate me button */}
          <button
            onClick={handleLocateMe}
            style={{
              position: "absolute",
              top: "70px",
              left: "20px",
              zIndex: 10,
              padding: "8px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            <img
              src="/assets/images/locate-me.png"
              alt="Locate me"
              style={{ width: "20px", height: "20px" }}
            />
          </button>

          {/* Places list panel */}
          {showList && activeFilter && (
            <div
              style={{
                position: "absolute",
                bottom: "0px",
                left: "20px",
                right: "20px",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                boxShadow: "0 2px 10px 7px #00000033",
                overflow: "hidden", // <-- clip scrollbar inside
                zIndex: 10,
                width: "60%",
                margin: "auto",
              }}
            >
              <div
                style={{
                  maxHeight: "25vh",
                  overflowY: "auto", // <-- scrollbar stays inside
                  backgroundColor: "white",
                  padding: "16px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      borderBottom: "1px solid #eee",
                      width: "100%",
                      paddingBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {(() => {
                      const ActiveIcon = placeTypes[activeFilter]?.icon;
                      if (!ActiveIcon) return null;
                      return (
                        <ActiveIcon
                          style={{
                            width: "20px",
                            height: "20px",
                            color: placeTypes[activeFilter]?.color,
                          }}
                        />
                      );
                    })()}
                    {places.length} {placeTypes[activeFilter]?.label} around
                    your location
                  </h3>
                  <button
                    onClick={() => setShowList(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                      marginTop: "-20px",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {places.slice(0, 10).map((place) => (
                    <div
                      key={place.place_id}
                      style={{
                        padding: "5px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        backgroundColor:
                          selectedPlace?.place_id === place.place_id
                            ? "#f5f5f5"
                            : "white",
                      }}
                      onClick={() => {
                        setSelectedPlace(place);
                        map.panTo(place.geometry.location);
                        map.setZoom(16);
                        setShowList(false);
                      }}
                    >
                      <h4 style={{ margin: "0 0 2px 0", fontSize: "16px" }}>
                        {place.name}
                      </h4>
                      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                        {place.vicinity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter buttons */}
        <div
          style={{
            display: "flex",
            padding: "12px 16px",
            backgroundColor: "#fff",
            borderTop: "1px solid #eee",
            gap: "8px",
            overflowX: "auto",
          }}
        >
          {Object.entries(placeTypes).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleFilterClick(key)}
              style={{
                padding: "6px 16px",
                backgroundColor:
                  activeFilter === key ? config.color + "20" : "#fff",
                color:  config.color ,
                border: `1px solid ${
                  config.color 
                }`,
                borderRadius: "20px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: activeFilter === key ? "600" : "400",
                transition: "all 0.2s",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>
                <config.icon className="w-4" />{" "}
              </span>{" "}
              {config.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GoogleMaps;
