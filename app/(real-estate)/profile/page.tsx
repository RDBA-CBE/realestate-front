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
import { Failure, Success, useSetState } from "@/utils/function.utils";

import { Input } from "@/components/ui/input";
import CustomPhoneInput from "@/components/common-components/phoneInput";

import { useRouter } from "next/navigation";
import Utils from "@/imports/utils.import";
import Models from "@/imports/models.import";
import * as Yup from "yup";
import TextArea from "@/components/common-components/textArea";

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
    id: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setState({ id: id });
  }, []);

  useEffect(() => {
    getUser();
    wishlist();
  }, []);

  console.log("state.id", state.id);

  const getUser = async () => {
    try {
      const id = localStorage.getItem("userId");
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
      });

      console.log("user detail", res);
    } catch (error) {
      setState({
        loading: false,
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

  const handleSubmit = async (e) => {
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

        setState({ error: validationErrors, loading: false });
      } else {
        Failure(error?.error);
      }
      console.log("✌️error --->", error);
      setState({ loading: false });
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
      className="min-h-[93vh]  px-8"
    >
      <div className="container mt-6">
        <div className="w-full bg-gray-100  text-white rounded-xl flex flex-col md:flex-row items-center justify-between p-4 md:p-6 shadow-sm">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Image
              src="/assets/images/real-estate/dummy.png" // change to your image path
              alt="Profile"
              width={60}
              height={60}
              className="rounded-full  "
            />

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
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="w-full rounded-full border-red-500 bg-transparent hover:bg-red-600 text-red-500 hover:text-white hover:border-none"
              onClick={() => setState({ isEditProfile: true })}
            >
              <Pencil size={16} />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-full border-red-500 bg-transparent hover:bg-red-600 text-red-500 hover:text-white hover:border-none"
              onClick={() => setState({ isChangePassword: true })}
            >
              <MessageCircle size={16} />
              Change Password
            </Button>
          </div>
        </div>

        <div className="w-full bg-gray-100 mt-5 text-white p-6 rounded-2xl grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left Column - My Dream Home */}
          <div className="space-y-5 flex flex-col h-full">
            <h2 className="text-lg text-black font-semibold">My Preference</h2>

            <Card className="bg-white border-none text-white rounded-xl flex-1">
              <CardContent className="flex justify-between items-center p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-md">
                    <MapPin size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <h3 className="text-black font-medium">
                      Downtown Loft, West End Arts District
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

            <Card className="bg-white border-none text-white rounded-xl flex-1">
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

            <Card className="bg-white border-none text-white rounded-xl flex-1">
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
            </Card>
          </div>

          {/* Right Column - My Activity */}
          <div className="space-y-5 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-black">My Activity</h2>

            {state?.properties?.length > 0 ? (
              <div className="grid grid-cols-3 !gap-2 flex-1">
                {state?.properties?.slice(0, 3).map((property, index) => (
                  <div
                    key={index}
                    className="relative rounded-md overflow-hidden bg-gray-700 aspect-[4/3]"
                  >
                    <div className="relative">
                      <Image
                        src={property.primary_image}
                        alt={property.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFromWishlist(property.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current text-red-500" />
                      </button>
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

            <div className="flex gap-3">
              <Button
                className="bg-red-500 hover:bg-red-700 text-white w-full"
                onClick={() => router.push("/property-list")}
              >
                Search Properties
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-700 text-white w-full"
                onClick={() => router.push(state?.properties?.length > 0 ? "/wishlist" : "/property-list")}
              >
               {state?.properties?.length > 0 ? "View All Favorites" : "Add Properties to Wishlist"}
              </Button>
            </div>

            <Card className="bg-white border-none text-white rounded-xl flex-1">
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
            </Card>
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
                className={`rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto !bg-gray ${
                  state.isEditProfile ? "w-[500px]" : "me-0"
                }`}
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-gray-600 text-sm text-center mb-4">
                      Please fill in your profile details
                    </p>

                    {/* Upload Profile Image - Full Width */}
                    <div className="flex flex-col items-center space-y-3 col-span-2">
                      <label htmlFor="profileImage" className="cursor-pointer">
                        <div className="relative w-24 h-24">
                          <Image
                            src={
                              state.profileImage ||
                              "/assets/images/real-estate/dummy.png"
                            }
                            alt="Profile"
                            width={96}
                            height={96}
                            className="rounded-full object-cover border-2 border-gray-300 w-24 h-24"
                          />
                          <div className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1.5 text-xs">
                            <Pencil size={14} />
                          </div>
                        </div>
                      </label>
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
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                className={`rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto !bg-gray ${
                  state.isChangePassword ? "w-[500px]" : "me-0"
                }`}
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Upload Profile Image - Full Width */}

                    {/* Two-column grid for form fields */}
                    <div className=" grid grid-col !gap-3">
                      {/* Full Name */}
                      <Input
                        name="current_password"
                        title="Current Password"
                        value={state.current_password}
                        onChange={handleInputChange}
                        placeholder="Enter your current password"
                        className="border-gray-300 rounded-lg py-2 mt-0"
                        required
                        error={state.errors?.full_name}
                      />

                      {/* Email */}
                      <Input
                        name="new_password"
                        title="New Password"
                        value={state.current_password}
                        onChange={handleInputChange}
                        placeholder="Enter your new password"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.full_name}
                      />

                      <Input
                        name="confirm_password"
                        title="Confirm Password"
                        value={state.current_password}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        className="border-gray-300 rounded-lg py-2"
                        required
                        error={state.errors?.full_name}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={state.btnLoading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
