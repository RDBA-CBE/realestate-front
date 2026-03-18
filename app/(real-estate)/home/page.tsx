// "use client";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import React from "react";

// export default function Page() {
//   const router = useRouter();
//   return (
//     <Button
//       className=" bg-red-500 hover:bg-red-600"
//       onClick={() => router.push("/home-data")}
//     >
//       Create account
//     </Button>
//   );
// }
// "use client";
// import React from 'react';
// import Header from '@/components/common-components/Header1';
// import HeroSection from '@/components/common-components/HeroSection';
// import ApartmentTypes from '@/components/common-components/ApartmentTypes';
// import HowItWorks from '@/components/common-components/HowItWorks';
// import FeaturedListings from '@/components/common-components/FeaturedListings';
// import PropertiesByCities from '@/components/common-components/PropertiesByCities';
// import SellingOptions from '@/components/common-components/SellingOptions';
// import PopularProperties from '@/components/common-components/PopularProperties';
// import Testimonials from '@/components/common-components/Testimonials';
// import BlogSection from '@/components/common-components/BlogSection';
// import Footer from '@/components/common-components/Footer';

// export default function Page() {
//   // const router = useRouter();
//   return (
//     <div>
//       <Header />
//       <HeroSection />
//       <ApartmentTypes />
//       <HowItWorks />
//       <FeaturedListings />
//       <PropertiesByCities />
//       <SellingOptions />
//       <PopularProperties />
//       <Testimonials />
//       <BlogSection />
//       <Footer />
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
// import Header from '@/components/common-components/Header';
import BannerSection from "@/components/common-components/HeroSection";
import ApartmentTypes from "@/components/common-components/ApartmentTypes";
import HowItWorks from "@/components/common-components/HowItWorks";
import FeaturedListings from "@/components/common-components/FeaturedListings";
import PropertiesByCities from "@/components/common-components/PropertiesByCities";
import SellingOptions from "@/components/common-components/SellingOptions";
import PopularProperties from "@/components/common-components/PopularProperties";
import Testimonials from "@/components/common-components/Testimonials";
import BlogSection from "@/components/common-components/BlogSection";
import Footer from "@/components/common-components/Footer";
import { useEffect } from "react";
import { formatNumber, useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";

// ---------------- PAGE ----------------
export default function HomePage() {
  const [state, setState] = useSetState({
    propertyList: [],
  });

  useEffect(() => {
    propertyList("");
  }, []);

  const propertyList = async (type) => {
    try {
      setState({ loading: true });

      let body = {};
      if (type == "sale") {
        body = { listing_type: "sale" };
      }

      if (type == "lease") {
        body = { listing_type: "lease" };
      }

      if (type == "all") {
        body = {};
      }

      const res: any = await Models.property.list(1, body);
      console.log("✌️res --->", res);

      const compareList: string[] = JSON.parse(
        localStorage.getItem("compare") || "[]"
      );

      const resultsWithCompare = res?.results.map((item: any) => ({
        ...item,
        is_compare: compareList.includes(item.id),
      }));

      const minPrice = formatNumber(res?.min_price);
      const maxPrice = formatNumber(res?.max_price);

      setState({
        propertyList: resultsWithCompare,
        handNext: res?.next,
        loading: false,
      });
    } catch (error) {
      setState({
        loading: false,
      });
      console.log("✌️error --->", error);
    }
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header + Gallery */}
        {/* <Header /> */}
        <BannerSection />

        <div>
          <ApartmentTypes />
          <HowItWorks />
          <FeaturedListings />
          <PropertiesByCities />
          <SellingOptions />
          <PopularProperties
            propertyList={state.propertyList}
            updatePropertyType={(type) => propertyList(type)}
          />
          <Testimonials />
          <BlogSection />
        </div>

        <Footer />
      </motion.div>
    </div>
  );
}
