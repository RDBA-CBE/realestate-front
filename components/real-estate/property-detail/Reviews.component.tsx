"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Review = {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  images?: string[];
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Bessie Cooper",
    date: "12 March 2022",
    rating: 5,
    text: "Every single thing we tried with John was delicious! Found some awesome places we would definitely go back to on our trip. John was also super friendly and passionate about Beşiktaş and Istanbul.",
    images: [
      "/assets/images/real-estate/review1.png",
      "/assets/images/real-estate/review2.png",
      "/assets/images/real-estate/review1.png",
      "/assets/images/real-estate/review2.png",
    ],
  },
  {
    id: 2,
    name: "Darrell Steward",
    date: "12 March 2022",
    rating: 3,
    text: "Every single thing we tried with John was delicious! Found some awesome places we would definitely go back to on our trip. John was also super friendly and passionate about Beşiktaş and Istanbul.",
  },
];

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="py-6 border-b last:border-none">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
            {review.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-semibold">{review.name}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
        </div>
        {/* Rating */}
        <div className="flex text-yellow-400">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400" />
          ))}
        </div>
      </div>

      {/* Review text */}
      <p className="mt-4 text-gray-700">{review.text}</p>

      {/* Images */}
      {review.images && (
        <div className="flex gap-3 mt-4">
          {review.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="Review image"
              width={120}
              height={90}
              className="rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* Helpful buttons */}
      <div className="flex gap-6 mt-4 text-sm text-gray-600">
        <button className="flex items-center gap-1 hover:text-gray-900">
          <ThumbsUp className="w-4 h-4" /> Helpful
        </button>
        <button className="flex items-center gap-1 hover:text-gray-900">
          <ThumbsDown className="w-4 h-4" /> Not helpful
        </button>
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <Card className="border-none shadow-none bg-transparent">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 5.0 · 3
        reviews
      </h3>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-sm text-gray-600 flex items-center gap-1">
            Sort by Newest ▾
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Newest</DropdownMenuItem>
          <DropdownMenuItem>Oldest</DropdownMenuItem>
          <DropdownMenuItem>Highest rating</DropdownMenuItem>
          <DropdownMenuItem>Lowest rating</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <CardContent className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </CardContent>
  </Card>
  );
}
