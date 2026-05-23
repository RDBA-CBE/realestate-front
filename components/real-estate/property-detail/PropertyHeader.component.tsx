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
import { useEffect, useState } from "react";
import Models from "@/imports/models.import";
import { RWebShare } from "react-web-share";
import { useRouter } from "next/navigation";

export default function PropertyHeader(props: any) {
  const [state, setState] = useSetState({
    is_compare: false,
    url : ''
  });

  const router = useRouter();

   const [loginPopup, setLoginPopup] = useState(false);

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
      // e.stopPropagation();
      // e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) { setLoginPopup(true); return; }
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
      } catch (err) { console.log(err); }
    };

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

  const handleWishLis = async () => {
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
    <div className=" mt-5 md:mt-0 ">
      <div className="flex flex-row items-between md:items-start justify-between gap-4">
        <div className="space-y-2 md:w-[70%]">
          <p className="section-ti mb-2 !text-dred block sm:hidden">
              {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </p>
          <h1 className="section-ti">{data?.title}</h1>
          <p>By <span className="text-dred cursor-pointer" onClick={()=> router.push(`/developer/${data?.developer?.id}`)}>{data?.developer?.industry} </span></p>
          <p className="text-black leading-relaxed">{data?.address}</p>
          {/* <div className="block sm:hidden">
            <span className="section-in-ti">
              {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </span>
           
          </div> */}
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
         
          <div>
            <p className="section-ti mb-3 !text-dred pt-2">
              {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </p>
            {/* <p className="text-sm text-gray-600 ">
              {(data?.price_per_sqft)}/sq ft
            </p> */}
          </div>

           <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => handleWishList()}
              size="icon"
              variant="outline"
              className={`rounded-full ${
                data?.user_wishlists
                  ? "bg-color2 border-dred !text-white hover:bg-color2 hover: border-[#9b0f09]"
                  : "bg-white text-dred border-dred hover:text-dred"
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
                  ? "bg-color2 border-dred !text-white hover:bg-green-600 hover:bg-[#9b0f09]"
                  : "bg-white text-dred border-dred hover:text-dred"
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
              <Button size="icon" variant="outline" className="rounded-full text-dred border-dred hover:border-dred hover:text-dred" >
                <Share2 size={18} />
              </Button>
            </RWebShare>

            {/* <Button size="icon" variant="outline" className="rounded-full">
            <Printer size={18} />
          </Button> */}
          </div>
        </div>
      </div>
      {LoginPopup}
    </div>
  );
}
