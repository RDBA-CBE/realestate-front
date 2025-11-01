"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  formatPriceRange,
  formatToINR,
  Success,
  useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  const [activeTab, setActiveTab] = useState(0);

  const router = useRouter()

  useEffect(() => {
    compareList();
  }, []);

  const compareList = async () => {
    try {
      setState({ loading: true });
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
        loading: false,
      });
    } catch (error) {
      setState({ loading: false });
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
      attributes: [{ label: "Furnishing", key: "furnishing" }],
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

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="w-full h-32 bg-gray-300 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="w-4 h-4 bg-gray-300 rounded ml-2"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex justify-between items-center">
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="hidden lg:block relative overflow-x-auto rounded-xl border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-white">
            <th className="sticky left-0 w-64 bg-white flex-shrink-0 p-4 text-left border-r border-gray-200 z-10">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </th>
            {[1, 2, 3].map((item) => (
              <th
                key={item}
                className="min-w-[280px] border-l border-gray-100 p-4 py-[40px] text-left"
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-gray-300 rounded absolute top-0 right-0"></div>
                  <div className="w-full h-28 bg-gray-300 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((groupIndex) => (
            <React.Fragment key={groupIndex}>
              <tr className="bg-gray-50">
                <td colSpan={4} className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </td>
              </tr>
              {[1, 2, 3, 4].map((attrIndex) => (
                <tr key={attrIndex} className="border-b border-gray-200">
                  <td className="sticky left-0 w-64 bg-white p-3 border-r border-gray-200 z-10">
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </td>
                  {[1, 2, 3].map((propertyIndex) => (
                    <td
                      key={propertyIndex}
                      className="min-w-[280px] p-3 border-l border-gray-100 text-center"
                    >
                      <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  const SkeletonTabs = () => (
    <div className="lg:hidden mb-6 animate-pulse">
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="px-4 py-2 bg-gray-300 rounded-lg w-32 h-10"
          ></div>
        ))}
      </div>
    </div>
  );

  const renderMobileTabContent = () => {
    const currentGroup = attributeGroups[activeTab];

    return (
      <div className="lg:hidden space-y-4">
        {state.propertyList.map((property: any) => (
          <div
            key={property.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-lg shadow-md mb-2">
                  <Image
                    src={property?.primary_image?.image}
                    alt={property.title}
                    className="w-full h-32 object-cover"
                    width={100}
                    height={32}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {property.title}
                </h3>
                <p className="text-xs text-red-600 font-bold mt-1">
                  {formatPriceRange(
                    property?.price_range?.minimum_price,
                    property?.price_range?.maximum_price
                  )}{" "}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {property.city}, {property.state}
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 transition ml-2"
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
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 border-b pb-1">
                {currentGroup.group}
              </h4>
              {currentGroup.attributes.map((attr) => (
                <div
                  key={attr.key}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 font-medium">
                    {attr.label}:
                  </span>
                  <span
                    className={`${
                      attr.highlight
                        ? "text-red-600 font-bold"
                        : "text-gray-900"
                    }`}
                  >
                    {getDisplayValue(property, attr)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDesktopTable = () => (
    <div className="hidden lg:block relative overflow-x-auto rounded-xl border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-white">
            <th className="sticky left-0 w-64 bg-white flex-shrink-0 p-4 text-left border-r border-gray-200 z-10">
              <span className="text-sm font-extrabold text-black uppercase">
                Property
              </span>
            </th>
            {state.propertyList?.map((property: any) => (
              <th
                key={property.id}
                className="min-w-[280px] border-l border-gray-100 p-4 py-[40px] text-left"
              >
                <div className="relative">
                  <button
                    className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition"
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
                    {formatPriceRange(
                      property?.price_range?.minimum_price,
                      property?.price_range?.maximum_price
                    )}{" "}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {property.city}, {property.state}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributeGroups.map((groupData, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <tr className="bg-gray-50">
                <td colSpan={state.propertyList.length + 1} className="p-3">
                  <span className="text-sm font-extrabold text-black uppercase">
                    {groupData.group}
                  </span>
                </td>
              </tr>
              {groupData.attributes.map((attr, i) => (
                <tr
                  key={attr.key}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="sticky left-0 w-64 bg-white p-3 border-r border-gray-200 text-sm font-medium text-gray-900 z-10">
                    {attr.label}
                  </td>
                  {state.propertyList.map((property: any) => (
                    <td
                      key={property.id}
                      className="min-w-[280px] p-3 border-l border-gray-100 text-center"
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
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-[85rem] mx-auto"
    >
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {state.loading ? (
            <>
              <div className="lg:hidden">
                <SkeletonTabs />
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <SkeletonCard key={item} />
                  ))}
                </div>
              </div>

              <SkeletonTable />
            </>
          ) : state.propertyList.length === 0 ? (
            // Empty State
            <div className="text-center py-12 h-[700px] flex flex-col items-center justify-center">
              <p className="text-gray-500">
                No properties to compare. Add properties to compare list.
              </p>
              <button className="w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed " onClick={()=>router.push("property-list")}>
                {" "}
                Add properties to compare
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-12">
                Compare Properties
              </h1>
              <div className="lg:hidden mb-6">
                <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                  {attributeGroups.map((group, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === index
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {group.group}
                    </button>
                  ))}
                </div>
              </div>

              {renderMobileTabContent()}

              {renderDesktopTable()}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyComparisonGrid;
