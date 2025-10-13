import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Ruler,
  FileText,
  Calendar,
  Square,
  Building,
  IndianRupee,
  MapPin,
} from "lucide-react";

const FloorPlan = () => {
  const pricingData = {
    plots: { min: "18 L", max: "43.6 L", area: "2000-2500 SQ.FT" },
    villas: [
      { type: "2 BHK", price: "40 L", area: "2200 SQ.FT" },
      { type: "3 BHK", price: "56 L", area: "2500 SQ.FT" },
    ],
    startingPrice: "34.9 L",
    details: {
      area: "2000 sq.ft",
      reraId: "TN/11/Layout/3993/...",
      possession: "Jan, 2023",
    },
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Home className="h-5 w-5 text-blue-600" />
          Price & Floor Plan
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Pricing */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Plots</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold text-green-700">
                  {pricingData.plots.min} - {pricingData.plots.max}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {pricingData.plots.area}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Starting From</p>
              <div className="flex items-center justify-end gap-1">
                <IndianRupee className="h-5 w-5 text-green-600" />
                <span className="text-xl font-bold text-green-700">
                  {pricingData.startingPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Villas */}
        <div className="grid grid-cols-2 gap-3">
          {pricingData.villas.map((villa, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-3 w-3 text-gray-600" />
                  <span className="font-semibold text-sm">{villa.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3 text-green-600" />
                  <span className="font-bold text-green-700">
                    {villa.price}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                  <Square className="h-3 w-3" />
                  <span>{villa.area}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 p-2 bg-gray-50 rounded">
            <Ruler className="h-3 w-3 text-blue-600" />
            <div>
              <p className="text-gray-600">Area</p>
              <p className="font-semibold">{pricingData.details.area}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-2 bg-gray-50 rounded">
            <FileText className="h-3 w-3 text-blue-600" />
            <div>
              <p className="text-gray-600">RERA ID</p>
              <p className="font-semibold truncate">
                {pricingData.details.reraId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-2 bg-gray-50 rounded">
            <Calendar className="h-3 w-3 text-blue-600" />
            <div>
              <p className="text-gray-600">Possession</p>
              <p className="font-semibold">{pricingData.details.possession}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FloorPlan;
