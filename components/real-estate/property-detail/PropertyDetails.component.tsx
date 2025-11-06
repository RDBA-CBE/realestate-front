"use client";

import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFLetter, formatNumber } from "@/utils/function.utils";
import {
  Bed,
  Bath,
  Calendar,
  Car,
  Maximize2,
  Home,
  Star,
  ToiletIcon,
  ArmchairIcon,
  Building2,
} from "lucide-react";
import { useState } from "react";

export default function PropertyDetails({ data }: any) {
  console.log("✌️data --->", data);

  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 300;

  if (!data?.description) return null;

  const isLong = data.description.length > MAX_LENGTH;
  const shortText = isLong
    ? data.description.slice(0, MAX_LENGTH) + "..."
    : data.description;

  let details = [];

  if (data?.property_type?.name == "Residential") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(data?.total_area) ?? "-",
      },
      {
        icon: Maximize2,
        label: "Built up Area",
        value: formatNumber(data?.built_up_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(data?.listing_type) ?? "-",
      },
      ...(data?.built_year
        ? [
            {
              icon: Calendar,
              label: "Year Built",
              value: data?.built_year ?? "-",
            },
          ]
        : []),

      {
        icon: Home,
        label: "Status",
        value: capitalizeFLetter(data?.status) ?? "-",
      },

      ...(data?.bedrooms
        ? [{ icon: Bed, label: "Bedroom", value: data?.bedrooms ?? "-" }]
        : []),
      ...(data?.bathrooms
        ? [{ icon: Bath, label: "Bath", value: data?.bathrooms ?? "-" }]
        : []),
      ...(data?.balcony
        ? [{ icon: Building2, label: "Balcony", value: data?.balcony ?? "-" }]
        : []),

      // { icon: Car, label: "Garage", value: data?.garage ?? "-" },

      {
        icon: ArmchairIcon,
        label: "Furnishing",
        value: data?.furnishing ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  if (data?.property_type?.name == "Agricultural") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(data?.total_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(data?.listing_type) ?? "-",
      },

      {
        icon: Home,
        label: "Status",
        value: capitalizeFLetter(data?.status) ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  if (data?.property_type?.name == "Industrial") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(data?.total_area) ?? "-",
      },

      {
        icon: Maximize2,
        label: "Built up Area",
        value: formatNumber(data?.built_up_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(data?.listing_type) ?? "-",
      },

      ...(data?.bathrooms
        ? [
            {
              icon: ToiletIcon,
              label: "Washroom",
              value: data?.bathrooms ?? "-",
            },
          ]
        : []),

      ...(data?.built_year
        ? [
            {
              icon: Calendar,
              label: "Year Built",
              value: data?.built_year ?? "-",
            },
          ]
        : []),

      {
        icon: Star,
        label: "Status",
        value: capitalizeFLetter(data?.status) ?? "-",
      },
      {
        icon: ArmchairIcon,
        label: "Furnishing",
        value: data?.furnishing ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  if (data?.property_type?.name == "Commercial") {
    details = [
      {
        icon: Maximize2,
        label: "Total Area",
        value: formatNumber(data?.total_area) ?? "-",
      },

      {
        icon: Maximize2,
        label: "Built up Area",
        value: formatNumber(data?.built_up_area) ?? "-",
      },

      {
        icon: Home,
        label: "Offer Type",
        value: capitalizeFLetter(data?.listing_type) ?? "-",
      },

      ...(data?.bathrooms
        ? [
            {
              icon: ToiletIcon,
              label: "Washroom",
              value: data?.bathrooms ?? "-",
            },
          ]
        : []),

      ...(data?.built_year
        ? [
            {
              icon: Calendar,
              label: "Year Built",
              value: data?.built_year ?? "-",
            },
          ]
        : []),

      {
        icon: Star,
        label: "Status",
        value: capitalizeFLetter(data?.status) ?? "-",
      },

      {
        icon: ArmchairIcon,
        label: "Furnishing",
        value: data?.furnishing ?? "-",
      },

      // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
    ];
  }

  console.log("detail", data);

  return (
    <>
      <h3 className="text-xl font-semibold mb-3">Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {details.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3   transition-shadow duration-200"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-red-50  text-red-500  rounded-full flex items-center justify-center">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-md font-semibold text-gray-900 0">
                {typeof item.value === "number"
                  ? formatNumber(item.value)
                  : item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
