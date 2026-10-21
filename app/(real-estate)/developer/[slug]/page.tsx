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
  Timer,
  Briefcase,
  Layers,
  Building,
  MapPin,
  Check,
  Calendar,
  Home,
} from "lucide-react";

import { PropertyCard } from "@/components/real-estate/property-list/property3And4Column/property-card";

import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";

export default function DeveloperDetailPage() {
  const {slug}: any = useParams();

  const developerId = Number(
  slug.match(/-id-(\d+)(?:-|$)/)?.[1]
);
  const router = useRouter();

  // const developerId = params?.id;

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

    setToken(localStorage.getItem("demo_token"));
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

  const developerImage = developer?.developer_image || developer?.profile_image;

  const [expanded, setExpanded] = useState(false);

  const getMaxLength = () => {
    if (typeof window === "undefined") return 300;

    if (window.innerWidth < 640) return 80; // mobile
    if (window.innerWidth < 1024) return 100; // tablet
    return 140; // desktop
  };

  const [maxLength, setMaxLength] = useState(getMaxLength());

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(getMaxLength());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const description =
    developer?.description ||
    `${developerName} is a leading real estate and property development company delivering premium residential and commercial projects with modern architecture and quality lifestyle amenities.`;

  const isLong = description.length > maxLength;

  const shortText = isLong
    ? description.slice(0, maxLength) + "..."
    : description;

  return (
    <div className="min-h-screen bg-[#fcfcfc] section-pad">
      <div className="section-wid">
        {/* BREADCRUMB & BACK ACTION */}
        <div className="flex justify-between items-center pb-5">
          <div className=" flex flex-wrap items-center gap-2 text-sm text-gray-500">
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

            <span className="text-black">{developerName || "Developer"}</span>
          </div>

          {/* BACK BUTTON */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-0  rounded-2xl border-dred bg-white px-4 py-1 md:px-5 md:py-3.5 text-dred shadow-none hover:bg-dred hover:text-white h-6"
          >
            <ArrowLeft className=" h-4 w-4 hidden md:block" />
            Back
          </Button>
        </div>

        <div className="flex flex-col xl:flex-row gap-10 items-start">
          {/* LEFT CONTENT: PROJECT LIST */}
          <div className="flex-1 w-full order-1 xl:order-none">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="section-ti">Explore Projects</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Properties developed by {developerName}
                </p>
              </div>
              <p className="text-xs font-medium hidden md:block">
                Showing {properties.length} Listings
              </p>
            </div>

            <div className="pb-10">
              {loading ? (
                <p className="py-10 text-center text-gray-500">
                  Loading projects...
                </p>
              ) : error ? (
                <p className="py-10 text-center text-red-500">{error}</p>
              ) : properties.length === 0 ? (
                <div className="py-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-3xl">
                  No projects found for this developer.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

          {/* RIGHT SIDEBAR: DEVELOPER INFO (STICKY) */}
          <aside className="w-full xl:w-[380px] lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-[#ebe7e1] rounded-[2rem] p-3 shadow-sm">
              {/* <div className="flex flex-col items-center text-center">
               
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white shadow-sm mb-5">
                  {developerImage ? (
                    <Image
                      src={developerImage}
                      alt={developerName || "Developer"}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                
                <div className="mb-6">
                  
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{developerName || "Developer"}</h1>
                </div>
              </div> */}

              <div className="flex  gap-4 md:flex-row ">
                {/* IMAGE */}
                <div className="relative h-[60px] w-[80px] overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white shadow-sm">
                  {developerImage ? (
                    <Image
                      src={developerImage}
                      alt={developerName || "Developer"}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* TEXT */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Property For Sale by
                  </p>

                  <h1 className=" section-in-ti ">
                    {developerName || "Developer"}
                  </h1>
                </div>
              </div>

              {/* DESCRIPTION SECTION */}
              <div className="pt-6 mt-3 border-t border-[#ebe7e1]">
                <p className="text-sm leading-relaxed text-gray-600">
                  {expanded ? description : shortText}
                  {isLong && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="ml-1 text-xs font-semibold text-dred hover:underline"
                    >
                      {expanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>

              {/* STATS COMPACT GRID */}
              <div className="mt-6 grid grid-cols-2 gap-y-5 gap-x-6">
                {/* Projects */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-dred flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold leading-none text-gray-900 mb-1">
                      {developer?.total_project_count || 0}
                    </p>

                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold leading-none mt-1">
                      Projects
                    </p>
                  </div>
                </div>

                {/* Properties */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-dred flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold leading-none text-gray-900 mb-1">
                      {developer?.total_properties_count || 0}
                    </p>

                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold leading-none mt-1">
                      Properties
                    </p>
                  </div>
                </div>

                {/* Experience */}
                {developer?.years_in_business && <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-dred flex items-center justify-center shrink-0">
                    <Timer className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold leading-none text-gray-900 mb-1">
                      {developer?.years_in_business || 0}
                    </p>

                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold leading-none mt-1">
                      Years Experience
                    </p>
                  </div>
                </div>}

                {/* Started Year */}
                {developer?.years_in_business && <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-dred flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold leading-none text-gray-900 mb-1">
                      {developer?.industry_start_year || 0}
                    </p>

                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold leading-none mt-1">
                      Started Year
                    </p>
                  </div>
                </div>}
              </div>

             {developer?.specialization?.length > 0 && <div className="w-full mt-8 ">
                <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-2">
                  Specialization
                </p>

                <ul className="space-y-1">
                  {developer?.specialization?.length > 0 ? (
                    developer.specialization.map((s: any, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm font-medium text-gray-900"
                      >
                        <Check className="w-4 h-4 text-dred mt-[2px] shrink-0" />
                        <span>{s.specialization}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">N/A</li>
                  )}
                </ul>
              </div>}
            </div>

            {/* OPTIONAL SUPPORT CARD */}
            {/* <div className="bg-gray-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Expert Consultation</h4>
                <p className="text-white/60 text-xs leading-relaxed mb-4">Need help choosing the right project from {developerName}?</p>
                <button className="text-sm font-bold text-white underline underline-offset-4 hover:text-lred">Contact Sales Representative</button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Building2 size={120} />
              </div>
            </div> */}
          </aside>
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
