"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Gallery from "@/components/real-estate/property-detail/Gallery.component";
import PropertyDetails from "@/components/real-estate/property-detail/PropertyDetails.component";
import PropertyHeader from "@/components/real-estate/property-detail/PropertyHeader.component";
import MapSection from "@/components/real-estate/property-detail/MapSection.component";
import MobileMapSection from "@/components/real-estate/property-detail/MobileMapSection.component";
import FloorPlans from "@/components/real-estate/property-detail/FloorPlans.component";
import Amenities from "@/components/real-estate/property-detail/Amenities.component";
import Reviews from "@/components/real-estate/property-detail/Reviews.component";
import SimilarListings from "@/components/real-estate/property-detail/SimilarListings.component";
import SimilarListings1 from "@/components/real-estate/property-detail/SimilarListings.component1";
import PropertyDesc from "@/components/real-estate/property-detail/PropertyDesc.component";
import Nearby from "@/components/real-estate/property-detail/Nearby.component";
import WalkScore from "@/components/real-estate/property-detail/Walkscore.component";
import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";
import PropertyTabs from "@/components/real-estate/PropertyTabs.component";
import Video from "@/components/real-estate/property-detail/Video.component";
import VirtualTour from "@/components/real-estate/property-detail/VirtualTour.component";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { useParams } from "next/navigation";
import { PhoneForwarded, X } from "lucide-react";

// ---------------- AUTH HOOK ----------------
function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return { isLoggedIn, login, logout, isLoading };
}

// ---------------- LOGIN FORM ----------------
function LoginForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}

// ---------------- CONTACT SECTION ----------------
function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isLoggedIn, login, isLoading } = useAuth();

  const handleContactClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      setIsModalOpen(true);
    } else {
      setShowLogin(false);
      setIsModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    login();
    setShowLogin(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowLogin(false);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
  };
  //   /Users/apple/Documents/Repute/REAL_ESTATE/REAL_ESTATE_STOREFRONT/app/(real-estate)/property-detail/[id].tsx

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button disabled className="w-full bg-gray-400 text-white" size="lg">
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enquiry button for non-logged-in users */}
      {!isLoggedIn && (
        <Button
          onClick={handleContactClick}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          size="lg"
        >
          Enquiry
        </Button>
      )}

      {/* Modal for login/contact */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{showLogin ? "Enquiry" : "Contact Agent"}</DialogTitle>
            <DialogDescription>
              {showLogin
                ? "Please login to contact the property agent"
                : "Fill out the form below and we'll get back to you soon"}
            </DialogDescription>
          </DialogHeader>

          {showLogin ? (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onClose={handleCloseModal}
            />
          ) : (
            <></>
            // <ContactAgentForm  />
          )}
        </DialogContent>
      </Dialog>

      {/* Contact form for logged-in users */}
      {/* {isLoggedIn && <ContactAgentForm  />} */}
    </div>
  );
}

