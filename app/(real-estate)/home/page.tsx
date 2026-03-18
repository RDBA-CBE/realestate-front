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
import BannerSectionNew from "@/components/common-components/BannerSectionNew.jsx";
import { useEffect } from "react";
import { Dropdown, formatNumber, useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";

// ---------------- PAGE ----------------
export default function HomePageNew() {
  const [state, setState] = useSetState({
    propertyList: [],
    propertyTypeList: [],
    saleWithFurnishedList:[]
  });

  useEffect(() => {
    propertyList("");
    propertyTypeList();
    saleWithFurnishedList();
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

      if (type == "All") {
        body = {};
      }

      const res: any = await Models.property.list(1, body);

      setState({
        propertyList: res?.results,
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

  const saleWithFurnishedList = async () => {
    try {
      setState({ loading: true });

      let body = {};
      body = {
        listing_type: "sale",
        furnishing: "furnished",
      };

      const res: any = await Models.property.list(1, body);

      setState({
        saleWithFurnishedList: res?.results,
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

  const propertyTypeList = async () => {
    try {
      const res: any = await Models.category.list(1, {});
      setState({
        propertyTypeList: res?.results,
      });
    } catch (error) {
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
        {/* <BannerSection /> */}
        <BannerSectionNew />

        <div>
          <ApartmentTypes propertyTypeList={state.propertyTypeList} />

          <FeaturedListings  list={state.saleWithFurnishedList}/>
          <PropertiesByCities />
          <HowItWorks />

          <SellingOptions />
          <PopularProperties
            propertyList={state.propertyList}
            updatePropertyType={(type) => propertyList(type)}
          />
          <Testimonials />
          {/* <BlogSection /> */}
        </div>

        <Footer />
      </motion.div>
    </div>
  );
}
