"use client";

import {
  Heart,
  Share2,
  Copy,
  Printer,
  Bed,
  Bath,
  Square,
  GitCompareArrowsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  capitalizeFLetter,
  formatNumber,
  formattedNoDecimal,
  formatToINR,
  Success,
  TimeAgo,
  useSetState,
} from "@/utils/function.utils";
import { useEffect } from "react";
import Models from "@/imports/models.import";

export default function PropertyHeader(props: any) {
  const [state, setState] = useSetState({
    is_compare: false,
  });

  const { data, updateList } = props;

  useEffect(() => {
    const compareList = localStorage.getItem("compare");
    if (compareList?.length > 0) {
      if (compareList.includes(data?.id)) {
        setState({ is_compare: true });
      } else {
        setState({ is_compare: false });
      }
    }
  }, [data]);

  const handleWishList = async () => {
    try {
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
      if (compares?.length > 0) {
        const is_compared = compares?.includes(data?.id);
        setState({ is_compare: is_compared });
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{data?.title}</h1>
        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
          <span>{`${capitalizeFLetter(data?.city)} , ${capitalizeFLetter(
            data?.state
          )} `}</span>
          <span className="flex items-center gap-1 text-red-500 font-medium">
            ● For {capitalizeFLetter(data?.listing_type)}
          </span>
          <span className="flex items-center gap-1">
            ⏱ {TimeAgo(data?.created_at)}
          </span>
          {/* <span className="flex items-center gap-1">🔗 8721</span> */}
        </div>

        <div className="flex items-center gap-6 text-gray-700 mt-2">
          <div className="flex items-center gap-1">
            <Bed size={18} /> <span>{data?.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} /> <span>{data?.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={18} />{" "}
            <span>{formatNumber(data?.built_up_area)} sqft</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleWishList()}
            size="icon"
            variant="outline"
            className={`rounded-full ${
              data?.user_wishlists
                ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
                : "bg-white text-black"
            }`}
          >
            <Heart
              size={18}
              fill={data?.user_wishlists ? "currentColor" : "none"}
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
          {/* <Button size="icon" variant="outline" className="rounded-full">
            <Printer size={18} />
          </Button> */}
        </div>
        <div>
          <p className="text-2xl font-bold">{formatToINR(data?.price)}</p>
          <p className="text-sm text-gray-600">
            {formatToINR(data?.price_per_sqft)}/sq ft
          </p>
        </div>
      </div>
    </div>
  );
}
