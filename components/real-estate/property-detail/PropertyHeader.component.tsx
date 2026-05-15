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
  BedDouble,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useEffect } from "react";
import Models from "@/imports/models.import";
import { RWebShare } from "react-web-share";

export default function PropertyHeader(props: any) {
  const [state, setState] = useSetState({
    is_compare: false,
    url : ''
  });

  const { data, updateList } = props;

   useEffect(() => {
    setState({url:window.location.href});
  }, []);

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
      if (compares?.length > 0) {
        const is_compared = compares?.includes(data?.id);
        setState({ is_compare: is_compared });
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };


  

  return (
    <div className=" mt-5 md:mt-0 px-2">
      <div className="flex flex-row items-between md:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="section-ti">{data?.title}</h1>
          <p>By <span className="text-dred">{data?.developer?.industry} </span></p>
          <p className="text-black font-semibold">{data?.address}</p>
          <div className="block sm:hidden">
            <span className="section-in-ti">
              {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </span>
            {/* <span className="text-sm text-gray-600">
              ({formatToINR(data?.price_per_sqft)}/sq ft)
            </span> */}
          </div>
          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 ">
            {/* <span>{`${capitalizeFLetter(data?.area?.name)} , ${capitalizeFLetter(
              data?.location?.name
            )} `}</span> */}
            <span className="flex items-center gap-1 text-dred font-medium">
              ● For {capitalizeFLetter(data?.listing_type)}
            </span>
            <span className="flex items-center gap-1">
              ⏱ {TimeAgo(data?.created_at)}
            </span>
            {/* <span className="flex items-center gap-1">🔗 8721</span> */}
          </div>

          {/* <div className="flex flex-wrap items-center gap-2 xs:gap-6 text-gray-700 pt-2">
            <div className="flex items-center gap-1  py-0.5 rounded-md">
               {data.floor_plans && data.floor_plans.length > 0 && (
               <span className="flex items-center gap-1 text-dred border border-dred px-3 rounded-md"><BedDouble className="w-4 h-4 text-dred" />   {`${[
                        ...new Set(
                          data.floor_plans.map((floor_plan: any) =>
                            floor_plan.category?.match(/\d+/)?.[0]
                          )
                        ),
                      ].join(", ")} BHK Appartment`}</span>
            )}
            </div>
           
            <div className="flex items-center gap-1 text-dred border border-dred px-3 rounded-md">
              <Square size={18} className="text-dred" />{" "}
              <span className="text-dred">{(data?.built_up_area)} sqft</span>
            </div>
          </div> */}
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end  gap-1 hidden sm:block">
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={() => handleWishList()}
              size="icon"
              variant="outline"
              className={`rounded-full ${
                data?.user_wishlists
                  ? "bg-color2 border-dred text-white hover:bg-color2 hover:border-[#9b0f09]"
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
            <RWebShare
              data={{
                title: "Karpagam Institute Of Technology",
                text: `Check this out!`,
                url: state.url,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button size="icon" variant="outline" className="rounded-full">
                <Share2 size={18} />
              </Button>
            </RWebShare>

            {/* <Button size="icon" variant="outline" className="rounded-full">
            <Printer size={18} />
          </Button> */}
          </div>
          <div>
            <p className="section-ti mt-2">
              {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </p>
            {/* <p className="text-sm text-gray-600 ">
              {(data?.price_per_sqft)}/sq ft
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
