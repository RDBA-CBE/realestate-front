"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Heart, Share, GitCompareArrowsIcon,
  ChevronLeft, ChevronRight, IndianRupeeIcon,
  Maximize2, Star, Bed, Bath, CheckCircle2, Phone, Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  capitalizeFLetter, formatPriceRange, Success, truncateText, useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";

interface PropertyImage { id: number; image_url: string; is_primary: boolean; order: number; }
interface Property {
  id: string; title: string; location: any; area: any; price: number;
  listing_type: "rent" | "sale" | "lease"; bedrooms: number; bathrooms: number;
  primary_image: string; built_up_area: any; state: string; city: string;
  is_compare: string; user_wishlists: boolean; images?: PropertyImage[];
  price_range?: any; developer: any; broker_name?: string; deposit?: number;
  price_per_sqft?: number; highlights?: string[]; possession_date?: string;
  total_area?: any; floor_plans?: any; user_preferred_locations?: any;
  amenities?: any[]; plot_sizes?: Array<{ size: string; price: string }>;
  bhk_configurations?: Array<{ bhk: string; price: string; area?: string }>;
}
interface PropertyCardProps {
  property: Property; view: "grid" | "list";
  updateList?: any; list?: any; handleClick?: any;
  onContactClick?: (property: Property) => void;
}

const getInitials = (name: string) => {
  if (!name) return "P";
  return name.split(" ").map((w) => w.charAt(0)).join("").toUpperCase().slice(0, 2);
};

const listingColor = (type: string) =>
  type === "sale" ? "bg-emerald-500" : type === "lease" ? "bg-blue-500" : type === "rent" ? "bg-orange-500" : "bg-gray-500";

const GRID_IMAGE_HEIGHT = 180;
const LIST_IMAGE_HEIGHT = "100%";

