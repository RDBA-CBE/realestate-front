"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Badge,
  Edit,
  EditIcon,
  FileEdit,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Pencil,
  Search,
  UserCircle2,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";
import { Dropdown, Failure, Success, useSetState, formatToINRS } from "@/utils/function.utils";

import { Input } from "@/components/ui/input";
import CustomPhoneInput from "@/components/common-components/phoneInput";

import { useRouter } from "next/navigation";
import Utils from "@/imports/utils.import";
import Models from "@/imports/models.import";
import * as Yup from "yup";
import TextArea from "@/components/common-components/textArea";
import CustomMultiSelect from "@/components/common-components/multi-select";
import user from "@/models/user.model";
import { get } from "http";
import { current } from "@reduxjs/toolkit";

export default function ProfilePage() {
  const router = useRouter();
  const [state, setState] = useSetState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    isEditProfile: false,
    isChangePassword: false,
    isPrefferedLocation:false,
    id: null,
    propertyTypeList: [], // New: for property types dropdown
    preferredPropertyTypes: [], // New: for user's preferred property types (IDs)
    isPreferredPropertyType: false, // New: for property type modal visibility
    preferredMinPrice: 0, // New: for price range preference
    preferredMaxPrice: 0, // New: for price range preference
    isPreferredPriceRange: false, // New: for price range modal visibility
    loading: false,
    error: null,
    locationList : [],
    showAuthAlert: false,
    authAlertMessage: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!id || !token) {
      setState({
        showAuthAlert: true,
        authAlertMessage: !token
          ? "You are not logged in. Please sign in to view your profile."
          : "User session not found. Please sign in again.",
      });
      return;
    }
    setState({ id });
  }, []);

  useEffect(() => {
    getUser();
    wishlist();
    cityList(1);
  }, []);

  console.log("state.id", state.id);

  const cityList = async (page, search = "") => {
        try {
          const body: any = {};
          if (search) body.search = search;
          const res: any = await Models.dropdowns.city(page, body);
          const droprdown = Dropdown(res?.results, "name");
    
          setState({
            locationList: droprdown,
            total: res?.count,
            page,
            next: res.next,
            previous: res.previous,
            totalRecords: res.count,
          });
        } catch (error) {
          console.log("error -->", error);
        }
      };

      console.log("locationList", state.locationList);
      

  const getUser = async () => {
    try {
      const id = localStorage.getItem("userId");
      if (!id) {
        setState({ showAuthAlert: true, authAlertMessage: "User session not found. Please sign in again." });
        return;
      }
      setState({ loading: true });
      const res: any = await Models.user.details(id);
      setState({
        loading: false,
        user: res,
        first_name: res?.first_name || "",
        last_name: res?.last_name || "",
        email: res?.email || "",
        phone: res?.phone || "",
        address: res?.address || "",
        preferredPropertyTypes: res?.preferred_property_types?.map((type) => String(type.id)) || [], // Assuming API returns this
        preferredMaxPrice: res?.preferred_max_price || 0,
        preferredMinPrice: res?.preferred_min_price || 0, // Assuming API returns this
        location: res?.preferred_locations?.map((loc) => String(loc.id)) || [],
      });
    } catch (error) {
      setState({
        loading: false,
        showAuthAlert: true,
        authAlertMessage: "Failed to load your profile. Please sign in again.",
      });
      console.log("✌️error --->", error);
    }
  };

  const wishlist = async () => {
    try {
      setState({ loading: true });
      const wishlist_id = localStorage.getItem("wishlist_id");
      const res: any = await Models.wishlist.list(wishlist_id);
      console.log("✌️res --->", res);
      setState({
        properties: res?.properties || [],
        loading: false,
      });
    } catch (error) {
      console.log("✌️error --->", error);
      setState({
        error: "Failed to load wishlist",
        loading: false,
      });
    }
  };

  const handleRemoveFromWishlist = async (propertyId: number) => {
    try {
      await Models.wishlist.remove_property({
        property_id: propertyId,
      });

      const updatedProperties = state.properties.filter(
        (property: any) => property.id !== propertyId
      );
      setState({ properties: updatedProperties });
      Success("Removed from your wishlist !");
    } catch (error) {
      console.log("✌️error removing from wishlist --->", error);
    }
  };

  const handleProfileSubmit = async (e) => {
    try {
      e.preventDefault();
      const body = {
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        phone: state.phone,

        address: state.address,
        
      };

      console.log("body", body);

      await Utils.Validation.profileSchema.validate(body, {
        abortEarly: false,
      });

      const res: any = await Models.user.update(body, state.id);

      console.log("res", res);

      Success("Profile Updated");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err?.message;
        });
        console.log("✌️validationErrors --->", validationErrors);

        setState({ errors: validationErrors, loading: false });
      } else {
        Failure(error?.error);
      }
      console.log("✌️error --->", error);
      setState({ loading: false });
    }
  };

  console.log("state.error", state.error);
  

  const handlePasswordSubmit = async (e) => {
    try {
      e.preventDefault();
      const body = {
       old_password: state.current_password,
        new_password: state.new_password,
        confirm_password : state.confirm_password
      };

      console.log("body", body);

      await Utils.Validation.changePassword.validate(body, {
        abortEarly: false,
      });

      const res: any = await Models.auth.change_password(body);

      console.log("res", res);

      Success("Password Changed");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err?.message;
        });
        console.log("✌️validationErrors --->", validationErrors);

        setState({ errors: validationErrors, loading: false });
      } else {
        Failure(error?.error);
      }
      console.log("✌️error --->", error);
      setState({ loading: false });
    }
  };

  const handlePrefferedLocationSubmit = async (e) => {

    console.log("state.location", state.location);
    
    try {
      e.preventDefault();
      const body = {
      
        preferred_locations : state.location,
      };

      console.log("body", body);


      const res: any = await Models.user.update(body, state.id);

      console.log("res", res);
      
      setState({ isPrefferedLocation: false });

      Success("Preffered Locations Updated");
      getUser()
     
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err?.message;
        });
        console.log("✌️validationErrors --->", validationErrors);

        setState({ errors: validationErrors, loading: false });
      } else {
        Failure(error?.error);
      }
      console.log("✌️error --->", error);
      setState({ loading: false });
    }
  };

