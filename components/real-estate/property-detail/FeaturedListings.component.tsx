"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const featured = [
  { img: "/house4.jpg", title: "Family House", price: "$720,000" },
  { img: "/house5.jpg", title: "Cottage", price: "$550,000" },
  { img: "/house6.jpg", title: "Luxury Villa", price: "$1,200,000" },
];

export default function FeaturedListings() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Discover Featured Listings</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {featured.map((item, i) => (
          <Card key={i} className="rounded-2xl shadow">
            <Image
              src={item.img}
              alt={item.title}
              width={400}
              height={250}
              className="rounded-t-2xl object-cover"
            />
            <CardContent className="p-4">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-gray-600">{item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
