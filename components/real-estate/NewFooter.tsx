"use client";
import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Home } from "lucide-react";
import Link from "next/link";
import Models from "@/imports/models.import";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import * as Yup from "yup";

const popular = [
  "Apartment for Sale",
  "Apartment for Rent",
  "Offices for Sale",
  "Offices for Rent",
];
const links = [
  "About Us",
  "Our Properties",
  "Location",
  "Compare",
  "Contact Us",
];
const discovery = ["Coimbatore", "Chennai", "Trichy", "Madurai", "Pondy"];

export default function NewFooter() {
  const [email, setEmail] = useState("");

  const [state, setState] = useSetState({
    loading: false,
    email: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setState({ id: userId });
  }, []);

  const handleSubscribe = async () => {
    try {
      const body = {
        user: state.id,
        email: state.email,
      };

      const schema = Yup.object({
        email: Yup.string()
          .trim()
          .email("Please enter a valid email")
          .required("Email is required"),
      });

      await schema.validate({
        email: state.email,
      });

      const res: any = await Models.user.newsletter(body);

      console.log("res", res);

      Success(res || "Subscribed to newsletter successfully");
    } catch (error) {
      console.log("error", error);

      // validation error
      if (error.name === "ValidationError") {
        return Failure(error.message);
      }

      // api error
      Failure(error?.detail || "Something went wrong");

      setState({ loading: false });
    }
  };

  return (
    <footer className="section-pad bg-dred text-white">
      <div className="section-wid">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.1em]">REAL</p>
              <p className="text-sm font-bold tracking-[0.1em]">ESTATE</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Follow Us</span>
            <Facebook className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
            <Instagram className="h-4 w-4" />
            <Linkedin className="h-4 w-4" />
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/15 py-10 md:grid-cols-5">
          <div>
            <h3 className="mb-4 section-in-ti !text-white">Popular Search</h3>
            <ul className="space-y-3 text-white/80">
              {popular.map((i) => (
                <li key={i}>
                  <a href="/property-list">{i}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 section-in-ti !text-white">Quick Links</h3>
            <ul className="space-y-3 text-white/80">
              {links.map((i) => (
                <li key={i}>
                  <a href="/property-list">{i}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 section-in-ti !text-white">Discovery</h3>
            <ul className="space-y-3 text-white/80">
              {discovery.map((i) => (
                <li key={i}>
                  <a href="/property-list">{i}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div>
              <p className="text-white/70">Live Support?</p>
              <p className="mt-2">support@realestate.com</p>
            </div>
            <div>
              <h3 className="mb-4 text-white/70">Keep Yourself Up to Date</h3>
              <div className="flex overflow-hidden rounded-full bg-white p-1">
                <input
                  type="email"
                  placeholder="Your email"
                  value={state.email}
                  onChange={(e) => setState({ email: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  style={{ color: "#000", backgroundColor: "transparent" }}
                  className="w-full px-4 outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={handleSubscribe}
                  className="rounded-full bg-dred px-5 py-2 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-b border-white/15 py-8 md:flex-row md:items-center md:justify-center">
          <h3 className="section-ti !text-white !font-medium">
            Get Mobile App
          </h3>
          <div className="flex gap-4">
            <button className="rounded-lg bg-white px-5 py-3 text-black">
              App Store
            </button>
            <button className="rounded-lg bg-white px-5 py-3 text-black">
              Google Play
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white md:flex-row md:items-center md:justify-between">
          <p>
            Copyright 2026 © Realestate. Concept by{" "}
            <Link href="https://irepute.in/" target="_blank">
              repute
            </Link>
          </p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