const handleNewsletterSubmit = async (e) => {
  e.preventDefault();

  try {
    const updatedStatus = !state.user?.newsletter; // toggle true/false

    const body = {
      newsletter: updatedStatus,
    };

    const res: any = await Models.user.update(body, state.id);

    console.log("res", res);

    // update local state if needed
    setState({
    
        newsletter: updatedStatus,
      },
    );

    Success(
      updatedStatus
        ? "Subscribed to newsletter successfully"
        : "Unsubscribed from newsletter successfully"
    );
    getUser()
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const validationErrors = {};

      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });

      setState({ errors: validationErrors, loading: false });
    } else {
      Failure(error?.error);
    }

    setState({ loading: false });
  }
};

// New: Handle Preferred Property Type Submit
const handlePreferredPropertyTypeSubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      preferred_property_types: state.preferredPropertyTypes,
    };
    await Models.user.update(body, state.id);
    setState({ isPreferredPropertyType: false });
    Success("Preferred Property Types Updated");
    getUser();
  } catch (error) {
    Failure(error?.error || "Failed to update property types.");
  }
};

// New: Handle Preferred Price Range Submit
const handlePreferredPriceRangeSubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      preferred_min_price: state.preferredMinPrice,
      preferred_max_price: state.preferredMaxPrice,
    };
    await Models.user.update(body, state.id);
    setState({ isPreferredPriceRange: false });
    Success("Preferred Price Range Updated");
    getUser();
  } catch (error) {
    Failure(error?.error || "Failed to update price range.");
  }
};

