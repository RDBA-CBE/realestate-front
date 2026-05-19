"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import Models from "@/imports/models.import";

import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  Building2,
} from "lucide-react";

import { PropertyCard } from "@/components/real-estate/property-list/property3And4Column/property-card";

import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";

export default function DeveloperDetailPage() {
  const params = useParams();
  const router = useRouter();

  const developerId = params?.id;

  const [developer, setDeveloper] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!developerId) return;

    fetchDeveloper();
    fetchProperties();

    setToken(localStorage.getItem("token"));
  }, [developerId]);

  const redirect = () => {
    router.push(`/property-list?developerId=${developerId}`);
  };

  const fetchDeveloper = async () => {
    try {
      setLoading(true);

      const res: any = await Models.user.details(developerId);

      setDeveloper(res);
      setError(null);
    } catch (err) {
      console.log("Developer fetch failed", err);
      setError("Unable to load developer details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const body: any = {
        developer: developerId,
        is_approved: "Yes",
        publish: "Yes",
        page_size: 20,
      };

      const res: any = await Models.property.list(1, body);

      setProperties(res?.results || []);
    } catch (err) {
      console.log("Developer properties fetch failed", err);
    }
  };

  const developerName =
    developer?.industry ||
    developer?.company_name ||
    `${developer?.first_name ?? ""} ${developer?.last_name ?? ""}`.trim();

  const developerImage =
    developer?.developer_image || developer?.profile_image;

  return (
    <div className="min-h-screen bg-[#fff]">
      {/* HEADER */}
      <div className="border-b border-[#ebe7e1] bg-[#f8f8f8]">
        <div className="section-wid py-10">
          {/* BREADCRUMB */}
          <div className="flex lg:justify-between">
             <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span
              className="cursor-pointer hover:text-black"
              onClick={() => router.push("/")}
            >
              Home
            </span>

            <span>/</span>

            <span
              className="cursor-pointer hover:text-black"
              onClick={() => router.push("/developers")}
            >
              Developers
            </span>

            <span>/</span>

            <span className="text-black">
              {developerName || "Developer"}
            </span>
          </div>

          {/* BACK BUTTON */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-8 rounded-full border-dred bg-white px-5 text-dred shadow-none hover:bg-dred hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          </div>
         

          {/* HEADER CONTENT */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* IMAGE */}
            <div className="relative h-[80px] w-[80px] overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white shadow-sm">
              {developerImage ? (
                <Image
                  src={developerImage}
                  alt={developerName || "Developer"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* TEXT */}
            <div>
              <p className="text-sm text-gray-500">
                Property For Sale by
              </p>

              <h1 className="mt-2 section-ti ">
                {developerName || "Developer"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* TAB */}
      {/* <div className="border-b border-[#ebe7e1] bg-white">
        <div className="section-wid">
          <div className="flex items-center gap-10 overflow-auto">
            <button className="border-b-[3px] border-[#f97316] py-5 text-lg font-medium text-black">
              Overview
            </button>
          </div>
        </div>
      </div> */}

      {/* CONTENT */}
      <div className="section-wid py-5">
        {/* ABOUT */}
        <div className="max-w-7xl">
          <h2 className="section-in-ti">
            About {developerName}
          </h2>

          <p className="mt-3 ">
            {developer?.company_name || developerName}
          </p>

          {/* DESCRIPTION */}
          <div className="mt-5">
            <h3 className="section-in-ti">
              Description
            </h3>

            <p className="mt-4 ">
              {developer?.description ||
                `${developerName} is a leading real estate and property development company delivering premium residential and commercial projects with modern architecture and quality lifestyle amenities.`}
            </p>
          </div>

          
        </div>

        <div>
            {/* FILTERS */}
          <div className="mt-10 border-t border-[#ebe7e1] pt-8 ">
            <h3 className="section-in-ti ">
              Explore {developerName} Projects
            </h3>

            {/* <div className="mt-6 flex flex-wrap gap-4">
              <button className="rounded-full border border-[#f97316] bg-[#fff7ed] px-8 py-3 text-base font-medium text-[#f97316]">
                Ongoing
              </button>

              <button className="rounded-full border border-[#e5e7eb] bg-white px-8 py-3 text-base font-medium text-gray-700 transition hover:border-[#f97316] hover:text-[#f97316]">
                Upcoming
              </button>

              <button
                onClick={() =>
                  router.push(`/property-list?developerId=${developerId}`)
                }
                className="rounded-full border border-[#e5e7eb] bg-white px-8 py-3 text-base font-medium text-gray-700 transition hover:border-[#f97316] hover:text-[#f97316]"
              >
                View All Projects
              </button>
            </div> */}

            <p className="">
              Showing 1-{properties.length} of {properties.length}
            </p>
          </div>

          {/* PROPERTY SECTION */}
          <div className="mt-6 pb-10">
            {loading ? (
              <p className="py-10 text-center text-gray-500">
                Loading properties...
              </p>
            ) : error ? (
              <p className="py-10 text-center text-red-500">
                {error}
              </p>
            ) : properties.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No properties found for this developer.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {properties.map((property: any, index: number) => (
                  <div key={index}>
                    <PropertyCard
                      property={property}
                      view="grid"
                      list={properties}
                      updateList={setProperties}
                      onContactClick={(prop) => {
                        setSelectedProperty(prop);
                        setIsContactModalOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTACT MODAL */}
      <AnimatePresence>
        {isContactModalOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
            />

            {/* MODAL */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ContactAgentForm
                data={selectedProperty}
                token={token}
                onClose={() => setIsContactModalOpen(false)}
                industryClick={() => redirect()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}