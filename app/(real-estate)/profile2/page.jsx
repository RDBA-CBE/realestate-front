"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Trash2,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TextInput } from "@/components/common-components/textInput";
import Models from "@/imports/models.import";
import { profileSchema } from "@/utils/validation.utils";

// Validation Schemas
// const profileSchema = Yup.object({
//   fullName: Yup.string()
//     .min(2, "Name must be at least 2 characters")
//     .max(50, "Name must be less than 50 characters")
//     .required("Full Name is required"),
//   email: Yup.string()
//     .email("Please enter a valid email address")
//     .required("Email is required"),
//   phone: Yup.string()
//     .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
//     .required("Phone number is required"),
//   city: Yup.string().required("City is required"),
//   country: Yup.string().required("Country is required"),
//   zip: Yup.string()
//     .matches(/^\d{5}(-\d{4})?$/, "Please enter a valid zip code")
//     .required("Zip code is required"),
//   about: Yup.string().max(500, "About me cannot exceed 500 characters"),
// });

const socialSchema = Yup.object({
  facebook: Yup.string().url("Please enter a valid URL"),
  twitter: Yup.string().url("Please enter a valid URL"),
  linkedin: Yup.string().url("Please enter a valid URL"),
  instagram: Yup.string().url("Please enter a valid URL"),
});

