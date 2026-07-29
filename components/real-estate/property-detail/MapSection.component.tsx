"use client";
import { Card, CardContent } from "@/components/ui/card";
import { KEY } from "@/utils/constant.utils";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { ChevronDown, ChevronUp, Maximize2, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const LIBRARIES: ("places")[] = ["places"];
const INITIAL_MAP_ZOOM = 18;
const FULLSCREEN_CONTROLS_HEIGHT = 184;
const OVERLAY_HEADER_HEIGHT = 60;
const FULLSCREEN_PANEL_WIDTH = "min(56rem,calc(100vw-3rem))";

const ROUTE_COLORS = [
  "#E53935", "#8E24AA", "#1E88E5", "#00897B", "#F4511E",
  "#6D4C41", "#039BE5", "#7CB342", "#FB8C00", "#3949AB",
];

// SVG icon URLs for map markers (data URIs)
const MARKER_ICONS: Record<string, string> = {
  school: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  university: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  hospital: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  pharmacy: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  bus_station: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  subway_station: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  restaurant: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  cafe: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  shopping_mall: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  supermarket: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  park: "https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
  nature_reserve: "https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
};

const placeTypes = {
  education: {
    label: "Education",
    color: "#6C3FE8",
    bgActive: "#EDE9FF",
    subCats: [
      { label: "School", type: "school" },
      { label: "University", type: "university" },
    ],
    // inline SVG as data URI for circle icon
    svgIcon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'>
      <circle cx='32' cy='32' r='30' stroke='%236C3FE8' stroke-width='2'/>
      <rect x='18' y='28' width='28' height='18' rx='2' stroke='%236C3FE8' stroke-width='2'/>
      <path d='M24 28V24a8 8 0 0116 0v4' stroke='%23F5A623' stroke-width='2'/>
      <rect x='28' y='34' width='8' height='6' rx='1' fill='%236C3FE8'/>
      <path d='M32 18v-4M28 16l4-4 4 4' stroke='%23F5A623' stroke-width='2' stroke-linecap='round'/>
    </svg>`,
  },
  healthcare: {
    label: "Healthcare",
    color: "#E91E63",
    bgActive: "#FCE4EC",
    subCats: [
      { label: "Hospital", type: "hospital" },
      { label: "Pharmacy", type: "pharmacy" },
    ],
    svgIcon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'>
      <circle cx='32' cy='32' r='30' stroke='%23E91E63' stroke-width='2'/>
      <rect x='20' y='20' width='24' height='24' rx='3' stroke='%23E91E63' stroke-width='2'/>
      <path d='M32 25v14M25 32h14' stroke='%23F5A623' stroke-width='2.5' stroke-linecap='round'/>
    </svg>`,
  },
  commute: {
    label: "Commute",
    color: "#009688",
    bgActive: "#E0F2F1",
    subCats: [
      { label: "Bus Station", type: "bus_station" },
      { label: "Metro", type: "subway_station" },
    ],
    svgIcon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'>
      <circle cx='32' cy='32' r='30' stroke='%23009688' stroke-width='2'/>
      <rect x='18' y='22' width='28' height='20' rx='4' stroke='%23009688' stroke-width='2'/>
      <circle cx='24' cy='46' r='3' fill='%23F5A623'/>
      <circle cx='40' cy='46' r='3' fill='%23F5A623'/>
      <path d='M18 34h28' stroke='%23009688' stroke-width='2'/>
      <path d='M26 22v-4h12v4' stroke='%23F5A623' stroke-width='2'/>
    </svg>`,
  },
  food: {
    label: "Food and...",
    color: "#FF5722",
    bgActive: "#FBE9E7",
    subCats: [
      { label: "Restaurant", type: "restaurant" },
      { label: "Cafe", type: "cafe" },
    ],
    svgIcon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'>
      <circle cx='32' cy='32' r='30' stroke='%23FF5722' stroke-width='2'/>
      <path d='M22 18v10c0 3 2 5 5 5v13' stroke='%23FF5722' stroke-width='2' stroke-linecap='round'/>
      <path d='M22 18v6M26 18v6' stroke='%23F5A623' stroke-width='2' stroke-linecap='round'/>
      <path d='M38 18c0 0 4 4 4 10s-4 10-4 10v8' stroke='%23FF5722' stroke-width='2' stroke-linecap='round'/>
    </svg>`,
  },
  parks: {
    label: "Parks",
    color: "#4CAF50",
    bgActive: "#E8F5E9",
    subCats: [
      { label: "Park", type: "park" },
      { label: "Nature", type: "nature_reserve" },
    ],
    svgIcon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'>
      <circle cx='32' cy='32' r='30' stroke='%234CAF50' stroke-width='2'/>
      <path d='M32 44V30' stroke='%234CAF50' stroke-width='2' stroke-linecap='round'/>
      <ellipse cx='32' cy='24' rx='10' ry='8' fill='%234CAF50' opacity='0.3' stroke='%234CAF50' stroke-width='2'/>
      <ellipse cx='24' cy='30' rx='8' ry='6' fill='%234CAF50' opacity='0.3' stroke='%234CAF50' stroke-width='2'/>
      <ellipse cx='40' cy='30' rx='8' ry='6' fill='%234CAF50' opacity='0.3' stroke='%234CAF50' stroke-width='2'/>
      <path d='M20 44h24' stroke='%23F5A623' stroke-width='2' stroke-linecap='round'/>
    </svg>`,
  },
};

function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

function getZoomForDistance(distanceKm: number) {
  if (distanceKm <= 1) return 15;
  if (distanceKm <= 2.5) return 14;
  if (distanceKm <= 5) return 13;
  if (distanceKm <= 10) return 12;
  if (distanceKm <= 20) return 11;
  return 10;
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml,${svg.replace(/\s+/g, " ")}`;
}

export default function GoogleMaps({ data }: { data: any }) {
  const propertyLocation = {
    lat: parseFloat(data?.latitude),
    lng: parseFloat(data?.longitude),
  };

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [directions, setDirections] = useState<Record<string, google.maps.DirectionsResult>>({});
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMap, setFullscreenMap] = useState<google.maps.Map | null>(null);
  const [generatedAddress, setGeneratedAddress] = useState("");

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: KEY, libraries: LIBRARIES });

  useEffect(() => {
    if (!isLoaded || !Number.isFinite(propertyLocation.lat) || !Number.isFinite(propertyLocation.lng)) {
      setGeneratedAddress("");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: propertyLocation }, (results, status) => {
      if (status === "OK" && results?.[0]?.formatted_address) {
        setGeneratedAddress(results[0].formatted_address);
        return;
      }
      setGeneratedAddress("");
    });
  }, [isLoaded, propertyLocation.lat, propertyLocation.lng]);

  const fetchPlaces = useCallback(
    (type: string) => {
      if (!map) return;
      setLoadingPlaces(true);
      setPlaces([]);
      setDirections({});
      setActiveRoute(null);
      setOverlayOpen(true);
      new window.google.maps.places.PlacesService(map).nearbySearch(
        { location: propertyLocation, radius: 3000, type },
        (results, status) => {
          setLoadingPlaces(false);
          if (status === "OK" && results) setPlaces(results.filter((r) => r.geometry?.location));
        }
      );
    },
    [map, propertyLocation.lat, propertyLocation.lng]
  );

  useEffect(() => {
    if (activeSubCat) fetchPlaces(activeSubCat);
  }, [activeSubCat, fetchPlaces]);

  const handleModuleClick = (key: string) => {
    if (activeModule === key) {
      setActiveModule(null);
      setActiveSubCat(null);
      setPlaces([]);
      setDirections({});
      setActiveRoute(null);
    } else {
      const first = placeTypes[key as keyof typeof placeTypes].subCats[0].type;
      setActiveModule(key);
      setActiveSubCat(first);
    }
  };

  const focusSelectedPlace = (place: google.maps.places.PlaceResult) => {
    const activeMap = isFullscreen ? fullscreenMap : map;
    if (!activeMap || !place.geometry?.location) return;

    const loc = place.geometry.location;
    const lat = typeof loc.lat === "function" ? loc.lat() : (loc as any).lat;
    const lng = typeof loc.lng === "function" ? loc.lng() : (loc as any).lng;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const distanceKm = Number(calcDistanceKm(propertyLocation.lat, propertyLocation.lng, lat, lng));

    activeMap.panTo({
      lat: (propertyLocation.lat + lat) / 2,
      lng: (propertyLocation.lng + lng) / 2,
    });
    activeMap.setZoom(getZoomForDistance(distanceKm));
  };

  const handlePlaceClick = (place: google.maps.places.PlaceResult, i: number) => {
    const id = place.place_id!;
    if (activeRoute === id) { setActiveRoute(null); setOverlayOpen(true); return; }
    if (directions[id]) {
      setActiveRoute(id);
      setOverlayOpen(false);
      focusSelectedPlace(place);
      return;
    }
    new window.google.maps.DirectionsService().route(
      { origin: propertyLocation, destination: place.geometry!.location!, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections((prev) => ({ ...prev, [id]: result }));
          setActiveRoute(id);
          setOverlayOpen(false);
          focusSelectedPlace(place);
        }
      }
    );
  };

  if (loadError) return <div>Error loading map.</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  const activeConfig = activeModule ? placeTypes[activeModule as keyof typeof placeTypes] : null;
  const subCatLabel = activeConfig?.subCats.find((s) => s.type === activeSubCat)?.label ?? "";

  const startMarkerUrl = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56"><path d="M24 2C13.5 2 5 10.5 5 21c0 14 19 33 19 33s19-19 19-33C43 10.5 34.5 2 24 2z" fill="#9b0f09" stroke="white" stroke-width="1.5"/><path d="M24 13L14 21h3v9h5v-5h4v5h5V21h3L24 13z" fill="white"/></svg>');
  const startMarkerActiveUrl = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="64" viewBox="0 0 56 64"><path d="M28 2C15.8 2 6 11.8 6 24c0 16 22 38 22 38s22-22 22-38C50 11.8 40.2 2 28 2z" fill="#9b0f09" stroke="white" stroke-width="2"/><path d="M28 14L16 24h4v12h6v-7h4v7h6V24h4L28 14z" fill="white"/></svg>');
  const endMarkerUrl = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="64" viewBox="0 0 56 64"><path d="M28 2C15.8 2 6 11.8 6 24c0 16 22 38 22 38s22-22 22-38C50 11.8 40.2 2 28 2z" fill="#1B8A4E" stroke="white" stroke-width="2"/><circle cx="28" cy="24" r="8" fill="white" opacity="0.3"/><circle cx="28" cy="24" r="5" fill="white"/><circle cx="28" cy="24" r="2.5" fill="#1B8A4E"/></svg>');

  const renderMapContent = () => (
    <>
      <Marker
        position={propertyLocation}
        icon={{ url: startMarkerUrl, scaledSize: new window.google.maps.Size(48, 56), anchor: new window.google.maps.Point(24, 56) }}
        zIndex={1000}
      />
      {places.map((place, i) => (
        <Marker
          key={place.place_id}
          position={place.geometry!.location!}
          icon={{ url: MARKER_ICONS[activeSubCat ?? ""] || "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", scaledSize: new window.google.maps.Size(32, 32) }}
          onClick={() => handlePlaceClick(place, i)}
          zIndex={activeRoute === place.place_id ? 999 : 1}
        />
      ))}
      {activeRoute && directions[activeRoute] && (
        <DirectionsRenderer
          directions={directions[activeRoute]}
          options={{ preserveViewport: true, suppressMarkers: true, polylineOptions: { strokeColor: ROUTE_COLORS[places.findIndex((p) => p.place_id === activeRoute) % ROUTE_COLORS.length], strokeWeight: 5, strokeOpacity: 0.85 } }}
        />
      )}
      {activeRoute && (
        <Marker
          position={propertyLocation}
          icon={{ url: startMarkerActiveUrl, scaledSize: new window.google.maps.Size(56, 64), anchor: new window.google.maps.Point(28, 64) }}
          zIndex={3000}
          title="Your Property"
        />
      )}
      {activeRoute && (() => {
        const destPlace = places.find((p) => p.place_id === activeRoute);
        if (!destPlace?.geometry?.location) return null;
        return (
          <Marker
            position={destPlace.geometry.location}
            icon={{ url: endMarkerUrl, scaledSize: new window.google.maps.Size(56, 64), anchor: new window.google.maps.Point(28, 64) }}
            zIndex={2000}
            title={destPlace.name}
          />
        );
      })()}
    </>
  );

  const renderOverlay = (isFullscreenView = false) => {
    const overlayMaxHeight = isFullscreenView
      ? `calc(100dvh - ${FULLSCREEN_CONTROLS_HEIGHT + 132}px)`
      : "260px";

    return activeSubCat && (
    <div
      className={`absolute flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden ${
        isFullscreenView
          ? "left-1/2 -translate-x-1/2"
          : "left-4 right-4 sm:left-1/2 sm:right-auto sm:w-[min(48rem,calc(100%-5rem))] sm:-translate-x-1/2"
      }`}
      style={{
        zIndex: isFullscreenView ? 30 : 10,
        bottom: isFullscreenView ? `${FULLSCREEN_CONTROLS_HEIGHT + 36}px` : "1rem",
        maxHeight: overlayOpen ? overlayMaxHeight : `${OVERLAY_HEADER_HEIGHT}px`,
        minHeight: `${OVERLAY_HEADER_HEIGHT}px`,
        transition: "max-height 0.3s ease",
        ...(isFullscreenView ? { width: FULLSCREEN_PANEL_WIDTH } : {}),
      }}
    >
      <div
        className="flex min-h-[60px] items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setOverlayOpen((v) => !v)}
      >
        <div className="flex min-w-0 items-center gap-3">
          {activeConfig && <img src={svgToDataUri(activeConfig.svgIcon)} alt={activeConfig.label} className="w-8 h-8 flex-shrink-0" />}
          <span className="min-w-0 truncate font-semibold text-gray-800 text-sm">
            {loadingPlaces ? "Loading..." : `${places.length} ${subCatLabel}${places.length !== 1 ? "s" : ""} around your home`}
          </span>
        </div>
        {overlayOpen ? <ChevronDown size={18} className="flex-shrink-0 text-gray-500" /> : <ChevronUp size={18} className="flex-shrink-0 text-gray-500" />}
      </div>
      {overlayOpen && (
        <div
          className="flex-1 overflow-y-auto border-t"
          style={{
            maxHeight: `calc(${overlayMaxHeight} - ${OVERLAY_HEADER_HEIGHT}px)`,
          }}
        >
          {loadingPlaces && <p className="text-sm text-gray-500 py-4 text-center">Loading...</p>}
          {!loadingPlaces && places.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">No places found nearby.</p>}
          {!loadingPlaces && places.map((place, i) => {
            const id = place.place_id!;
            const isActive = activeRoute === id;
            const loc = place.geometry!.location!;
            const lat = typeof loc.lat === "function" ? loc.lat() : (loc as any).lat;
            const lng = typeof loc.lng === "function" ? loc.lng() : (loc as any).lng;
            const dist = calcDistanceKm(propertyLocation.lat, propertyLocation.lng, lat, lng);
            const color = ROUTE_COLORS[i % ROUTE_COLORS.length];
            return (
              <div key={id} onClick={() => handlePlaceClick(place, i)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b last:border-0 transition-colors ${isActive ? "bg-gray-50" : "hover:bg-gray-50"}`}>
                <img src={MARKER_ICONS[activeSubCat ?? ""] || "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"} alt="" className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{place.name}</p>
                  {place.vicinity && <p className="text-xs text-gray-500 truncate">{place.vicinity}</p>}
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: color + "20", color }}>{dist} km</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
    );
  };

  const renderSubCatButtons = (className = "flex gap-2 mt-4 flex-wrap") => activeConfig && (
    <div className={className}>
      {activeConfig.subCats.map((sub) => {
        const isActive = activeSubCat === sub.type;
        return (
          <button
            key={sub.type}
            onClick={() => setActiveSubCat(sub.type)}
            className="px-5 py-1.5 rounded-md text-sm font-bold border transition-all"
            style={
              isActive
                ? { backgroundColor: activeConfig.color, color: "#fff", borderColor: activeConfig.color }
                : { backgroundColor: "#fff", color: "#555", borderColor: "#ccc" }
            }
          >
            {sub.label}
          </button>
        );
      })}
    </div>
  );

  const renderModuleButtons = (className = "flex gap-4 mt-5 flex-wrap") => (
    <div className={className}>
      {Object.entries(placeTypes).map(([key, config]) => {
        const isActive = activeModule === key;
        return (
          <button
            key={key}
            onClick={() => handleModuleClick(key)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all"
              style={{
                borderColor: isActive ? config.color : "#e5e7eb",
                backgroundColor: isActive ? config.bgActive : "#fff",
              }}
            >
              <img src={svgToDataUri(config.svgIcon)} alt={config.label} className="w-9 h-9" />
            </div>
            <span
              className="text-xs font-bold"
              style={{ color: isActive ? config.color : "#6b7280" }}
            >
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <h3 className="section-in-ti mb-4">
        Explore Neighbourhood{data?.title ? ` - ${data.title}` : ""}
      </h3>

      <CardContent className="space-y-2 mb-4 px-0">
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-500">City</span>
          <span>{data?.location?.name || "Not specified"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-24 text-gray-500">State</span>
          <span>{data?.state || "Not specified"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-24 shrink-0 text-gray-500">Address</span>
          <span>{generatedAddress || "Not specified"}</span>
        </div>
      </CardContent>

      {/* Map */}
      <div className="w-full rounded-xl overflow-hidden relative" style={{ height: "420px" }}>
        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3 left-3 z-20 rounded-lg p-2 shadow-md transition-colors hover:brightness-95"
          style={{ backgroundColor: "#9b0f09" }}
          title="Full Screen"
        >
          <Maximize2 size={18} className="text-white" />
        </button>
        <GoogleMap
          zoom={INITIAL_MAP_ZOOM}
          center={propertyLocation}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{ zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
          onLoad={(m) => setMap(m)}
        >
          {renderMapContent()}
        </GoogleMap>
        {renderOverlay()}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <GoogleMap
            zoom={INITIAL_MAP_ZOOM}
            center={propertyLocation}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{ zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
            onLoad={(m) => setFullscreenMap(m)}
            onUnmount={() => setFullscreenMap(null)}
          >
            {renderMapContent()}
          </GoogleMap>
          {renderOverlay(true)}
          <div
            className="absolute bottom-5 left-1/2 z-20 max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white px-6 pt-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)]"
            style={{
              width: FULLSCREEN_PANEL_WIDTH,
              minHeight: `${FULLSCREEN_CONTROLS_HEIGHT}px`,
              paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
            }}
          >
            <div className="flex max-w-full flex-col items-center overflow-x-auto">
              {renderSubCatButtons("flex w-full justify-center gap-2 flex-wrap")}
              {renderModuleButtons("flex w-max justify-center gap-5 mt-5 pb-1")}
            </div>
          </div>
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 rounded-full p-2.5 shadow-lg transition-colors hover:brightness-95"
            style={{ backgroundColor: "#9b0f09" }}
            title="Close"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      )}

      {/* Sub-cat pill buttons */}
      {renderSubCatButtons()}

      {/* Circle icon module buttons */}
      {renderModuleButtons()}
    </Card>
  );
}
