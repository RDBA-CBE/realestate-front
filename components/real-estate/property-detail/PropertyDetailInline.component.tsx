"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SimilarListings1 from "@/components/real-estate/property-detail/SimilarListings.component1";
import Gallery from "@/components/real-estate/property-detail/Gallery.component";
import PropertyDetails from "@/components/real-estate/property-detail/PropertyDetails.component";
import PropertyHeader from "@/components/real-estate/property-detail/PropertyHeader.component";
import MapSection from "@/components/real-estate/property-detail/MapSection.component";
import FloorPlans from "@/components/real-estate/property-detail/FloorPlans.component";
import Amenities from "@/components/real-estate/property-detail/Amenities.component";
import Reviews from "@/components/real-estate/property-detail/Reviews.component";
import SimilarListings from "@/components/real-estate/property-detail/SimilarListings.component";
import PropertyDesc from "@/components/real-estate/property-detail/PropertyDesc.component";
import Nearby from "@/components/real-estate/property-detail/Nearby.component";
import WalkScore from "@/components/real-estate/property-detail/Walkscore.component";
import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";
import PropertyTabs from "@/components/real-estate/PropertyTabs.component";
import Video from "@/components/real-estate/property-detail/Video.component";
import VirtualTour from "@/components/real-estate/property-detail/VirtualTour.component";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import {
  capitalizeFLetter,
  Failure,
  formatNumber,
  formatPriceRange,
  formattedNoDecimal,
  formatToINR,
  Success,
  TimeAgo,
  useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Heart,
  Share2,
  Copy,
  Printer,
  Bed,
  Bath,
  Square,
  GitCompareArrowsIcon,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Maximize2,
  Home,
  Badge,
  MapPin,
  ArmchairIcon,
  Building2,
  ToiletIcon,
  Star,
  Shield,
  Car,
  Banknote,
  Zap,
  ShoppingBag,
  Landmark,
  Users,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyCard } from "../property-list/property3And4Column/property-card";

interface PropertyImage {
  image: string;
}

interface PropertyDetail {
  id?: string;
  title?: string;
  city?: string;
  state?: string;
  listing_type?: string;
  created_at?: string;
  bedrooms?: number;
  bathrooms?: number;
  built_up_area?: number;
  total_area?: number;
  built_year?: number;
  price?: number;
  price_per_sqft?: number;
  images?: PropertyImage[];
  user_wishlists?: boolean;
  status?: string;
  furnishing?: string;
  balcony?: number;
  property_type?: {
    id: string;
    name?: string; // ✅ Added this
    slug?: string; // (optional, if API returns slug)
  };
}

interface PropertyDetailInlineProps {
  id: string;
  handleClick?: () => void;
  data?: PropertyDetail;
  updateList?: () => void;
  clickSimilarProperty?: any;
}

// ---------------- AUTH HOOK ----------------