const passwordSchema = Yup.object({
  current: Yup.string().required("Current password is required"),
  new: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("New password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("new")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    profile: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      zip: "",
      about: "",
    },
    social: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
    passwords: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const [errors, setErrors] = useState({
    profile: {},
    social: {},
    passwords: {},
    photo: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(
    "/assets/images/real-estate/profile.png"
  );

  useEffect(() => {
    profileDetails();
  }, []);

  const profileDetails = async () => {
    try {
      const profile_id = localStorage.getItem("userId");
      const res = await Models.user.details(profile_id);
      console.log("✌️res --->", res);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[section]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: "",
        },
      }));
    }
  };

  // Validation functions
  const validateForm = async (schema, data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        return { isValid: false, errors: validationErrors };
      }
      return { isValid: false, errors: {} };
    }
  };

  // Form submission handlers
  const handleProfileUpdate = async () => {
    const { isValid, errors: validationErrors } = await validateForm(
      profileSchema,
      formData.profile
    );

    setErrors((prev) => ({ ...prev, profile: validationErrors }));

    if (!isValid) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success feedback
      document.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: { message: "Profile updated successfully!", type: "success" },
        })
      );
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialUpdate = async () => {
    const { isValid, errors: validationErrors } = await validateForm(
      socialSchema,
      formData.social
    );

    setErrors((prev) => ({ ...prev, social: validationErrors }));

    if (!isValid) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      document.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            message: "Social links updated successfully!",
            type: "success",
          },
        })
      );
    } catch (error) {
      console.error("Social update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const { isValid, errors: validationErrors } = await validateForm(
      passwordSchema,
      formData.passwords
    );

    setErrors((prev) => ({ ...prev, passwords: validationErrors }));

    if (!isValid) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      document.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            message: "Password changed successfully!",
            type: "success",
          },
        })
      );

      setFormData((prev) => ({
        ...prev,
        passwords: { current: "", new: "", confirm: "" },
      }));
    } catch (error) {
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // File handling
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Only JPEG, PNG, or WebP files are allowed.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "File size must be less than 5MB.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: "" }));
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setPreview("/assets/images/real-estate/profile.png");
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  const getInputIcon = (field) => {
    const icons = {
      fullName: <User className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      phone: <Phone className="h-4 w-4" />,
      city: <MapPin className="h-4 w-4" />,
      country: <Globe className="h-4 w-4" />,
      zip: <MapPin className="h-4 w-4" />,
    };
    return icons[field];
  };

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const profileFields = [
    { key: "fullName", label: "Full Name", type: "text" },
    { key: "email", label: "Email Address", type: "email" },
    { key: "phone", label: "Phone Number", type: "number" },
    { key: "city", label: "City", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "zip", label: "ZIP Code", type: "number" },
  ];

  const passwordFields = [
    { key: "current", label: "Current Password" },
    { key: "new", label: "New Password" },
    { key: "confirm", label: "Confirm New Password" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[93vh]  px-8 flex items-center justify-center  border "
    >
      <div className=" h-full container px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1 rounded-lg shadow-lg border-0 bg-gray-50 backdrop-blur-sm w-full">
            <CardContent className="py-6">
              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Personal Info", icon: User },
                  { id: "social", label: "Social Media", icon: Share2 },
                  { id: "security", label: "Security", icon: Lock },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-red-600 text-white rounded-lg"
                        : "text-gray-600 hover:bg-red-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 w-full">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-lg shadow-lg border-0 bg-gray-50  backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Profile Photo */}
                      <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                            <Image
                              src={preview}
                              alt="Profile"
                              width={128}
                              height={128}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            onClick={handleDeletePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                        </div>

                        <label className="mt-4 cursor-pointer">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                          <Button
                            variant="outline"
                            className="rounded-lg px-6 bg-red-600 text-white rounded-lg"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                        </label>
                        {errors.photo && (
                          <span className="text-red-500 text-sm mt-2">
                            {errors.photo}
                          </span>
                        )}
                      </div>

                      {/* Profile Form */}
                      <div className="flex-1 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                          Personal Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          {profileFields.map((field) => (
                            <div key={field.key} className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  {getInputIcon(field.key)}
                                </div>
                                <TextInput
                                  type={field.type}
                                  placeholder={field.label}
                                  value={formData.profile[field.key]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "profile",
                                      field.key,
                                      e.target.value
                                    )
                                  }
                                  className={`pl-10 rounded-xl border-2 transition-all ${
                                    errors.profile[field.key]
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-gray-200 focus:border-blue-500"
                                  }`}
                                />
                              </div>
                              {errors.profile[field.key] && (
                                <span className="text-red-500 text-sm block">
                                  {errors.profile[field.key]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            About Me{" "}
                            <span className="text-gray-400 text-xs">
                              ({formData.profile.about.length}/500)
                            </span>
                          </label>
                          <Textarea
                            value={formData.profile.about}
                            onChange={(e) =>
                              handleInputChange(
                                "profile",
                                "about",
                                e.target.value
                              )
                            }
                            rows={4}
                            className={`rounded-xl border-2 transition-all ${
                              errors.profile.about
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
                            }`}
                            placeholder="Tell us about yourself..."
                          />
                          {errors.profile.about && (
                            <span className="text-red-500 text-sm">
                              {errors.profile.about}
                            </span>
                          )}
                        </div>

                        <Button
                          onClick={handleProfileUpdate}
                          disabled={isLoading}
                          className="w-full md:w-auto px-8 bg-red-600 text-white rounded-lg"
                        >
                          {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Social Media Section */}
            {activeSection === "social" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-lg shadow-lg border-0 bg-gray-50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      Social Media Links
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {Object.entries(formData.social).map(
                        ([platform, url]) => (
                          <div key={platform} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              {platform.charAt(0).toUpperCase() +
                                platform.slice(1)}
                            </label>
                            <Input
                              value={url}
                              onChange={(e) =>
                                handleInputChange(
                                  "social",
                                  platform,
                                  e.target.value
                                )
                              }
                              placeholder={`https://${platform}.com/username`}
                              className={`rounded-xl border-2 transition-all ${
                                errors.social[platform]
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-500"
                              }`}
                            />
                            {errors.social[platform] && (
                              <span className="text-red-500 text-sm block">
                                {errors.social[platform]}
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    <Button
                      onClick={handleSocialUpdate}
                      disabled={isLoading}
                      className="mt-6 px-8 bg-red-600 text-white rounded-lg"
                    >
                      {isLoading ? "Updating..." : "Update Social Links"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-lg shadow-lg border-0 bg-gray-50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      Change Password
                    </h3>

                    <div className="space-y-6 max-w-md">
                      {passwordFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={formData.passwords[field.key]}
                              onChange={(e) =>
                                handleInputChange(
                                  "passwords",
                                  field.key,
                                  e.target.value
                                )
                              }
                              className={`pr-10 rounded-xl border-2 transition-all ${
                                errors.passwords[field.key]
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-500"
                              }`}
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                          {errors.passwords[field.key] && (
                            <span className="text-red-500 text-sm block">
                              {errors.passwords[field.key]}
                            </span>
                          )}
                          {field.key === "new" &&
                            !errors.passwords.new &&
                            formData.passwords.new && (
                              <div className="text-xs text-gray-500">
                                Password strength:{" "}
                                {isStrongPassword(formData.passwords.new)
                                  ? "Strong"
                                  : "Weak"}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={isLoading}
                      className="mt-6 px-8 bg-red-600 text-white rounded-lg"
                    >
                      {isLoading ? "Updating..." : "Change Password"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
