"use client";
import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Models from "@/imports/models.import";
import { Dropdown, Failure, Success, useSetState } from "@/utils/function.utils";
import * as Yup from "yup";

const links = [
  { url: "about", text: "About Us" },
  { url: "property-list", text: "Our Properties" },
  { url: "compare", text: "Compare" },
];

const popularSearch = [
  { label: "Apartment for Sale", params: { type: "sale", search: "Apartment" } },
  { label: "Apartment for Lease", params: { type: "lease", search: "Apartment" } },
  { label: "Villas for Sale", params: { type: "sale", search: "Villa" } },
  { label: "Villas for Lease", params: { type: "lease", search: "Villa" } },
];

export default function NewFooter() {
  const router = useRouter();
  const [state, setState] = useSetState({
    loading: false,
    email: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setState({ id: userId });
  }, []);

  useEffect(() => {
    cityList(1);
  }, []);

  const handleSubscribe = async () => {
    try {
      const body = {
        user: state.id,
        email: state.email,
      };

      const schema = Yup.object({
        email: Yup.string().trim().email("Please enter a valid email").required("Email is required"),
      });

      await schema.validate({ email: state.email });

      const res: any = await Models.user.newsletter(body);
      Success(res?.message || "Subscribed to newsletter successfully");
    } catch (error) {
      if (error.name === "ValidationError") {
        return Failure(error.message);
      }
      Failure(error?.detail || "Something went wrong");
      setState({ loading: false });
    }
  };

  const cityList = async (page) => {
    try {
      const body: any = {};
      if (state.search) body.search = state.search;
      const res: any = await Models.dropdowns.city(page, body);
      const locationdd = res?.results?.filter((item) => item?.property_count != 0);
      const droprdown = Dropdown(locationdd, "name");

      setState({
        locationList: droprdown,
        cityList: res?.results,
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

  const handlePropertyListNavigate = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params).toString();
    router.push(`/property-list?${searchParams}`);
  };

  return (
    <footer className="section-pad  text-white" 
    style={{background:`url(/assets/images/real-estate/home/Footer-4.png)`, backgroundPosition:"top", backgroundSize:"cover", backgroundRepeat:"no-repeat", width:"100%", height:"100%"}}
    >
      <div className="section-wid">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/images/real-estate/home/boom-logo-wt.png"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Follow Us</span>
            <Link href="#"><Facebook className="h-4 w-4" /></Link>
            <Link href="#"><Twitter className="h-4 w-4" /></Link>
            <Link href="#"><Instagram className="h-4 w-4" /></Link>
            <Link href="#"><Linkedin className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="grid gap-10  py-10 md:grid-cols-5">
          <div>
            <h3 className="mb-4 section-in-ti !text-white">Popular Search</h3>
            <ul className="space-y-3 text-white/80">
              {popularSearch.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handlePropertyListNavigate(item.params)}
                    className="text-left hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 section-in-ti !text-white">Quick Links</h3>
            <ul className="space-y-3 text-white/80">
              {links?.map((item, i) => (
                <li key={i}>
                  {item.url === "property-list" ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/${item.url}`)}
                      className="text-left hover:text-white"
                    >
                      {item.text}
                    </button>
                  ) : (
                    <Link href={`/${item.url}`} className="hover:text-white">
                      {item.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 section-in-ti !text-white">Discovery</h3>
            <ul className="space-y-3 text-white/80">
              {state.locationList?.slice(0, 5).map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handlePropertyListNavigate({ location: item.value })}
                    className="text-left hover:text-white"
                  >
                    {item?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div>
              <p className="text-white/70">Live Support?</p>
              <Link href="mailto:support@realestate.com" className="mt-2">support@realestate.com</Link>
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

        <div className="h-[1px] bg-white/15 xl:w-[50%] mx-auto" />

        <div className="flex flex-col gap-6  py-8 md:flex-row md:items-center md:justify-center">
          <h3 className="section-ti !text-white !font-normal mb-0 pb-0">Get Mobile App</h3>
          <div className="flex gap-4">
            <button className="rounded-xl  w-[150px] h-15 text-black">
              <img src="/assets/images/real-estate/home/app-store.png" alt="" className="rounded-xl object-cover w-[100%] h-[100%]" />
            </button>
            <button className="rounded-xl  w-[150px] h-15 text-black">
                            <img src="/assets/images/real-estate/home/play-store.png" alt="" className="rounded-xl object-cover w-[100%] h-[100%]" />

            </button>
          </div>
        </div>

       <div className="h-[1px] bg-white/15 xl:w-[50%] mx-auto" />


        <div className="flex flex-col gap-4 pt-6 text-sm text-white md:flex-row md:items-center md:justify-between">
          <p>
            Copyright 2026 © Realestate. Concept by{" "}
            <Link href="https://irepute.in/" target="_blank">
              repute
            </Link>
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