export default function PropertyDetailInline(props: PropertyDetailInlineProps) {
  const { id, handleClick, data, updateList, clickSimilarProperty } = props;

  const router = useRouter();

  const MAX_LENGTH = 300;

  const [state, setState] = useSetState({
    isActive: false,
    detail: {} as PropertyDetail,
    similarProperty: [] as any[],
    token: null as string | null,
    is_compare: false,
    currentImageIndex: 0,
  });

  useEffect(() => {
    const compareList = localStorage.getItem("compare");
    if (compareList && compareList.length > 0) {
      const compareArray = JSON.parse(compareList);
      if (compareArray.includes(id)) {
        setState({ is_compare: true });
      } else {
        setState({ is_compare: false });
      }
    }
  }, [id]);

  const handleWishList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        if (!data?.user_wishlists) {
          await Models.wishlist.add_property({
            property_id: data?.id,
          });
          updateList();
          Success("Added to your wishlist !");
        } else {
          await Models.wishlist.remove_property({
            property_id: data?.id,
          });
          updateList();
          Success("Removed from your wishlist !");
        }
      } else {
        Failure("Please log in to add properties to your wishlist!");
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleCompareList = () => {
    try {
      const propertyId = data?.id;
      const compareList = JSON.parse(localStorage.getItem("compare") || "[]");

      let updatedList = [];
      if (compareList.includes(propertyId)) {
        updatedList = compareList.filter((id: string) => id !== propertyId);
        Success("Removed from your compare list !");
      } else {
        Success("Added to your compare list !");
        updatedList = [...compareList, propertyId];
      }

      localStorage.setItem("compare", JSON.stringify(updatedList));

      const compares = localStorage.getItem("compare");
      if (compares && compares.length > 0) {
        const is_compared = compares.includes(data?.id || "");
        setState({ is_compare: is_compared });
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const overviewEl = document.getElementById("overview");
      const reviewsEl = document.getElementById("nearby");

      if (overviewEl && reviewsEl) {
        const overviewRect = overviewEl.getBoundingClientRect();
        const reviewsRect = reviewsEl.getBoundingClientRect();

        const overviewInView = overviewRect.top <= 100;
        const reviewsFullyPassed = reviewsRect.bottom <= 0;
        setState({ isActive: overviewInView && !reviewsFullyPassed });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getDetails();
  }, [id]);

  const getDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res: any = await Models.property.details(id);
      setState({ detail: res, token });
      if (res?.property_type?.id) {
        similarProperty(res.property_type.id);
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const similarProperty = async (id: string) => {
    try {
      const body = {
        property_type: id,
      };
      const res: any = await Models.property.list(1, body);
      const filter = res?.results?.filter(
        (item: any) => Number(item?.id) !== Number(id)
      );
      setState({ similarProperty: filter || [] });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const getImageUrl = (imageObj: PropertyImage | undefined): string => {
    return imageObj?.image || "/default-property-image.jpg";
  };

  let details: any = [];

  if (state?.detail?.property_type?.name == "Residential") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(state?.detail?.total_area) ?? "-",
      },
      {
        icon: Maximize2,
        label: "Built up Area",
        value: formatNumber(state?.detail?.built_up_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(state?.detail?.listing_type) ?? "-",
      },
      ...(state?.detail?.built_year
        ? [
            {
              icon: Calendar,
              label: "Year Built",
              value: state?.detail?.built_year ?? "-",
            },
          ]
        : []),

      {
        icon: Home,
        label: "Status",
        value: capitalizeFLetter(state?.detail?.status) ?? "-",
      },

      ...(state?.detail?.bedrooms
        ? [
            {
              icon: Bed,
              label: "Bedroom",
              value: state?.detail?.bedrooms ?? "-",
            },
          ]
        : []),
      ...(state?.detail?.bathrooms
        ? [
            {
              icon: Bath,
              label: "Bath",
              value: state?.detail?.bathrooms ?? "-",
            },
          ]
        : []),
      ...(state?.detail?.balcony
        ? [
            {
              icon: Building2,
              label: "Balcony",
              value: state?.detail?.balcony ?? "-",
            },
          ]
        : []),

      // { icon: Car, label: "Garage", value: data?.garage ?? "-" },

      {
        icon: ArmchairIcon,
        label: "Furnishing",
        value: state?.detail?.furnishing ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  if (state?.detail?.property_type?.name == "Agricultural") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(state?.detail?.total_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(state?.detail?.listing_type) ?? "-",
      },

      {
        icon: Home,
        label: "Status",
        value: capitalizeFLetter(state?.detail?.status) ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  if (state?.detail?.property_type?.name == "Industrial") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(state?.detail?.total_area) ?? "-",
      },

      {
        icon: Maximize2,
        label: "Built up Area",
        value: formatNumber(state?.detail?.built_up_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(state?.detail?.listing_type) ?? "-",
      },

      ...(state?.detail?.bathrooms
        ? [
            {
              icon: ToiletIcon,
              label: "Washroom",
              value: state?.detail?.bathrooms ?? "-",
            },
          ]
        : []),

      ...(state?.detail?.built_year
        ? [
            {
              icon: Calendar,
              label: "Year Built",
              value: state?.detail?.built_year ?? "-",
            },
          ]
        : []),

      {
        icon: Star,
        label: "Status",
        value: capitalizeFLetter(state?.detail?.status) ?? "-",
      },
      {
        icon: ArmchairIcon,
        label: "Furnishing",
        value: state?.detail?.furnishing ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  if (state?.detail?.property_type?.name == "Commercial") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(state?.detail?.total_area) ?? "-",
      },

      {
        icon: Maximize2,
        label: "Built up Area",
        value: formatNumber(state?.detail?.built_up_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(state?.detail?.listing_type) ?? "-",
      },

      ...(state?.detail?.bathrooms
        ? [
            {
              icon: ToiletIcon,
              label: "Washroom",
              value: state?.detail?.bathrooms ?? "-",
            },
          ]
        : []),

      ...(state?.detail?.built_year
        ? [
            {
              icon: Calendar,
              label: "Year Built",
              value: state?.detail?.built_year ?? "-",
            },
          ]
        : []),

      {
        icon: Star,
        label: "Status",
        value: capitalizeFLetter(state?.detail?.status) ?? "-",
      },

      {
        icon: ArmchairIcon,
        label: "Furnishing",
        value: state?.detail?.furnishing ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  const handleclick = (data) => {
    clickSimilarProperty(data);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const isLong = state.detail?.description?.length > MAX_LENGTH;
  const shortText = isLong
    ? state.detail?.description?.slice(0, MAX_LENGTH) + "..."
    : state.detail?.description;

  const handleRedirect = () => {
    router.push(`/property-detail/${state.detail?.id}`);
  };

  const getIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("security")) return Shield;
    if (lowerName.includes("parking")) return Car;
    if (lowerName.includes("atm") || lowerName.includes("bank"))
      return Banknote;
    if (lowerName.includes("power backup")) return Zap;
    if (lowerName.includes("convenience store")) return ShoppingBag;
    if (lowerName.includes("sports")) return Landmark;
    if (lowerName.includes("visitor")) return Users;
    // Default icon if no match is found
    return CheckCircle2;
  };

  return (
    <div className="mx-auto px-2 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />
      <div className="flex w-full justify-end">
        <Button
          onClick={() => handleClick()}
          className="p-2 border rounded-full hover:bg-gray-100 transition-colors bg-transparent"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      {/* Header + Gallery */}
      <div className="space-y-4">
        <div className="space-y-4 cursor-pointer">
          <div
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            onClick={() => handleRedirect()}
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-bold cursor-pointer">
                {state.detail?.title || "Property Title"}
              </h1>
              <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                <span>{`${capitalizeFLetter(
                  state.detail?.city || ""
                )} , ${capitalizeFLetter(state.detail?.state || "")} `}</span>
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  ● For {capitalizeFLetter(state.detail?.listing_type || "")}
                </span>
                <span className="flex items-center gap-1">
                  ⏱ {TimeAgo(state.detail?.created_at || "")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 xs:gap-6 text-gray-700 pt-2">
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                  <Bed size={18} />{" "}
                  <span>{state.detail?.bedrooms || 0} bed</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                  <Bath size={18} />{" "}
                  <span>{state.detail?.bathrooms || 0} bath</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                  <Square size={18} />{" "}
                  <span>
                    {formatNumber(state.detail?.total_area || 0)} sqft
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex justify-between items-center items-end gap-3"
            onClick={() => handleRedirect()}
          >
            <div>
              <p className="text-xl font-bold">
                {/* {formatToINR(state.detail?.price || 0)} */}
                {formatPriceRange(
                  state.detail?.price_range?.minimum_price,
                  state.detail?.price_range?.maximum_price
                )}{" "}
              </p>
              <p className="text-sm text-gray-600">
                {formatToINR(state.detail?.price_per_sqft || 0)}/sq ft
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleWishList()}
                size="icon"
                variant="outline"
                className={`rounded-full ${
                  state.detail?.user_wishlists
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
                    : "bg-white text-black"
                }`}
              >
                <Heart
                  size={18}
                  fill={state.detail?.user_wishlists ? "currentColor" : "none"}
                />
              </Button>

              <Button
                onClick={() => handleCompareList()}
                size="icon"
                variant="outline"
                className={`rounded-full ${
                  state?.is_compare
                    ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                    : "bg-white text-black"
                }`}
              >
                <GitCompareArrowsIcon size={18} />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Share2 size={18} />
              </Button>
            </div>
          </div>

          <div className="relative">
            {state.detail?.images && state.detail.images.length > 0 ? (
              <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
                <Card className="h-full w-full relative">
                  <Image
                    src={getImageUrl(
                      state.detail.images[state.currentImageIndex]
                    )}
                    alt={`Property image ${state.currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-property-image.jpg";
                    }}
                  />
                </Card>

                {state.detail.images.length > 1 && (
                  <>
                    <Button
                      onClick={() => {
                        setState({
                          currentImageIndex:
                            state.currentImageIndex === 0
                              ? state.detail.images!.length - 1
                              : state.currentImageIndex - 1,
                        });
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                      size="icon"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <Button
                      onClick={() => {
                        setState({
                          currentImageIndex:
                            state.currentImageIndex ===
                            state.detail.images!.length - 1
                              ? 0
                              : state.currentImageIndex + 1,
                        });
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                      size="icon"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {state.currentImageIndex + 1} / {state.detail.images.length}
                </div>

                {state.detail.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 left-4 flex justify-center">
                    <div className="flex space-x-2 overflow-x-auto max-w-full pb-2">
                      {state.detail.images?.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setState({ currentImageIndex: index })}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            state.currentImageIndex === index
                              ? "border-blue-500"
                              : "border-transparent"
                          }`}
                        >
                          <Image
                            src={getImageUrl(img)}
                            alt={`Thumbnail ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/default-property-image.jpg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="h-[500px] rounded-2xl shadow-lg flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🏠</div>
                  <p>No images available</p>
                </div>
              </Card>
            )}
          </div>

          <Card
            className="rounded-2xl shadow p-4"
            onClick={() => handleRedirect()}
          >
            <h3 className="text-xl font-semibold mb-3">Overview</h3>
            <div className="grid grid-cols-2  gap-4">
              {details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3   transition-shadow duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-red-50  text-red-500  rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-md font-semibold text-gray-900 0">
                      {typeof item.value === "number"
                        ? formatNumber(item.value)
                        : item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            className="rounded-2xl shadow p-6 space-y-6"
            onClick={() => handleRedirect()}
          >
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Property Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {state.expanded ? state.detail?.description : shortText}
              </p>

              {state.isLong && (
                <button
                  onClick={() => setState({ expanded: !state.expanded })}
                  className="mt-2 font-semibold text-black hover:underline"
                >
                  {state.expanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </Card>

          <Card
            className="rounded-2xl shadow p-6"
            onClick={() => handleRedirect()}
          >
            <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>

            {/* Responsive Icon Grid */}
            <CardContent className="grid grid-cols-2  gap-4">
              {state.detail?.amenities?.map((item, i) => {
                const Icon = getIcon(item.name);
                return (
                  // Card for each amenity
                  <div
                    key={i}
                    className="flex flex-col items-center p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md hover:border-blue-500"
                  >
                    {/* Icon - larger and colored for visibility */}
                    <div className="mb-2 p-2 bg-red-50   rounded-full">
                      <Icon
                        className="w-6 h-6 text-red-500"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Feature Name - bold and easy to read */}
                    <p className="text-sm font-medium text-gray-700 leading-snug">
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="border p-6 shadow-lg rounded-2xl">
          {state.similarProperty.length > 0 && (
            <>
              {/* <SimilarListings1 data={state.similarProperty} /> */}

              <div className="space-y-4">
                {/* Header with navigation */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {" "}
                      Similar properties
                    </h2>
                    {/* <p className="text-gray-600 text-sm">
                                Aliquam lacinia diam quis lacus euismod
                              </p> */}
                  </div>

                  {/* Custom Navigation */}
                  <div className="flex gap-2">
                    <button
                      className="featured-prev p-2 rounded-full border bg-white shadow hover:bg-gray-100"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      className="featured-next p-2 rounded-full border bg-white shadow hover:bg-gray-100"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Swiper */}
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={{
                    prevEl: ".featured-prev",
                    nextEl: ".featured-next",
                  }}
                  // breakpoints={{
                  //   640: { slidesPerView: 1 },

                  // }}
                >
                  {state.similarProperty?.map(
                    (property: any, index: number) => (
                      <SwiperSlide
                        key={property.id}
                        className="!flex !h-auto items-stretch"
                        // onClick={() => handleclick(property)}
                      >
                        <div key={index} className="flex flex-col flex-1">
                          <PropertyCard
                            property={property}
                            view="grid"
                            list={data}
                            handleClick={() => handleclick(property)}
                          />
                        </div>
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
