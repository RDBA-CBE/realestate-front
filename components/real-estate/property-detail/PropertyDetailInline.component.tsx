"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  formattedNoDecimal,
  formatToINR,
  Success,
  TimeAgo,
  useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

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
  price?: number;
  price_per_sqft?: number;
  images?: PropertyImage[];
  user_wishlists?: boolean;
  property_type?: {
    id: string;
  };
}

interface PropertyDetailInlineProps {
  id: string;
  handleClick?: () => void;
  data?: PropertyDetail;
  updateList?: () => void;
}

// ---------------- AUTH HOOK ----------------

export default function PropertyDetailInline(props: PropertyDetailInlineProps) {
  const { id, handleClick, data, updateList } = props;

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

  const details = [
    { icon: Bed, label: "Bedroom", value: state.detail?.bedrooms ?? "-" },
    { icon: Bath, label: "Bath", value: state.detail?.bathrooms ?? "-" },
    {
      icon: Calendar,
      label: "Year Built",
      value: state.detail?.built_year ?? "-",
    },
    // { icon: Car, label: "Garage", value: data?.garage ?? "-" },
    {
      icon: Maximize2,
      label: "Total Area",
      value: formatNumber(state.detail?.total_area) ?? "-",
    },
    {
      icon: Maximize2,
      label: "Build up Area",
      value: formatNumber(state.detail?.built_up_area) ?? "-",
    },

    {
      icon: Home,
      label: "Offer Type",
      value: capitalizeFLetter(state.detail?.listing_type) ?? "-",
    },

    // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
  ];

  const isLong = state.detail?.description?.length > MAX_LENGTH;
  const shortText = isLong
    ? state.detail?.description?.slice(0, MAX_LENGTH) + "..."
    : state.detail?.description;

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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
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

            <div className="flex items-center gap-6 text-gray-700 mt-2">
              <div className="flex items-center gap-1">
                <Bed size={18} /> <span>{state.detail?.bedrooms || 0} bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath size={18} />{" "}
                <span>{state.detail?.bathrooms || 0} bath</span>
              </div>
              <div className="flex items-center gap-1">
                <Square size={18} />{" "}
                <span>
                  {formatNumber(state.detail?.built_up_area || 0)} sqft
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center items-end gap-3">
          <div>
            <p className="text-2xl font-bold">
              {formatToINR(state.detail?.price || 0)}
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

        <Card className="rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-6">Overview</h3>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {details?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="p-3 rounded-xl border w-12 h-12 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item?.label}</h4>
                  {item?.value && (
                    <p className="text-gray-600 text-sm">{item?.value}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Property Description</h3>
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

        <Card className="rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold mb-6">Features & Amenities</h3>

          <CardContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ">
              {state.detail?.amenities?.map((item, i) => (
                <li key={i} className="text-gray-800 flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  {item?.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="space-y-6 relative overflow-x-hidden p-6">
          <div>
            <h2 className="text-xl font-semibold  text-gray-900 mb-2">
              Similar properties
            </h2>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-10">
              <button
                className="featured-prev p-3 rounded-full border bg-white shadow-lg hover:bg-gray-100 transition-colors pointer-events-auto ml-4"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="featured-next p-3 rounded-full border bg-white shadow-lg hover:bg-gray-100 transition-colors pointer-events-auto mr-4"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: ".featured-prev",
                nextEl: ".featured-next",
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1024: { slidesPerView: 1 },
              }}
              className="!overflow-visible"
            >
              {state.similarProperty?.map((property) => (
                <SwiperSlide key={property.id}>
                  <div className="flex justify-center">
                    <Card className="overflow-hidden cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-lg">
                      <div className="relative h-48 bg-gray-100">
                        {property?.primary_image ? (
                          <Image
                            src={property.primary_image}
                            alt={property.title || "Property image"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <div className="text-center text-gray-500">
                              <div className="text-2xl mb-2">🏠</div>
                              <p className="text-sm">No image available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-gray-900 text-xl leading-tight">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm truncate">{`${capitalizeFLetter(
                              property.city
                            )}, ${capitalizeFLetter(property.state)}`}</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatToINR(property?.price)}
                            {property.listing_type == "rent" && (
                              <span className="text-lg font-normal"> / mo</span>
                            )}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-gray-700 text-sm">
                            <div className="flex items-center space-x-1">
                              <Bed className="h-4 w-4" />
                              <span>{property.bedrooms || 0} BHK</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Square className="h-4 w-4" />
                              <span>
                                {formattedNoDecimal(property.total_area)} sqft
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {property.bedrooms && property.bedrooms > 1
                              ? `${property.bedrooms} BHK`
                              : "1 BHK"}
                            {property.property_type &&
                              ` ${property.property_type}`}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Card>
      </div>
    </div>
  );
}
