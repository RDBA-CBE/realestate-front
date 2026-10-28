"use client";
import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Models from "@/imports/models.import";
import {
  Dropdown,
  Failure,
  Success,
  useSetState,
} from "@/utils/function.utils";
import * as Yup from "yup";

const links = [
  { url: "about", text: "About Us" },
  { url: "property-list", text: "Our Properties" },
  { url: "compare", text: "Compare" },
];

const popularSearch = [
  {
    label: "Apartment for Sale",
    params: { type: "sale", propertyType: "apartment" },
  },
  {
    label: "Apartment for Lease",
    params: { type: "lease", propertyType: "apartment" },
  },
  { label: "Villas for Sale", params: { type: "sale", propertyType: "villa" } },
  {
    label: "Villas for Lease",
    params: { type: "lease", propertyType: "villa" },
  },
];

export default function NewFooter() {
  const router = useRouter();
  const [state, setState] = useSetState({
    loading: false,
    email: "",
  });

  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setState({ id: userId });
  }, []);

  useEffect(() => {
    cityList(1);
  }, []);

  const handleSubscribe = async () => {
    try {
      setSubscribeLoading(true);
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

      await schema.validate({ email: state.email });

      const res: any = await Models.user.newsletter(body);
      setSubscribeLoading(false);
      Success(res?.message || "Subscribed to newsletter successfully");

      setState({ email: "" });
    } catch (error) {
      console.log("error -->", error);
      if (error.name === "ValidationError") {
        return Failure(error.message);
      }
      Failure(error?.error || "Something went wrong");
      setState({ email: "" });
      setState({ loading: false });
      setSubscribeLoading(false);
    }
  };

  const cityList = async (page) => {
    try {
      const body: any = {};
      if (state.search) body.search = state.search;
      const res: any = await Models.dropdowns.city(page, body);
      const locationdd = res?.results?.filter(
        (item) => item?.property_count != 0,
      );

      setState({
        locationList: (locationdd || []).map((item: any) => ({
          label: item.name,
          value: String(item.id),
        })),
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
    <footer
      className="section-pad  text-white"
      style={{
        background: `url(/assets/images/real-estate/home/Footer.webp)`,
        backgroundPosition: "top",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="section-wid">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/images/real-estate/home/boom-logo-wt.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Follow Us</span>
            <Link href="https://www.facebook.com/boomrealtys/" target="_blank">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://x.com/boomrealtys" target="_blank">
              <span className="text-[17px]">𝕏</span>
            </Link>
            <Link href="https://www.instagram.com/boomrealtys/" target="_blank">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="https://www.linkedin.com/company/boomrealtys" target="_blank">
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link href="https://www.pinterest.com/boomrealtys/" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.18-.1-.95-.18-2.42.04-3.46.2-.94 1.3-5.52 1.3-5.52s-.33-.66-.33-1.64c0-1.54.89-2.69 2-2.69.94 0 1.4.7 1.4 1.54 0 .94-.6 2.35-.9 3.65-.25 1.1.55 2 1.64 2 1.97 0 3.48-2.08 3.48-5.09 0-2.66-1.91-4.52-4.64-4.52-3.16 0-5.02 2.37-5.02 4.82 0 .95.37 1.97.83 2.53.09.11.1.21.07.32l-.31 1.26c-.05.2-.16.24-.37.15-1.38-.64-2.24-2.66-2.24-4.28 0-3.48 2.53-6.68 7.3-6.68 3.83 0 6.8 2.73 6.8 6.38 0 3.81-2.4 6.87-5.72 6.87-1.12 0-2.17-.58-2.53-1.27l-.69 2.63c-.25.96-.93 2.16-1.38 2.9 1.04.32 2.15.49 3.3.49 6.63 0 12-5.37 12-12S18.63 0 12 0Z" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-2 xl:grid-cols-5">
          {/* Popular Search */}
          <div>
            <h3 className="mb-4 section-in-ti !text-white">Popular Search</h3>

            <ul className="space-y-3 text-white/80">
              {popularSearch.map((item) => (
                <li key={item.label}>
                  <Link
                    href={`/property-list?${new URLSearchParams(item.params).toString()}`}
                    className="text-left hover:text-white block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
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

          {/* Discovery */}
          <div>
            <h3 className="mb-4 section-in-ti !text-white">Discovery</h3>

            <ul className="space-y-3 text-white/80">
              {state.locationList?.slice(0, 5).map((item, i) => (
                <li key={i}>
                  <Link
                    href={`/property-list?location=${item.value}`}
                    className="text-left hover:text-white block"
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Subscribe */}
          <div className="space-y-6 col-span-2 md:col-span-1 xl:col-span-2">
            <div>
              <p className="text-white/70">Live Support?</p>

              <Link href="mailto:info@boomrealtys.com" className="mt-2 block">
                info@boomrealtys.com
              </Link>
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
                  style={{
                    color: "#000",
                    backgroundColor: "transparent",
                  }}
                  className="w-full px-4 outline-none placeholder:text-gray-400"
                />

                <button
                  onClick={handleSubscribe}
                  className="rounded-full bg-dred px-5 py-2 whitespace-nowrap"
                  disabled={subscribeLoading}
                >
                  {subscribeLoading ? "Submitting..." : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-white/15 xl:w-[50%] mx-auto" />

        <div className="flex flex-col gap-6  py-8 md:flex-row md:items-center md:justify-center">
          <h3 className="section-ti !text-white !font-normal mb-0 pb-0">
            Get Mobile App
          </h3>
          <div className="flex gap-4">
            {/* <div className="rounded-xl  w-[150px] h-15 text-black">
              <img src="/assets/images/real-estate/home/app-store.png" alt="" className="rounded-xl object-cover w-[100%] h-[100%]" />
            </div> */}
            <Link
              href={
                "https://play.google.com/store/apps/details?id=boomrealtys.com"
              }
              target="_blank"
              className="rounded-xl  w-[150px] h-15 text-black"
            >
              <img
                src="/assets/images/real-estate/home/play-store.png"
                alt=""
                className="rounded-xl object-cover w-[100%] h-[100%]"
              />
            </Link>
          </div>
        </div>

        <div className="h-[1px] bg-white/15 xl:w-[50%] mx-auto" />

        <div className="flex flex-col gap-4 pt-6 text-sm text-white md:flex-row md:items-center md:justify-between">
          <p>
            Copyright 2026 © Boomrealtys. Concept by{" "}
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
