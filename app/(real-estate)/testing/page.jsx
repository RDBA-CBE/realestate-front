"use client";

import Models from "@/imports/models.import";
import { useSetState } from "@/utils/function.utils";
import { useEffect } from "react";
import { Mistral } from "@mistralai/mistralai";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AISearchComponent from "@/components/common-components/AiSearchTest";

const mistral = new Mistral({ apiKey: "GSvdWG8ec3JbLYz4EVfkqC64Aj1Kf9K1" });

export default function AISearch() {
  const router = useRouter();

  const [state, setState] = useSetState({
    suggestions: [],
    loading: true,
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const id = localStorage.getItem("userId");
      const wishlist_id = localStorage.getItem("wishlist_id");

      const [userRes, wishlistRes] = await Promise.all([
        id ? Models.user.details(id) : null,
        wishlist_id ? Models.wishlist.list(wishlist_id) : null,
      ]);

      const user = userRes || null;
      const wishlist = wishlistRes?.properties || [];

      const suggestions = await generateSuggestions(user, wishlist);
      setState({ suggestions, loading: false });
    } catch (error) {
      console.log("init error", error);
      setState({ loading: false });
    }
  };

  const generateSuggestions = async (user, wishlist) => {
    const prefLocs = user?.preferred_locations?.map((l) => l.name).join(", ") || "none";
    const wishlistTypes = [...new Set(wishlist.flatMap((p) => p.property_type?.map((t) => t.name)).filter(Boolean))].join(", ") || "none";
    const wishlistAmenities = [...new Set(wishlist.flatMap((p) => p.amenities?.map((a) => a.name)).filter(Boolean))].slice(0, 5).join(", ") || "none";
    const wishlistFloors = [...new Set(wishlist.flatMap((p) => p.floor_plans?.map((f) => f.category)).filter(Boolean))].join(", ") || "none";
    const prices = wishlist.filter((p) => p.price_range?.maximum_price);
    const minP = prices.length ? Math.min(...prices.map((p) => p.price_range.minimum_price)) : 0;
    const maxP = prices.length ? Math.max(...prices.map((p) => p.price_range.maximum_price)) : 0;
    const priceRange = prices.length ? `₹${(minP / 1e7).toFixed(1)}Cr - ₹${(maxP / 1e7).toFixed(1)}Cr` : "none";
    const wishlistAreas = [...new Set(wishlist.map((p) => p.area?.name).filter(Boolean))].join(", ") || "none";
    const areaLocationMap = wishlist
      .filter((p) => p.area?.name && p.location?.name)
      .map((p) => `${p.area.name} is in ${p.location.name}`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(", ") || "none";

    const prompt = `You are a real estate AI assistant. Based on the user preferences below, generate exactly 4 short property search questions.
Rules:
- Return ONLY a JSON array of objects, no intro, no numbering, no extra text
- Each object has: "label" (max 10 words, the question) and "params" (object with only relevant keys from: ai_location, ai_area, ai_propertyType, ai_floor_plans_category, ai_maxPrice, ai_furnishing)
- ai_maxPrice should be a number in rupees (e.g. 20000000 for 2Cr)
- When using ai_area, ALWAYS also include ai_location (the city that area belongs to)
- label must include both area name AND location/city name when area is used
- Base questions ONLY on: preferred locations, areas, property types, amenities, price range, floor plan categories
- Do NOT mention any specific property or project names
- Example: [{"label":"2BHK Apartments in Saibaba Colony, Coimbatore","params":{"ai_location":"Coimbatore","ai_area":"Saibaba Colony","ai_propertyType":"Apartment","ai_floor_plans_category":"2bhk"}},...]

User preferred locations: ${prefLocs}
Wishlist areas (with their cities): ${wishlistAreas} — Mapping: ${areaLocationMap}
Property types: ${wishlistTypes}
Floor plan categories: ${wishlistFloors}
Price range: ${priceRange}
Amenities: ${wishlistAmenities}`;

    const res = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
    });

    const content = res.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return [];
  };

  const handleClick = (suggestion) => {
    const params = new URLSearchParams();
    Object.entries(suggestion.params).forEach(([k, v]) => params.set(k, String(v)));
    router.push(`/property-list?${params.toString()}`);
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#9b0f09]" />
      </div>
    );
  }

  return (
    <>
    <AISearchComponent suggestions={state.suggestions} />
    {/* <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <p className="text-sm text-gray-500">Suggested searches for you:</p>
      <div className="flex flex-wrap gap-3">
        {state.suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleClick(s)}
            className="px-4 py-2 rounded-full border border-[#9b0f09]/40 text-sm text-[#9b0f09] bg-[#fff6f6] hover:bg-[#9b0f09] hover:text-white transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div> */}
    </>
  );
}
