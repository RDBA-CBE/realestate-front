"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, PhoneForwarded } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Models from "@/imports/models.import";
import { useSetState } from "@/utils/function.utils";
import Gallery from "./Gallery.component";
import PropertyHeader from "./PropertyHeader.component";
import PropertyDetails from "./PropertyDetails.component";
import PropertyDesc from "./PropertyDesc.component";
import FloorPlans from "./FloorPlans.component";
import Amenities from "./Amenities.component";
import MapSection from "./MapSection.component";
import MobileMapSection from "./MobileMapSection.component";
import SimilarListings from "./SimilarListings.component1";
import ContactAgentForm from "./ContactAgentForm.component";

interface PropertyDetailInlineProps {
  id: string;
  handleClick?: () => void;
  updateList?: () => void;
  clickSimilarProperty?: (property: any) => void;
}

/**
 * The map-view detail panel intentionally uses the same mobile-first blocks as
 * the property detail page. This keeps both views' content and behaviour in sync.
 */
export default function PropertyDetailInline({
  id,
  handleClick,
  updateList,
  clickSimilarProperty,
}: PropertyDetailInlineProps) {
  const router = useRouter();
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [state, setState] = useSetState({
    detail: {} as any,
    similarProperty: [] as any[],
    token: null as string | null,
    loading: true,
  });

  useEffect(() => {
    document.body.style.overflow = isMobileFormOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFormOpen]);

  useEffect(() => {
    void getDetails();
  }, [id]);

  const getDetails = async () => {
    try {
      setState({ loading: true });
      const token = localStorage.getItem("demo_token");
      const detail: any = await Models.property.details(id);
      setState({ detail, token, loading: false });

      if (detail?.property_type?.id) {
        const result: any = await Models.property.list(1, {
          property_type: detail.property_type.id,
          is_approved: "Yes",
        });
        setState({
          similarProperty:
            result?.results?.filter((property: any) => Number(property.id) !== Number(id)) || [],
        });
      }
    } catch (error) {
      console.error("Unable to load property details", error);
      setState({ loading: false });
    }
  };

  const refreshDetails = async () => {
    await getDetails();
    updateList?.();
  };

  const redirectToDeveloper = () => {
    router.push(`/property-list?developerId=${state.detail?.developer?.id}`);
  };

  const detailSections = [
    { id: "overview", content: <PropertyDetails data={state.detail} mobileLayout /> },
    { id: "description", content: <PropertyDesc data={state.detail} /> },
    ...(state.detail?.floor_plans?.length
      ? [{ id: "floorplans", content: <FloorPlans data={state.detail.floor_plans} /> }]
      : []),
    ...(state.detail?.amenities?.length
      ? [{ id: "amenities", content: <Amenities data={state.detail.amenities} mobileLayout /> }]
      : []),
    { id: "map", content: <MapSection data={state.detail} /> },
  ];

  if (state.loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-6 w-6 ml-auto rounded-full bg-gray-200" />
        <div className="h-[250px] rounded-2xl bg-gray-200" />
        <div className="h-7 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-40 rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-[calc(100%-4.5rem)] z-20 h-0 flex justify-end pointer-events-none">
        <Button
          className="pointer-events-auto bg-color2 hover:bg-color2 text-white px-4 py-4 rounded-l-full rounded-r-none font-normal shadow-lg text-sm"
          onClick={() => setIsMobileFormOpen(true)}
        >
          <PhoneForwarded className="h-4 w-4" />
          Contact Developer
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="px-4 pb-24"
      >
        <div className=" justify-end mb-3 hidden lg:flex">
          <button
            type="button"
            onClick={handleClick}
            className="p-2 border rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Close property detail"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* This is the same mobile order used on property-detail/[slug]. */}
        <div className="space-y-5">
          <Gallery
            images={state.detail?.images || []}
            data={state.detail}
            updateList={refreshDetails}
            mobileLayout
          />
          <PropertyHeader data={state.detail} updateList={refreshDetails} mobileLayout />
          <MobileMapSection data={state.detail} />

          <div className="space-y-4">
            {detailSections.map((section, index) => (
              <section
                key={section.id}
                id={`inline-${section.id}`}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border border-gray rounded-2xl p-4 sm:p-6`}
              >
                {section.content}
              </section>
            ))}
          </div>

          {state.similarProperty.length > 0 && (
            <section className="pt-2">
              <SimilarListings
                data={state.similarProperty}
                mobileLayout
                onPropertyClick={(property: any) => {
                  clickSimilarProperty?.(property);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </section>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isMobileFormOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFormOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ContactAgentForm
                data={state.detail}
                token={state.token}
                onClose={() => setIsMobileFormOpen(false)}
                industryClick={redirectToDeveloper}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
