"use client";

import Models from "@/imports/models.import";
import { useSetState } from "@/utils/function.utils";
import { useEffect } from "react";
import { Mistral } from "@mistralai/mistralai";
import { Loader2 } from "lucide-react";
import AISearchComponent from "@/components/common-components/AiSearch";

const mistral = new Mistral({ apiKey: "GSvdWG8ec3JbLYz4EVfkqC64Aj1Kf9K1" });

export default function AISearchPage() {
  const [state, setState] = useSetState({
    suggestions: [],
    loading: true,
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const token = localStorage.getItem("demo_token");
      const id = localStorage.getItem("userId");
      const wishlist_id = localStorage.getItem("wishlist_id");

      if (token && id) {
        // Logged-in user: personalized suggestions
        const [userRes, wishlistRes] = await Promise.all([
          Models.user.details(id),
          wishlist_id ? Models.wishlist.list(wishlist_id) : null,
        ]);
        const user = userRes || null;
        const wishlist = wishlistRes?.properties || [];
        const suggestions = await generatePersonalizedSuggestions(user, wishlist);
        setState({ suggestions, loading: false });
      } else {
        // Guest: generic real estate questions
        const suggestions = await generateGenericSuggestions();
        setState({ suggestions, loading: false });
      }
    } catch (error) {
      console.log("init error", error);
      setState({ loading: false });
    }
  };

  const generatePersonalizedSuggestions = async (user, wishlist) => {
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
    const wishlistListingTypes = [...new Set(wishlist.map((p) => p.listing_type).filter(Boolean))].join(", ") || "none";
    const wishlistBathrooms = [...new Set(wishlist.map((p) => p.bathrooms).filter(Boolean))].join(", ") || "none";

    const prompt = `You are a real estate AI assistant. Based on the user preferences below, generate exactly 4 short property search questions.
Rules:
- Return ONLY a JSON array of strings, no intro, no numbering, no extra text
- Each question max 10 words
- ONLY use locations/cities that appear in the wishlist or preferred locations list below — do NOT invent or use any other city
- At least 3 out of 4 questions must use locations/areas from the wishlist
- When area is used, always mention its city too (e.g. "in Saibaba Colony, Coimbatore")
- Use listing type (sale/lease), property type, bathrooms, price range, locations, areas, floor plans in the questions
- Mix different filters across the 4 questions
- Do NOT mention any specific property or project names
- Example: ["2BHK Apartments for Sale in Coimbatore", "Villas for Lease in Bangalore under 2Cr", "3 Bathroom Flats in Saibaba Colony, Coimbatore", ...]

User preferred locations (lower priority): ${prefLocs}
Wishlist locations & areas (HIGH priority): ${wishlistAreas} — Mapping: ${areaLocationMap}
Wishlist unique cities: ${[...new Set(wishlist.map((p) => p.location?.name).filter(Boolean))].join(", ") || "none"}
Property types: ${wishlistTypes}
Floor plan categories: ${wishlistFloors}
Price range: ${priceRange}
Listing types: ${wishlistListingTypes}
Bathrooms: ${wishlistBathrooms}
Amenities: ${wishlistAmenities}`;

    const res = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
    });

    const content = res.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).map((label) => ({ label }));
    }
    return [];
  };

  const generateGenericSuggestions = async () => {
    // Fetch actual locations from dynamicFilter API
    const filterRes = await Models.property.dynamicFilter({});
    const availableLocations = (filterRes?.location || []).map((l) => l.name).join(", ") || "none";
    const availableTypes = (filterRes?.property_type || []).map((t) => t.name).join(", ") || "none";
    const availableListingTypes = (filterRes?.listing_type || []).map((t) => t.name).join(", ") || "none";

    const prompt = `You are a real estate AI assistant for an Indian property search platform.
Generate exactly 4 short generic property search questions for a new visitor.
Rules:
- Return ONLY a JSON array of strings, no intro, no numbering, no extra text
- Each question max 10 words
- ONLY use locations from this list: ${availableLocations}
- ONLY use property types from this list: ${availableTypes}
- ONLY use listing types from this list: ${availableListingTypes}
- Cover variety: mix listing type (sale/lease), property types, bathrooms, price ranges
- Do NOT use any city or location not in the list above
- Example: ["3BHK Apartments for Sale in Chennai under 1Cr", "2 Bathroom Villas for Lease in Bangalore"]`;

    const res = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
    });

    const content = res.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).map((label) => ({ label }));
    }
    return [];
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#9b0f09]" />
      </div>
    );
  }

  return <AISearchComponent suggestions={state.suggestions} refresh={()=>init()} />;
}