export function PropertyCard({ property, view, list, updateList, handleClick, onContactClick }: PropertyCardProps) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [state, setState] = useSetState({ is_compare: false, showLoginPopup: false });

  const allImages = property?.images || [];
  const displayImages = allImages.length > 0
    ? allImages
    : [{ id: 0, image_url: property.primary_image, is_primary: true, order: 0 }];

  const amenities: any[] = ((property as any)?.amenities || []).slice(0, 3);

  const bhkLabel = property.floor_plans?.length > 0
    ? `${[...new Set(property.floor_plans.map((fp: any) => fp.category?.match(/\d+/)?.[0]))].join(", ")} BHK`
    : property.bedrooms ? `${property.bedrooms} Bed` : null;

  useEffect(() => {
    if (hover && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => prev === displayImages.length - 1 ? 0 : prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hover, displayImages.length]);

  const handleWishList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) { setState({ showLoginPopup: true }); return; }
    try {
      if (!property?.user_wishlists) {
        await Models.wishlist.add_property({ property_id: property?.id });
        updateList?.(list.map((item: Property) => item.id === property.id ? { ...item, user_wishlists: true } : item));
        Success("Added to your wishlist!");
      } else {
        await Models.wishlist.remove_property({ property_id: property?.id });
        updateList?.(list.map((item: Property) => item.id === property.id ? { ...item, user_wishlists: false } : item));
        Success("Removed from your wishlist!");
      }
    } catch (error) { console.log(error); }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const propertyId = property?.id;
    const compareList = JSON.parse(localStorage.getItem("compare") || "[]");
    const updatedList = compareList.includes(propertyId)
      ? compareList.filter((id: string) => id !== propertyId)
      : [...compareList, propertyId];
    localStorage.setItem("compare", JSON.stringify(updatedList));
    setState({ is_compare: updatedList.includes(propertyId) });
    Success(updatedList.includes(propertyId) ? "Added to compare!" : "Removed from compare!");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) await navigator.share({ title: property.title, url: window.location.href });
      else { navigator.clipboard.writeText(window.location.href); Success("Link copied!"); }
    } catch {}
  };

  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((p) => p === displayImages.length - 1 ? 0 : p + 1); };
  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((p) => p === 0 ? displayImages.length - 1 : p - 1); };
  const onClick = () => handleClick ? handleClick() : router.push(`/property-detail/${property?.id}`);

  const LoginPopup = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setState({ showLoginPopup: false })}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 bg-[#fff6f6] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-[#9b0f09]" />
        </div>
        <h3 className="text-lg font-bold text-black mb-2">Login Required</h3>
        <p className="text-gray-500 text-sm mb-6">Please sign in to save properties to your wishlist.</p>
        <div className="flex gap-3">
          <button onClick={() => setState({ showLoginPopup: false })} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={() => { setState({ showLoginPopup: false }); router.push("/login"); }} className="flex-1 bg-[#9b0f09] text-white py-2.5 rounded-xl font-medium hover:bg-[#7d0c07]">Sign In</button>
        </div>
      </div>
    </div>
  );

  /* ─── Shared image slider ─── */
  const ImageSlider = ({ height }: { height: number | string }) => (
    <div className="relative overflow-hidden w-full h-full" style={{ height }}>
      {displayImages[currentImageIndex]?.image_url && (
        <div className="w-full h-full">
          <Image
            src={displayImages[currentImageIndex].image_url}
            alt={property.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}

      {/* Arrows */}
      {displayImages.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"><ChevronLeft size={16} /></button>
          <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"><ChevronRight size={16} /></button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {displayImages.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? "bg-white w-3" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}

      {/* Listing badge */}
      <Badge className={`absolute top-3 left-3 text-white text-xs font-semibold capitalize border-none rounded-full px-3 py-1 ${listingColor(property.listing_type)}`}>
        For {property.listing_type}
      </Badge>

      {/* Preferred location badge */}
      {property?.user_preferred_locations && (
        <Badge className="absolute top-3 right-3 bg-[#fff6f6] text-[#9b0f09] border-none rounded-full px-2 py-1 text-xs flex gap-1">
          <Star className="w-3 h-3" /> Preferred Property
        </Badge>
      )}

      {/* Action icons */}
      <div className="absolute bottom-3 right-2 flex gap-1.5 z-10">
        <button onClick={handleWishList}
          className={`rounded-full p-2 shadow transition-colors ${property?.user_wishlists ? "bg-[#9b0f09] text-white" : "bg-white text-gray-600 hover:bg-[#9b0f09] hover:text-white"}`}>
          <Heart size={16} fill={property?.user_wishlists ? "currentColor" : "none"} />
        </button>
        <button onClick={handleCompare}
          className={`rounded-full p-2 shadow transition-colors ${state.is_compare || property?.is_compare ? "bg-[#9b0f09] text-white" : "bg-white text-gray-600 hover:bg-[#9b0f09] hover:text-white"}`}>
          <GitCompareArrowsIcon size={16} />
        </button>
        <button onClick={handleShare} className="rounded-full p-2 shadow bg-white text-gray-600 hover:bg-[#9b0f09] hover:text-white transition-colors">
          <Share size={16} />
        </button>
      </div>
    </div>
  );

  /* ─── GRID VIEW ─── */
  if (view === "grid") {
    return (
      <>
        <motion.div  className="h-full">
          <Card onClick={onClick} className="bg-white  border-gray overflow-hidden rounded-2xl shadow-sm hover:shadow-xl cursor-pointer h-full flex flex-col transition-shadow duration-300">

            {/* Image */}
            <div className="relative flex-shrink-0" style={{ height: GRID_IMAGE_HEIGHT }}>
              <ImageSlider height={GRID_IMAGE_HEIGHT} />
            </div>

            <CardContent className="flex flex-col flex-grow py-4 gap-1">

              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-0">{property.title}</h3>

              {/* Location */}
              {(property.location?.name || property.location?.label) && (
                <div className="flex items-center gap-1  text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#9b0f09] shrink-0" />
                  <span className="line-clamp-1">{`${capitalizeFLetter(property.area?.name || property.area?.label)}, ${capitalizeFLetter(property.location?.name || property.location?.label)}`}</span>
                </div>
              )}

              {/* Price | BHK | sqft */}
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <div className="flex items-center gap-1 text-[#9b0f09] font-bold text-base">
                  <IndianRupeeIcon className="w-4 h-4" />
                  {formatPriceRange(property?.price_range?.minimum_price, property?.price_range?.maximum_price)}
                  {property.listing_type === "rent" && <span className="text-xs font-normal text-gray-500">/mo</span>}
                </div>
                {bhkLabel && (
                  <><span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1 "><Home className="w-3.5 h-3.5 text-[#9b0f09]" />{bhkLabel}</span></>
                )}
                {property?.built_up_area && (
                  <><span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-[#9b0f09]" />{property.built_up_area} sqft</span></>
                )}
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {amenities.map((a: any, i: number) => (
                    <span key={i} className="flex items-center gap-1 text-xs   py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-[#9b0f09]" />
                      {a?.name || a}
                    </span>
                  ))}
                </div>
              )}

              {/* Developer + Contact */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#9b0f09]/10 rounded-full flex items-center justify-center -mt-3">
                    <span className="text-xs font-bold text-[#9b0f09] ">{getInitials(property?.developer?.industry) || ""}</span> 
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight mb-1" title={property?.developer?.industry}>{truncateText(property?.developer?.industry, 30) || "Property Owner"}</p>
                    <p className="text-xs text-gray-400">{property?.developer?.industry ? "Developer" : "Owner"}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onContactClick?.(property); }}
                  className="flex items-center gap-1.5 bg-[#9b0f09] hover:bg-[#7d0c07] text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Contact
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {state.showLoginPopup && <LoginPopup />}
      </>
    );
  }

  /* ─── LIST VIEW ─── */
  return (
    <>
      <motion.div whileHover={{ y: -2 }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Card onClick={onClick} className="bg-white border border-gray-100 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-shadow duration-300 flex flex-col sm:flex-row">

          {/* Image */}
          <div className="relative sm:w-[380px] w-full flex-shrink-0 h-52 sm:h-auto">
            <ImageSlider height="100%" />
          </div>

          {/* Content */}
          <CardContent className="flex flex-col flex-grow p-5 gap-1">

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg leading-snug line-clamp-2 mb-0">{property.title}</h3>

            {/* Location */}
            {(property.location?.name || property.location?.label) && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#9b0f09] shrink-0" />
                <span className="line-clamp-1">{`${capitalizeFLetter(property.area?.name || property.area?.label)}, ${capitalizeFLetter(property.location?.name || property.location?.label)}`}</span>
              </div>
            )}

            {/* Price | BHK | sqft */}
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <div className="flex items-center gap-1 text-[#9b0f09] font-bold text-base">
                <IndianRupeeIcon className="w-4 h-4" />
                {formatPriceRange(property?.price_range?.minimum_price, property?.price_range?.maximum_price)}
                {property.listing_type === "rent" && <span className="text-xs font-normal text-gray-500">/mo</span>}
              </div>
              {bhkLabel && (
                <><span className="text-gray-300">|</span>
                <span className="flex items-center gap-1 "><Home className="w-3.5 h-3.5 text-[#9b0f09]" />{bhkLabel}</span></>
              )}
              {property?.built_up_area && (
                <><span className="text-gray-300">|</span>
                <span className="flex items-center gap-1 "><Maximize2 className="w-3.5 h-3.5 text-[#9b0f09]" />{property.built_up_area} sqft</span></>
              )}
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.map((a: any, i: number) => (
                  <span key={i} className="flex items-center gap-1 text-xs  bg-gray-100 border border-gray-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#9b0f09]" />
                    {a?.name || a}
                  </span>
                ))}
              </div>
            )}

            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {property.highlights.slice(0, 3).join(" • ")}
              </p>
            )}

            {/* Possession */}
            {property.possession_date && (
              <p className="text-xs text-gray-400">Possession: <span className="font-medium text-gray-600">{property.possession_date}</span></p>
            )}

            {/* Developer + Contact */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#9b0f09]/10 rounded-full flex items-center justify-center -mt-3">
                  <span className="text-xs font-bold text-[#9b0f09]">{getInitials(property?.developer?.industry || property.broker_name || "")}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{property?.developer?.industry || property.broker_name || "Property Owner"}</p>
                  <p className="text-xs text-gray-400">{property?.developer?.industry ? "Developer" : property.broker_name ? "Agent" : "Owner"}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onContactClick?.(property); }}
                className="flex items-center gap-2 bg-[#9b0f09] hover:bg-[#7d0c07] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                <Phone className="w-4 h-4" /> Contact
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {state.showLoginPopup && <LoginPopup />}
    </>
  );
}