// ---------------- PAGE ----------------
export default function PropertyDetailPage() {
  const params = useParams();
  const [state, setState] = useSetState({
    isActive: false,
    detail: {},
    similarProperty: [],
    token: null,
  });

  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

  useEffect(() => {
    if (isMobileFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileFormOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const overviewEl = document.getElementById("overview");
      const reviewsEl = document.getElementById("nearby");

      if (overviewEl && reviewsEl) {
        const overviewRect = overviewEl.getBoundingClientRect();
        const reviewsRect = reviewsEl.getBoundingClientRect();

        const overviewInView = overviewRect.top <= 100;

        const reviewsFullyPassed = reviewsRect.bottom <= 0;
        setState({ isActive: overviewInView && !reviewsFullyPassed });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getDetails();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params]);

  const getDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res: any = await Models.property.details(params?.id);
      console.log("✌️res --->", res);
      setState({ detail: res, token });
      similarProperty(res?.property_type?.id);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const similarProperty = async (id) => {
    try {
      const body = {
        property_type: id,
        is_approved: "Yes",
      };
      const res: any = await Models.property.list(1, body);
      console.log("✌️res --->", res);
      // const filter = res?.results?.filter((item) => item?.id !== params?.id);
      const filter = res?.results?.filter(
        (item) => Number(item?.id) !== Number(params?.id)
      );
      console.log("✌️filter --->", filter);
      setState({ similarProperty: filter });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const sections = [
    { id: "overview", component: <PropertyDetails data={state.detail} /> },
    { id: "description", component: <PropertyDesc data={state.detail} /> },

    // 👇 Add className control for MapSection visibility
    {
      id: "map",
      component: <MapSection data={state.detail} />,
      className: "hidden xl:block", // only show on xl+
    },

    {
      id: "amenities",
      component: <Amenities data={state.detail?.amenities} />,
    },
    ...(state.detail?.floor_plans?.length > 0
      ? [
          {
            id: "floorplans",
            component: <FloorPlans data={state.detail?.floor_plans} />,
          },
        ]
      : []),
    ...(state.detail?.videos?.length > 0
      ? [{ id: "video", component: <Video data={state.detail?.videos?.[0]} /> }]
      : []),
    ...(state.detail?.virtual_tours?.length > 0
      ? [{ id: "virtualtour", component: <VirtualTour /> }]
      : []),
    { id: "nearby", component: <Nearby /> },
    { id: "walkscore", component: <WalkScore /> },
    { id: "reviews", component: <Reviews /> },
  ];

  const tabSections = sections
    .map((s) => ({ id: s.id, label: s.id }))
    .filter(Boolean);

  return (
    <div className=" xl:max-w-[80rem] max-w-[85rem] mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Header + Gallery */}
      <div className="conatiner flex flex-col md:flex-col space-y-6 md:space-y-6">
        <div className="order-2 md:order-1 ">
          <PropertyHeader data={state.detail} updateList={() => getDetails()} />
        </div>
        <div className="order-1 md:order-2">
          <Gallery
            images={state.detail?.images}
            data={state.detail}
            updateList={() => getDetails()}
          />
        </div>
      </div>
      <div className="block xl:hidden">
        <MobileMapSection data={state.detail} />
      </div>

      <PropertyTabs sections={tabSections} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {sections.map((sec, idx) => {
            // Define an array of background colors to cycle through
            const bgColors = ["bg-gray-50", "bg-white"];
            const bgClass = bgColors[idx % bgColors.length]; // cycle dynamically

            return (
              <div
                key={sec.id}
                id={sec.id}
                className={`${bgClass} border rounded-2xl shadow p-6 ${
                  sec.className || ""
                }`}
              >
                {sec.component}
              </div>
            );
          })}
        </div>

        {/* Sticky Contact Section */}
        {/* <div className='lg:col-span-1'>
          <div className='sticky top-32'>
            <ContactSection />
          </div>
        </div> */}
        <div className="lg:col-span-1 hidden lg:block ">
          <div
            className={`sticky ${state.isActive ? "top-[8rem]" : "top-[6rem]"}`}
          >
            <ContactAgentForm
              data={state.detail}
              token={state.token}
              onClose={false}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-8 right-0 w-auto flex justify-center z-20">
        <Button
          className="bg-red-500 hover:bg-red-600 text-white px-9 py-6 rounded-l-full rounded-r-none  shadow-lg text-lg"
          onClick={() => setIsMobileFormOpen(true)}
        >
          <PhoneForwarded />
          Contact Developer
        </Button>
      </div>

      {/* Similar Listings */}
      {state.similarProperty.length > 0 && (
        <div className="mt-16">
          <SimilarListings1 data={state.similarProperty} />
        </div>
      )}

      <AnimatePresence>
        {isMobileFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFormOpen(false)}
            />

            {/* Modal Wrapper */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4 "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* CONTACT FORM GOES HERE */}
              <ContactAgentForm
                data={state.detail}
                token={state.token}
                onClose={() => setIsMobileFormOpen(false)}
              />
              {/* </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
