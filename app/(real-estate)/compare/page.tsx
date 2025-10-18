"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dropdown,
  formatNumber,
  formatToINR,
  Success,
  useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";
import Image from "next/image";

const PropertyComparisonGrid = () => {
  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    handNext: null,
    page: 1,
    isLoadingMore: false,
    categoryList: [],
    minPrice: 0,
    maxPrice: 1000000,
  });

  console.log("✌️propertyList --->", state.propertyList);

  useEffect(() => {
    compareList();
  }, []);

  const compareList = async () => {
    try {
      const ids = localStorage.getItem("compare");
      const idArray = JSON.parse(ids || "[]");

      const totalList = await Promise.all(
        idArray.map(async (id: number) => {
          const response: any = await Models.property.details(id);
          return response;
        })
      );
      setState({
        propertyList: totalList,
      });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleRemove = (id: number) => {
    const updatedList = state.propertyList.filter(
      (property: any) => property.id !== id
    );
    setState({ propertyList: updatedList });

    const ids = localStorage.getItem("compare");
    const idArray = JSON.parse(ids || "[]");
    const updatedIds = idArray.filter(
      (propertyId: number) => propertyId !== id
    );
    localStorage.setItem("compare", JSON.stringify(updatedIds));
    Success("Removed from your compare list !");
  };

  const attributeGroups = [
    {
      group: "Property Information",
      attributes: [
        // { label: "Price", key: "price", format: (value: any) => formatToINR(value) },
        { label: "Location", key: "city" },
        {
          label: "Property Type",
          key: "property_type",
          format: (value: any) => value?.name,
        },
        { label: "Status", key: "status" },
        { label: "Listing Type", key: "listing_type" },
      ],
    },
    {
      group: "Property Details",
      attributes: [
        { label: "Bedrooms", key: "bedrooms" },
        { label: "Bathrooms", key: "bathrooms" },
        {
          label: "Total Area",
          key: "total_area",
          format: (value: any) => `${value} Sq Ft`,
        },
        {
          label: "Built Up Area",
          key: "built_up_area",
          format: (value: any) => `${value} Sq Ft`,
        },
        { label: "Built Year", key: "built_year" },
        { label: "Floor Number", key: "floor_number" },
        { label: "Total Floors", key: "total_floors" },
        { label: "Balconies", key: "balconies" },
        { label: "Facing Direction", key: "facing_direction" },
      ],
    },
    {
      group: "Address",
      attributes: [
        { label: "Address", key: "address" },
        { label: "City", key: "city" },
        { label: "State", key: "state" },
        { label: "Country", key: "country" },
        { label: "Postal Code", key: "postal_code" },
      ],
    },
    {
      group: "Pricing",
      attributes: [
        {
          label: "Price",
          key: "price",
          format: (value: any) => formatToINR(value),
          highlight: true,
        },
        {
          label: "Price Per Sq Ft",
          key: "price_per_sqft",
          format: (value: any) => `₹${value}`,
        },
        {
          label: "Maintenance Charges",
          key: "maintenance_charges",
          format: (value: any) => (value ? formatToINR(value) : "-"),
        },
        {
          label: "Security Deposit",
          key: "security_deposit",
          format: (value: any) => (value ? formatToINR(value) : "-"),
        },
      ],
    },
    {
      group: "Features",
      attributes: [
        { label: "Furnishing", key: "furnishing" },
        // { label: "Parking", key: "parking" },
        // { label: "Parking Spaces", key: "parking_spaces" },
      ],
    },
  ];

  const getDisplayValue = (property: any, attr: any) => {
    const value = property[attr.key];

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (attr.format) {
      return attr.format(value);
    }

    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-[85rem] mx-auto"
    >
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-12">
            Compare Properties
          </h1>

          {state.propertyList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No properties to compare. Add properties to compare list.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-xl border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">
                <div className="flex">
                  <div className="sticky left-0 w-64 bg-white flex-shrink-0 p-4 flex items-center justify-start border-r border-gray-200 z-10">
                    <span className="text-sm font-extrabold text-black uppercase">
                      Property
                    </span>
                  </div>

                  {state.propertyList?.map((property: any) => (
                    <div
                      key={property.id}
                      className="relative flex-grow min-w-[280px] border-l border-gray-100 p-4 py-[40px]"
                    >
                      <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                        title="Remove property"
                        onClick={() => handleRemove(property.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div className="relative overflow-hidden rounded-lg shadow-md mb-2">
                        <img
                          src={property?.primary_image?.image}
                          alt={property.title}
                          className="w-full h-28 object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {property.title}
                      </h3>
                      <p className="text-xs text-red-600 font-bold mt-1">
                        {formatToINR(property.price)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {property.city}, {property.state}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {attributeGroups.map((groupData, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {/* Group Header */}
                    <div className="flex sticky left-0 z-10 bg-white">
                      <div className="sticky left-0 w-64 bg-white flex-shrink-0 p-3 flex items-center justify-start">
                        <span className="text-sm font-extrabold text-black uppercase bg-white">
                          {groupData.group}
                        </span>
                      </div>

                      {state.propertyList.map((property: any) => (
                        <div
                          key={property.id}
                          className="flex-grow min-w-[280px] bg-white"
                        ></div>
                      ))}
                    </div>

                    {groupData.attributes.map((attr, i) => (
                      <div
                        key={attr.key}
                        className={`flex transition duration-150`}
                      >
                        <div
                          className={`sticky left-0 w-64 flex-shrink-0 p-3 border-r border-gray-200 flex items-center z-10 bg-white`}
                        >
                          <span className="text-sm">{attr.label}</span>
                        </div>

                        {state.propertyList.map((property: any) => (
                          <div
                            key={property.id}
                            className="flex-grow min-w-[280px] p-3 text-center border-l border-gray-100 flex items-center justify-center"
                          >
                            <span
                              className={`${
                                attr.highlight
                                  ? "text-lg font-extrabold text-red-600"
                                  : "text-gray-800 text-sm"
                              }`}
                            >
                              {getDisplayValue(property, attr)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyComparisonGrid;
