import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceType: "rent" | "sale";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  primaryImage: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
  view: "grid" | "list";
}

export function PropertyCard({ property, view }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        view === "list" ? "flex" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative ${view === "list" ? "w-1/3" : ""}`}>
        <Image
          src={property.primaryImage}
          alt={property.title}
          width={400}
          height={280}
          className="w-full h-64 object-cover"
        />

        {property.featured && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white font-semibold px-3 py-1 text-sm">
            FEATURED
          </Badge>
        )}

        <Badge className="absolute top-4 right-4 bg-white text-black font-bold px-3 py-2 text-lg">
          {formatPrice(property.price)}
          {property.priceType === "rent" && " / mo"}
        </Badge>
      </div>

      <CardContent className={`p-6 ${view === "list" ? "w-2/3" : ""}`}>
        <h3 className="font-bold text-xl mb-2 text-gray-900">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bed className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center space-x-2">
            <Square className="h-4 w-4 text-gray-600" />
            <span className="text-sm">
              {/* {property.squareFeet.toLocaleString()} sqft */}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-blue-600 text-blue-600 px-6 py-2 font-semibold"
          >
            {property.priceType === "rent" ? "FOR RENT" : "FOR SALE"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
