"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Gallery from "@/components/real-estate/property-detail/Gallery.component";
import PropertyDetails from "@/components/real-estate/property-detail/PropertyDetails.component";
import PropertyHeader from "@/components/real-estate/property-detail/PropertyHeader.component";
import MapSection from "@/components/real-estate/property-detail/MapSection.component";
import FloorPlans from "@/components/real-estate/property-detail/FloorPlans.component";
import Amenities from "@/components/real-estate/property-detail/Amenities.component";
import Reviews from "@/components/real-estate/property-detail/Reviews.component";
import SimilarListings from "@/components/real-estate/property-detail/SimilarListings.component";
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
            <ContactAgentForm onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Contact form for logged-in users */}
      {isLoggedIn && <ContactAgentForm onSuccess={handleFormSuccess} />}
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
  });

  const images = [
    "/assets/images/real-estate/01.png",
    "/assets/images/real-estate/02.png",
    "/assets/images/real-estate/03.png",
    "/assets/images/real-estate/04.png",
    "/assets/images/real-estate/05.png",
    "/assets/images/real-estate/6.png",
    "/assets/images/real-estate/7.png",
  ];

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
      const res: any = await Models.property.details(params?.id);
      console.log("✌️res --->", res);
      setState({ detail: res });
      similarProperty(res?.property_type?.id);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const similarProperty = async (id) => {
    try {
      const body = {
        property_type: id,
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

  return (
    <div className=" mx-auto px-9 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Header + Gallery */}
      <div className="space-y-6">
        <PropertyHeader data={state.detail} />
        <Gallery images={state.detail?.images} />
      </div>

      <PropertyTabs />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 space-y-3">
          <div id="overview">
            <PropertyDetails data={state.detail} />
          </div>
          <div id="desc">
            <PropertyDesc data={state.detail} />
          </div>
          <div id="map">
            <MapSection data={state.detail} />
          </div>
          <div id="amenities">
            <Amenities data={state.detail?.amenities} />
          </div>
          <div id="floorplans">
            <FloorPlans />
          </div>
          {state.detail?.videos?.length > 0 && (
            <div id="video">
              <Video data={state.detail?.videos?.[0]} />
            </div>
          )}
          {state.detail?.virtual_tours?.length > 0 && (
            <div id="virtualtour">
              <VirtualTour />
            </div>
          )}

          <div id="nearby">
            <Nearby />
          </div>
          <div id="walkscore">
            <WalkScore />
          </div>
          <div id="reviews">
            <Reviews />
          </div>
        </div>

        {/* Sticky Contact Section */}
        {/* <div className='lg:col-span-1'>
          <div className='sticky top-32'>
            <ContactSection />
          </div>
        </div> */}
        <div className="lg:col-span-1">
          <div
            className={`sticky ${state.isActive ? "top-[8rem]" : "top-[6rem]"}`}
          >
            <ContactAgentForm />
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <div className="mt-16">
        <SimilarListings data={state.similarProperty} />
      </div>
    </div>
  );
}