// Helper to get property type names from IDs
const getPropertyTypeNames = (ids: string[]) => {
  return ids.map(id => {
    const type = state.propertyTypeList.find(item => item.value === id);
    return type ? type.label : '';
  }).filter(Boolean).join(', ');
};



  const handleAuthAlertOk = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await Models.auth.logout({ refresh });
      }
    } catch (error) {
      console.log("Logout failed, clearing session and redirecting home", error);
    } finally {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      [name]: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[93vh] px-4 md:px-8"
    >
      {/* Auth Alert Modal */}
      {state.showAuthAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#fff6f6] flex items-center justify-center">
              <UserCircle2 className="w-7 h-7 text-[#9b0f09]" />
            </div>
            <h3 className="text-lg font-bold text-black">Access Restricted</h3>
            <p className="text-sm text-gray-500">{state.authAlertMessage}</p>
            <Button
              className="w-full py-5 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07]"
              onClick={handleAuthAlertOk}
            >
              OK, Go to Home
            </Button>
          </div>
        </div>
      )}
      <div className="container mx-auto max-w-7xl mt-6">
        <div className="w-full bg-color1 border-gray shadow-none text-white rounded-xl flex flex-col md:flex-row items-start justify-between p-4 md:p-6 gap-4">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {state.user?.profile_image ? (
              <Image
                src={state.user.profile_image}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full object-cover w-16 h-16"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center bg-dred text-white text-xl font-bold"
                style={{
                  backgroundColor: '#9b0f09', // Ensure primary color for avatar background
                  color: 'white',
                  fontSize: '1.5rem', // Adjust font size as needed
                }}
              >
                {state.user?.first_name
                  ? state.user.first_name.charAt(0).toUpperCase()
                  : ''}
              </div>
            )}


            <div>
              <div className="flex flex-col">
                <h2 className="text-lg text-black font-semibold">
                  {state.user?.first_name} {state.user?.last_name}
                </h2>
                <div className="flex gap-2 px-0 mx-0">
                  <p className="text-gray-600">{state.user?.email} |</p>
                  <p className="text-gray-600">{state.user?.phone}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {state?.properties?.length} Wishlist · 1 Active Search · Last Login: Just Now
              </p>

                
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full border-dred bg-transparent text-dred hover:text-white hover:bg-[#9b0f09]"
              onClick={() => setState({ isEditProfile: true })}
            >
              <Pencil size={16} />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full border-dred bg-transparent text-dred hover:text-white hover:bg-[#9b0f09]"
              onClick={() => setState({ isChangePassword: true })}
            >
              <MessageCircle size={16} />
              Change Password
            </Button>
          </div>
        </div>

        <div className="w-full bg-color1 mt-5 text-white p-6 rounded-2xl grid md:grid-cols-2 gap-6 items-stretch border-gray shadow-none">
          {/* Left Column - My Dream Home */}
          <div className="space-y-5 flex flex-col h-full ">
            <h2 className="text-lg text-black font-semibold">My Preference</h2>

            <Card className="bg-white border-gray shadow-none text-white rounded-xl flex-1">
  <CardContent className="flex justify-between  py-4 h-full">
    <div className="flex items-start gap-3">
      <div className=" rounded-md">
        <MapPin size={20} className="text-dred" />
      </div>

      <div>
        <p className="text-sm text-gray-600">Location</p>

        {/* Added Title */}
        <h3 className="text-black font-medium mt-1">
          Preferred Location
        </h3>

        {/* Added Content */}
        <p className="text-sm text-gray-500 mt-1 mb-3">
          Add your preferred location so that you can view the
          properties in your preferred location.
        </p>

        <div className="text-black font-medium flex flex-wrap gap-2">
          {state.user?.preferred_locations?.length > 0 ? (
            state.user.preferred_locations.map((l) => (
              <span
                key={l.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-dred"
              >
                {l.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">
              No locations set
            </span>
          )}
        </div>
      </div>
    </div>

    <Button
      variant="outline"
      className="text-dred border-dred hover:bg-lred text-sm px-3 py-0 rounded-md hover:bg-dred hover:text-white"
      onClick={() => setState({ isPrefferedLocation: true })}
    >
      Edit
    </Button>
  </CardContent>
</Card>

            
            

            {/* <Card className="bg-white border-none text-white rounded-xl flex-1">
              <CardContent className="flex justify-between items-center p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-md">
                    <Home size={20} className="text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <h3 className="text-black font-medium">
                      Residential, Commercial
                    </h3>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="text-emerald-400 border-emerald-500 hover:bg-emerald-500/10 text-sm px-3 py-0 rounded-md"
                >
                  Edit
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray shadow-none text-white rounded-xl flex-1">
              <CardContent className="flex justify-between items-center p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="border border-[#9b0f09] p-2 rounded-md">
                    <Home size={20} className="text-dred" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Construction Status</p>
                    <h3 className="text-black font-medium flex flex-wrap gap-2 mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-dred">
                        {state.user?.preferred_status || "Ready to Move"}
                      </span>
                    </h3>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="text-dred border-dred hover:bg-lred text-sm px-3 py-0 rounded-md hover:bg-dred hover:text-white"
                >
                  Edit
                </Button>
              </CardContent>
            </Card>

            {/* <Card className="bg-white border-none text-white rounded-xl flex-1">
              <CardContent className="flex items-start gap-4 p-5 h-full">
                <div className="bg-emerald-500/10 p-3 rounded-md">
                  <Search size={22} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">
                    Create Search Alerts
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Stay informed on new listings
                  </p>
                </div>
              </CardContent>
            </Card> */}

            {state.user?.newsletter !== undefined && (
  <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white/80 p-3 text-sm text-gray-700">
    {state.user?.newsletter ? (
      <>
        <p className="font-medium text-black">You&apos;re subscribed!</p>
        <p>
          Enjoy regular property post updates, featured listings, and exclusive alerts.
        </p>

        <Button
          variant="outline"
          className="mt-4 text-red-400 border-red-500 hover:bg-red-500/10 text-sm px-3 py-0 rounded-md"
          onClick={handleNewsletterSubmit}
        >
          Unsubscribe
        </Button>
      </>
    ) : (
      <>
        <p className="font-medium text-black">Subscribe to our newsletter</p>
        <p>
          Get the latest property listings, updates, and special offers straight to your inbox.
        </p>

        <Button
          variant="outline"
          className="mt-4 text-emerald-400 border-emerald-500 hover:bg-emerald-500/10 text-sm px-3 py-0 rounded-md"
          onClick={handleNewsletterSubmit}
        >
          Subscribe
        </Button>
      </>
    )}
  </div>
)}
          </div>

          {/* Right Column - My Activity */}
          <div className="space-y-5 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-black">My Activity</h2>

            {state?.properties?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2  !gap-2 flex-1">
                {state?.properties?.slice(0, 2).map((property, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={property.primary_image}
                        alt={property.title || property.name || "Saved property"}
                        width={400}
                        height={250}
                        className="w-full h-38 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFromWishlist(property.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-dred transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current text-dred" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-black font-semibold text-base truncate">
                        {property.title || property.name || "Untitled Property"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {property.price ? formatToINRS(property.price) : "Price on request"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-4 items-center w-full rounded-md overflow-hidden bg-white h-48 ">
              <div className="flex justify-center items-center gap-8 w-full ">
                {" "}
                {[1, 2, 3].map((i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="none"
                    stroke="#00FFCC"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-16 h-16"
                  >
                    <path d="M64 240L256 64l192 176" />
                    <path d="M112 224v224h288V224" />
                    <path d="M192 448V320h128v128" />
                  </svg>
                ))}
              </div>
              <p className="font-xl text-black font-semibold">No Properties added to Wishlist</p>
              </div>
              
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-color2 hover:bg-red-700 text-white w-full"
                onClick={() => router.push("/property-list")}
              >
                Search Properties
              </Button>
              <Button
                className="bg-color2 hover:bg-red-700 text-white w-full"
                onClick={() => router.push(state?.properties?.length > 0 ? "/wishlist" : "/property-list")}
              >
               {state?.properties?.length > 0 ? "View All Favorites" : "Add Properties to Wishlist"}
              </Button>
            </div>

            {/* <Card className="bg-white border-none text-white rounded-xl flex-1">
              <CardContent className="flex items-start justify-between gap-4 p-5 h-full">
                <div className="flex gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-md">
                    <UserCircle2 size={22} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">
                      Connect with an Agent
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Find a local expert to guide your search
                    </p>
                  </div>
                </div>

                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-full px-4 py-1 h-auto">
                  Find one
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {state.isEditProfile && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ isEditProfile: false })}
            />

            {/* Modal Wrapper */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4 "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card
                className="rounded-2xl shadow-lg border border-gray-200 w-full max-w-xl mx-auto !bg-gray"
              >
                {state.isEditProfile && (
                  <div className="w-full text-right">
                    <button
                      onClick={() => setState({ isEditProfile: false })}
                      className="px-5 pt-4"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <CardContent
                  className={`p-6 space-y-6 ${
                    state.isEditProfile ? "pt-0" : ""
                  }`}
                >
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <p className="text-gray-600 text-sm text-center mb-4">
                      Please fill in your profile details
                    </p>

                    {/* Upload Profile Image - Full Width */}
                    <div className="flex flex-col items-center space-y-3 col-span-2">
                      {/* <label htmlFor="profileImage" className="cursor-pointer"> */}
                        <div className="relative w-24 h-24">
                          {/* {state.profileImage || state.user?.profile_image ? (
                            <Image
                              src={
                                state.profileImage || state.user?.profile_image
                              }
                              alt="Profile"
                              width={96}
                              height={96}
                              className="rounded-full object-cover border-2 border-gray-300 w-24 h-24"
                            />
                          ) : ( */}
                            <div
                              className="w-24 h-24 rounded-full flex items-center justify-center bg-dred text-white text-4xl font-bold border-2 border-gray-300"
                              style={{
                                backgroundColor: '#9b0f09', // Ensure primary color for avatar background
                                color: 'white',
                                fontSize: '2.5rem', // Adjust font size as needed
                              }}
                            >
                              {state.first_name ? state.first_name.charAt(0).toUpperCase() : ''}
                            </div>
                          {/* )} */}
                          {/* <div className="absolute bottom-0 right-0 bg-color2 text-white rounded-full p-1.5 text-xs">
                            <Pencil size={14} />
                          </div> */}
                        </div>
                      {/* </label> */}
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={(e) =>
                          setState({
                            profileImage: URL.createObjectURL(
                              e.target.files[0]
                            ),
                          })
                        }
                        className="hidden"
                      />
                    </div>

                    {/* Two-column grid for form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 !gap-3">
                      {/* Full Name */}
                      <Input
                        name="first_name"
                        title="First Name"
                        value={state.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.first_name}
                      />

                      <Input
                        name="last_name"
                        title="Last Name"
                        value={state.last_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.last_name}
                      />

                      {/* Email */}
                      <Input
                        name="email"
                        type="email"
                        title="Email Address"
                        value={state.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.email}
                      />

                      {/* Phone */}
                      <Input
                        value={state.phone}
                        onChange={handleInputChange}
                        title="Phone Number"
                        placeholder="Enter your Phone"
                        className="border-gray-300 rounded-lg py-2"
                        name="phone"
                        required
                        error={state.errors?.phone}
                      />

                      {/* City */}
                      {/* <Input
                        name="city"
                        title="City"
                        value={state.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.city}
                      /> */}

                      {/* Country */}
                      {/* <Input
                        name="country"
                        title="Country"
                        value={state.country}
                        onChange={handleInputChange}
                        placeholder="Enter your country"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.country}
                      /> */}

                      {/* ZIP */}
                      {/* <Input
                        name="zip"
                        title="ZIP Code"
                        value={state.zip}
                        onChange={handleInputChange}
                        placeholder="Enter ZIP code"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.zip}
                      /> */}
                    </div>

                    {/* About Me - Full Width */}
                    <div className="col-span-2">
                      <TextArea
                        title="Address"
                        name="address"
                        placeholder="Write a short description about yourself"
                        value={state.address}
                        onChange={(e) => setState({ address: e.target.value })}
                        className="border-gray-300 rounded-lg py-2"
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={state.btnLoading}
                      className="w-full bg-color2 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {state.btnLoading ? "Saving..." : "Submit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.isChangePassword && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ isChangePassword: false })}
            />

            {/* Modal Wrapper */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4 "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card
                className="rounded-2xl shadow-lg border border-gray-200 w-full max-w-xl mx-auto !bg-gray"
              >
                {state.isChangePassword && (
                  <div className="w-full text-right">
                    <button
                      onClick={() => setState({ isChangePassword: false })}
                      className="px-5 pt-4"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <CardContent
                  className={`p-6 space-y-6 ${
                    state.isChangePassword ? "pt-0" : ""
                  }`}
                >
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {/* Upload Profile Image - Full Width */}

                    {/* Two-column grid for form fields */}
                    <div className="grid grid-cols-1 gap-3">
                      {/* Full Name */}
                      <Input
                        name="current_password"
                        title="Current Password"
                        value={state.current_password}
                        onChange={handleInputChange}
                        placeholder="Enter your current password"
                        className="border-gray-300 rounded-lg py-2 mt-0"
                        required
                        error={state.errors?.old_password}
                      />

                      {/* Email */}
                      <Input
                        name="new_password"
                        title="New Password"
                        value={state.new_password}
                        onChange={handleInputChange}
                        placeholder="Enter your new password"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.new_password}
                      />

                      <Input
                        name="confirm_password"
                        title="Confirm Password"
                        value={state.confirm_password}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.confirm_password}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={state.btnLoading}
                      className="w-full bg-color2 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {state.btnLoading ? "Saving..." : "Submit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

       <AnimatePresence>
        {state.isPrefferedLocation && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ isPrefferedLocation: false })}
            />

            {/* Modal Wrapper */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4 "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card
                className="rounded-2xl shadow-lg border border-gray-200 w-full max-w-xl mx-auto !bg-gray"
              >
                {state.isPrefferedLocation && (
                  <div className="w-full text-right">
                    <button
                      onClick={() => setState({ isPrefferedLocation: false })}
                      className="px-5 pt-4"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <CardContent
                  className={`p-6 space-y-6 ${
                    state.isPrefferedLocation ? "pt-0" : ""
                  }`}
                >
                  <form onSubmit={handlePrefferedLocationSubmit} className="space-y-6">
                    {/* Upload Profile Image - Full Width */}

                    {/* Two-column grid for form fields */}
                    <div className="grid grid-cols-1 gap-3">
                      {/* Full Name */}
                      <CustomMultiSelect
                      className="border border-gray-200 bg-white " 
                                   options={state.locationList}
                                   value={state.location || []}
                                   onChange={(value) => setState({ location: value })}
                                   placeholder="Location "
                                    isMulti={true}
                                    loadOptions={({ search }) => cityList(1, search)}
                                 />

                     
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={state.btnLoading}
                      className="w-full bg-color2 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {state.btnLoading ? "Saving..." : "Submit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
