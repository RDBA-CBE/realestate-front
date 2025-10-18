"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Dropdown, useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  size: string;
  propertyId: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  amenities: {
    airConditioning: boolean;
    barbeque: boolean;
    gym: boolean;
    pool: boolean;
    cable: boolean;
  };
};

// The full data structure, now including a 'group' property for organization
const comparisonData = {
  properties: [
    {
      id: "1",
      title: "Home in Metric Way",
      price: "$14,000 / mo",
      location: "California City, CA, USA",
      image: "/assets/images/real-estate/compare1.png",
      type: "Apartment",
      address: "Quincy St",
      city: "New York",
      state: "New York",
      zip: "10013",
      country: "United States",
      size: "2560 Sq Ft",
      propertyId: "R43",
      bedrooms: 3,
      bathrooms: 1,
      garage: 1,
      amenities: {
        airConditioning: true,
        barbeque: false,
        gym: true,
        pool: true,
        cable: true,
      },
    },
    {
      id: "2",
      title: "Villa on Hollywood Boulevard",
      price: "$14,000 / mo",
      location: "California City, CA, USA",
      image: "/assets/images/real-estate/compare2.png",
      type: "Studio",
      address: "8100 S Ashland Ave",
      city: "Chicago",
      state: "New York",
      zip: "10013",
      country: "United States",
      size: "2560 Sq Ft",
      propertyId: "R43",
      bedrooms: 2,
      bathrooms: 4,
      garage: 4,
      amenities: {
        airConditioning: true,
        barbeque: false,
        gym: true,
        pool: true,
        cable: true,
      },
    },
    {
      id: "3",
      title: "Explore Old Barcelona",
      price: "$14,000 / mo",
      location: "California City, CA, USA",
      image: "/assets/images/real-estate/compare3.png",
      type: "Villa",
      address: "194 Mercer Street",
      city: "New York",
      state: "New York",
      zip: "10013",
      country: "United States",
      size: "2560 Sq Ft",
      propertyId: "R43",
      bedrooms: 5,
      bathrooms: 3,
      garage: 3,
      amenities: {
        airConditioning: true,
        barbeque: false,
        gym: true,
        pool: true,
        cable: true,
      },
    },
    {
      id: "4",
      title: "Explore Old Barcelona",
      price: "$14,000 / mo",
      location: "California City, CA, USA",
      image: "/assets/images/real-estate/compare3.png",
      type: "Villa",
      address: "194 Mercer Street",
      city: "New York",
      state: "New York",
      zip: "10013",
      country: "United States",
      size: "2560 Sq Ft",
      propertyId: "R43",
      bedrooms: 5,
      bathrooms: 3,
      garage: 3,
      amenities: {
        airConditioning: true,
        barbeque: false,
        gym: true,
        pool: true,
        cable: true,
      },
    },
    {
      id: "5",
      title: "Explore Old Barcelona",
      price: "$14,000 / mo",
      location: "California City, CA, USA",
      image: "/assets/images/real-estate/compare3.png",
      type: "Villa",
      address: "194 Mercer Street",
      city: "New York",
      state: "New York",
      zip: "10013",
      country: "United States",
      size: "2560 Sq Ft",
      propertyId: "R43",
      bedrooms: 5,
      bathrooms: 3,
      garage: 3,
      amenities: {
        airConditioning: true,
        barbeque: false,
        gym: true,
        pool: true,
        cable: true,
      },
    },
  ],

  // Attributes grouped by category
  attributeGroups: [
    {
      group: "Property Infomation",
      attributes: [
        { label: "Price / Rent", key: "price", highlight: true },
        { label: "Location", key: "location" },
        { label: "Property Type", key: "type" },
      ],
    },
    {
      group: "AMENITIES & STATS",
      attributes: [
        { label: "Bedrooms", key: "bedrooms" },
        { label: "Bathrooms", key: "bathrooms" },
        { label: "Size", key: "size" },
        { label: "Year Built", key: "year" },
      ],
    },
    {
      group: "ADDRESS",
      attributes: [
        { label: "Street Address", key: "address" },
        { label: "City", key: "city" },
        { label: "State/County", key: "state" },
      ],
    },
  ],
};

const PropertyComparisonGrid = () => {
  const { properties, attributeGroups } = comparisonData;
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

  const handleRemove = (id) => {
    console.log(`Property ${id} removed from comparison.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-[85rem] mx-auto "
    >
      <div className=" min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-12">
            Compare Properties
          </h1>

          <div className="relative overflow-x-auto  rounded-xl  border border-gray scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="sticky top-0 z-20  border-b border-gray-200 ">
              <div className="flex">
                <div className="sticky left-0 w-64 bg-white flex-shrink-0  p-4 flex items-center justify-start border-r border-gray-200 z-10">
                  <span className="text-sm font-extrabold text-black uppercase">
                    Property
                  </span>
                </div>

                {state.propertyList?.map((property) => (
                  <div
                    key={property.id}
                    className="relative flex-grow min-w-[280px] border-l border-gray-100 p-4 py-[40px]"
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition "
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
                        src={property.primary_image}
                        alt={property.title}
                        className="w-full h-28 object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-xs text-red-600 font-bold mt-1">
                      {property.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {attributeGroups.map((groupData, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {/* Group Header (e.g., PRICE BREAKUP) */}
                  <div className="flex  sticky left-0 z-10 bg-white">
                    <div className="sticky left-0 w-64 bg-white flex-shrink-0 p-3 flex items-center justify-start ">
                      <span className="text-sm font-extrabold text-black uppercase  bg-white">
                        {groupData.group}
                      </span>
                    </div>

                    {properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex-grow min-w-[280px]  bg-white"
                      ></div>
                    ))}
                  </div>

                  {groupData.attributes.map((attr, i) => (
                    <div
                      key={attr.key}
                      className={`flex  transition duration-150`}
                    >
                      <div
                        className={`sticky left-0 w-64 flex-shrink-0 p-3 border-r border-gray-200 flex items-center z-10 
                           bg-white`}
                      >
                        <span className="text-sm">{attr.label}</span>
                      </div>

                      {properties.map((property) => (
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
                            {property[attr.key] ? property[attr.key] : "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyComparisonGrid;
