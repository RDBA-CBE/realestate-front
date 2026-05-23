"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Heart, Share, GitCompareArrowsIcon,
  ChevronLeft, ChevronRight, IndianRupeeIcon,
  Maximize2, Star, CheckCircle2, Phone, Home,
  MapPinHouseIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { capitalizeFLetter, formatPriceRange, Success, truncateText } from "@/utils/function.utils";
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

export function PropertyCard({ property, view, list, updateList, handleClick, onContactClick }: PropertyCardProps) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(!!property?.user_wishlists);
  const [compared, setCompared] = useState(() =>
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("compare") || "[]").includes(property?.id)
      : false
  );
  const [loginPopup, setLoginPopup] = useState(false);

  const allImages = property?.images || [];
  const images = allImages.length > 0
    ? allImages
    : [{ id: 0, image_url: property.primary_image, is_primary: true, order: 0 }];

  const amenities: any[] = ((property as any)?.amenities || []).slice(0, 3);
  const bhkLabel = property.floor_plans?.length > 0
    ? `${[...new Set(property.floor_plans.map((fp: any) => fp.category?.match(/\d+/)?.[0]))].join(", ")} BHK`
    : property.bedrooms ? `${property.bedrooms} Bed` : null;

  useEffect(() => {
    if (hover && images.length > 1) {
      const t = setInterval(() => setImgIndex((p) => p === images.length - 1 ? 0 : p + 1), 3000);
      return () => clearInterval(t);
    }
  }, [hover, images.length]);

  const onWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { setLoginPopup(true); return; }
    try {
      if (!wishlisted) {
        await Models.wishlist.add_property({ property_id: property?.id });
        setWishlisted(true);
        updateList?.(list?.map((item: Property) => item.id === property.id ? { ...item, user_wishlists: true } : item));
        Success("Added to your wishlist!");
      } else {
        await Models.wishlist.remove_property({ property_id: property?.id });
        setWishlisted(false);
        updateList?.(list?.map((item: Property) => item.id === property.id ? { ...item, user_wishlists: false } : item));
        Success("Removed from your wishlist!");
      }
    } catch (err) { console.log(err); }
  };

  const onCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const id = property?.id;
    const cur = JSON.parse(localStorage.getItem("compare") || "[]");
    const next = cur.includes(id) ? cur.filter((x: string) => x !== id) : [...cur, id];
    localStorage.setItem("compare", JSON.stringify(next));
    setCompared(next.includes(id));
    Success(next.includes(id) ? "Added to compare!" : "Removed from compare!");
  };

  const onShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (navigator.share) await navigator.share({ title: property.title, url: `https://realestate-front-eight.vercel.app/property-detail/${property.id}` });
      else { navigator.clipboard.writeText(`https://realestate-front-eight.vercel.app/property-detail/${property.id}`); Success("Link copied!"); }
    } catch {}
  };

  const onNext = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setImgIndex((p) => p === images.length - 1 ? 0 : p + 1); };
  const onPrev = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setImgIndex((p) => p === 0 ? images.length - 1 : p - 1); };
  const onCardClick = () => handleClick ? handleClick() : router.push(`/property-detail/${property?.id}`);

  /* ── Action buttons row (rendered outside image div) ── */
  const ActionButtons = (
    <div className="absolute bottom-3 right-2 flex gap-1.5 z-20">
      <button
        type="button"
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onClick={onWishlist}
        className={`rounded-full p-2 shadow transition-colors ${wishlisted ? "bg-[#9b0f09] text-white" : "bg-white text-gray-600 hover:bg-[#9b0f09] hover:text-white"}`}
      >
        <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onClick={onCompare}
        className={`rounded-full p-2 shadow transition-colors ${compared ? "bg-[#9b0f09] text-white" : "bg-white text-gray-600 hover:bg-[#9b0f09] hover:text-white"}`}
      >
        <GitCompareArrowsIcon size={16} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onClick={onShare}
        className="rounded-full p-2 shadow bg-white text-gray-600 hover:bg-[#9b0f09] hover:text-white transition-colors"
      >
        <Share size={16} />
      </button>
    </div>
  );

  /* ── Image area (inlined — no inner component to avoid stale closures) ── */
  const imageAreaJSX = (height: number | string) => (
    <div className="relative overflow-hidden w-full h-full" style={{ height }}>
      {images[imgIndex]?.image_url && (
        <Image src={images[imgIndex].image_url} alt={property.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      )}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"
          ><ChevronLeft size={16} /></button>
          <button
            type="button"
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"
          ><ChevronRight size={16} /></button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setImgIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-white w-3" : "bg-white/50 w-1.5"}`}
              />
            ))}
          </div>
        </>
      )}
      <Badge className={`absolute top-3 left-3 text-white text-xs font-semibold capitalize border-none rounded-full px-3 py-1 ${listingColor(property.listing_type)}`}>
        For {property.listing_type}
      </Badge>
      {property?.user_preferred_locations && (
        <Badge className="absolute top-3 right-3 bg-[#9b0f09] text-[#fff] hover:bg-dred border-none rounded-full px-2 py-1 text-xs flex gap-1">
          <MapPinHouseIcon className="w-3 h-3" /> Preffered
        </Badge>
      )}
    </div>
  );

  /* ── Login popup ── */
  const LoginPopup = loginPopup ? (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center" onClick={() => setLoginPopup(false)}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 bg-[#fff6f6] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-[#9b0f09]" />
        </div>
        <h3 className="text-lg font-bold text-black mb-2">Login Required</h3>
        <p className="text-gray-500 text-sm mb-6">Please sign in to save properties to your wishlist.</p>
        <div className="flex gap-3">
          <button onClick={() => setLoginPopup(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={() => { setLoginPopup(false); router.push("/login"); }} className="flex-1 bg-[#9b0f09] text-white py-2.5 rounded-xl font-medium hover:bg-[#7d0c07]">Sign In</button>
        </div>
      </div>
    </div>
  ) : null;

  /* ── GRID VIEW ── */
  if (view === "grid") {
    return (
      <>
        <div className="h-full" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <Card onClick={onCardClick} className="bg-white border-gray overflow-hidden rounded-2xl shadow-sm hover:shadow-xl cursor-pointer h-full flex flex-col transition-shadow duration-300">
            <div className="relative flex-shrink-0" style={{ height: GRID_IMAGE_HEIGHT }}>
              {imageAreaJSX(GRID_IMAGE_HEIGHT)}
              {ActionButtons}
            </div>
            <CardContent className="flex flex-col flex-grow py-4 gap-1">
              <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{property.title}</h3>
              {(property.location?.name || property.location?.label) && (
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#9b0f09] shrink-0" />
                  <span className="line-clamp-1">{`${capitalizeFLetter(property.area?.name || property.area?.label)}, ${capitalizeFLetter(property.location?.name || property.location?.label)}`}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <div className="flex items-center gap-1 text-[#9b0f09] font-bold text-base">
                  <IndianRupeeIcon className="w-4 h-4" />
                  {formatPriceRange(property?.price_range?.minimum_price, property?.price_range?.maximum_price)}
                  {property.listing_type === "rent" && <span className="text-xs font-normal text-gray-500">/mo</span>}
                </div>
                {bhkLabel && (<><span className="text-gray-300">|</span><span className="flex items-center gap-1"><Home className="w-3.5 h-3.5 text-[#9b0f09]" />{bhkLabel}</span></>)}
                {property?.built_up_area && (<><span className="text-gray-300">|</span><span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-[#9b0f09]" />{property.built_up_area} sqft</span></>)}
              </div>
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {amenities.map((a: any, i: number) => (
                    <span key={i} className="flex items-center gap-1 text-xs py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-[#9b0f09]" />{a?.name || a}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-start justify-between pt-4 mb-0 border-t border-gray-100 mt-auto">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-[#9b0f09]/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#9b0f09]">{getInitials(property?.developer?.industry || "")}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight mb-1" title={property?.developer?.industry}>{truncateText(property?.developer?.industry, 30) || "Property Owner"}</p>
                    <p className="text-xs text-gray-400">{property?.developer?.industry ? "Developer" : "Owner"}</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onContactClick?.(property); }}
                  className="flex items-center gap-1.5 bg-[#9b0f09] hover:bg-[#7d0c07] text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Contact
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        {LoginPopup}
      </>
    );
  }

  /* ── LIST VIEW ── */
  return (
    <>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Card onClick={onCardClick} className="bg-white border border-gray-100 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-shadow duration-300 flex flex-col sm:flex-row">
          <div className="relative sm:w-[380px] w-full flex-shrink-0 h-52 sm:h-auto">
            {imageAreaJSX("100%")}
            {ActionButtons}
          </div>
          <CardContent className="flex flex-col flex-grow p-5 gap-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-snug line-clamp-2">{property.title}</h3>
            {(property.location?.name || property.location?.label) && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#9b0f09] shrink-0" />
                <span className="line-clamp-1">{`${capitalizeFLetter(property.area?.name || property.area?.label)}, ${capitalizeFLetter(property.location?.name || property.location?.label)}`}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <div className="flex items-center gap-1 text-[#9b0f09] font-bold text-base">
                <IndianRupeeIcon className="w-4 h-4" />
                {formatPriceRange(property?.price_range?.minimum_price, property?.price_range?.maximum_price)}
                {property.listing_type === "rent" && <span className="text-xs font-normal text-gray-500">/mo</span>}
              </div>
              {bhkLabel && (<><span className="text-gray-300">|</span><span className="flex items-center gap-1"><Home className="w-3.5 h-3.5 text-[#9b0f09]" />{bhkLabel}</span></>)}
              {property?.built_up_area && (<><span className="text-gray-300">|</span><span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-[#9b0f09]" />{property.built_up_area} sqft</span></>)}
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.map((a: any, i: number) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 border border-gray-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#9b0f09]" />{a?.name || a}
                  </span>
                ))}
              </div>
            )}
            {property.highlights && property.highlights.length > 0 && (
              <p className="text-sm text-gray-500 line-clamp-1">{property.highlights.slice(0, 3).join(" • ")}</p>
            )}
            {property.possession_date && (
              <p className="text-xs text-gray-400">Possession: <span className="font-medium text-gray-600">{property.possession_date}</span></p>
            )}
            <div className="flex items-start justify-between pt-4 border-t border-gray-100 mt-3">
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 bg-[#9b0f09]/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-[#9b0f09]">{getInitials(property?.developer?.industry || property.broker_name || "")}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{property?.developer?.industry || property.broker_name || "Property Owner"}</p>
                  <p className="text-xs text-gray-400">{property?.developer?.industry ? "Developer" : property.broker_name ? "Agent" : "Owner"}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onContactClick?.(property); }}
                className="flex items-center gap-2 bg-[#9b0f09] hover:bg-[#7d0c07] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                <Phone className="w-4 h-4" /> Contact
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      {LoginPopup}
    </>
  );
}
