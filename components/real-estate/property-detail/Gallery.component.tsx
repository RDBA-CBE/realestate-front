"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SlideshowLightbox } from "lightbox.js-react";
import LightboxGallery from "@/components/common-components/Lightbox.component";
import {
  GitCompareArrowsIcon,
  Heart,
  ImagePlus,
  ImagesIcon,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { RWebShare } from "react-web-share";

interface GalleryProps {
  images: any[];
  data: any;
  updateList;
}

export default function Gallery({ data, images, updateList }: GalleryProps) {
  const [startIndex, setStartIndex] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  console.log("✌️clickedImageIndex --->", clickedImageIndex);

  const [state, setState] = useSetState({
    is_compare: false,
    url:''
  });

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

  const openLightbox = (index: number) => {
    setClickedImageIndex(index);
    setLightboxOpen(true);
  };

  if (!images || images.length === 0) return null;

  const handleOpen = (index: number) => {
    setStartIndex(index);
    setLightboxOpen(true);
    setClickedImageIndex(index);
  };

  const handleWishList = async () => {
    console.log("hello");

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
        console.log("hello");
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
    <>
      {/* Layout with next/image */}

      {images.length === 1 ? (
        <div className="hidden md:block">
          <Card
            className="overflow-hidden rounded-2xl shadow-lg h-[500px] relative cursor-pointer"
            onClick={() => handleOpen(0)}
          >
            {/* Blurry background */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(${images?.[0]?.image})` }}
            ></div>

            {/* Main Image */}
            <Image
              src={images?.[0]?.image}
              alt="Gallery Image"
              fill
              className="object-contain relative z-10"
            />
          </Card>
        </div>
      ) : (
        <div className=" hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 w-full">
            {/* Left big image */}

            <Card
              className="overflow-hidden rounded-2xl shadow-lg h-[400px] lg:h-[500px] relative cursor-pointer"
              onClick={() => handleOpen(0)}
            >
              <div
                className="absolute inset-0 z-0 bg-cover bg-center filter blur-lg scale-110"
                style={{ backgroundImage: `url(${images?.[0]?.image})` }}
              ></div>

              <Image
                src={images?.[0]?.image}
                alt="Main Gallery"
                fill
                className="object-cover 2xl:object-contain"
              />
            </Card>

            {/* Right grid */}
            <div
              className={`md:grid h-[400px] lg:h-[500px] gap-4  ${
                images.length - 1 === 1
                  ? "md:grid-rows-1"
                  : images.length - 1 === 2
                  ? "md:grid-rows-2"
                  : images.length - 1 >= 2
                  ? "md:grid-cols-1 md:grid-rows-2"
                  : "md:grid-cols-1 md:grid-rows-2"
              }`}
            >
              {images.slice(1, 3).map((img, i) => {
                const remaining = images.length - 3; // total - shown (1 main + 2)
                const isLastCard = i === 1 && images.length > 3; // show overlay only if > 3

                return (
                  <Card
                    key={i}
                    className="overflow-hidden rounded-2xl shadow-lg relative cursor-pointer"
                    onClick={() => handleOpen(i + 1)}
                  >
                    <Image
                      src={img?.image}
                      alt={`Gallery ${i + 1}`}
                      fill
                      className="object-cover"
                    />

                    {isLastCard && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">
                          + {remaining} more
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------responsive gallery------------ */}

      <div className=" block md:hidden">
        <div className="relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg cursor-pointer">
          {/* Main image */}
          {images?.[0] && (
            <Image
              src={images[0].image}
              alt="Main Property Image"
              fill
              className="object-cover"
            />
          )}

          {/* Overlay for dim + tap text */}
          {images?.length > 1 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span
                className="bg-white/60 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow"
                onClick={() => handleOpen(0)}
              >
                Tap to see all images
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-2 block sm:hidden">
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
          </div>

          {/* Bottom-right image count */}
          {images?.length > 1 && (
            <div
              className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
              onClick={() => handleOpen(0)}
            >
              <ImagesIcon className="w-4 h-4" />
              <span>{images.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-full wi-full">
        <LightboxGallery
          images={images}
          initialIndex={clickedImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          autoSlide={false}
        />
      </div>
    </>
  );
}
