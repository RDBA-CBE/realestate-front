"use client"

import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import HomeBanner from '../InnerComponents/HomeBanner';
import { Dropdown, useSetState } from '@/utils/function.utils';
import Models from '@/imports/models.import';
import { toastEmitter } from '@/utils/toast.utils';
import PropertyByCity from '../InnerComponents/PropertyByCity';
import PropertyByType from '../InnerComponents/PropertyByType';
import FeaturedListings from '../InnerComponents/FeaturedListings';
import HowItWorks from '../InnerComponents/HowItWorks';
import NewTestimonial from '../InnerComponents/NewTestimonial';
import SellingOptionsSection from '../InnerComponents/SellingOptionsSection';
import DeveloperRegistrationSection from '../InnerComponents/DeveloperRegistrationSection';
import FeaturedDevelopers from '../InnerComponents/FeaturedDevelopers';
import NewFooter from '../NewFooter';
import NewPopuplarProperties from '../InnerComponents/NewPopuplarProperties';
import Testimonials from '@/components/common-components/Testimonials';
import ExploreDreamHomeSection from '../InnerComponents/ExploreDreamHomeSection';
import FAQSection from '../InnerComponents/FAQSection';
import AboutSection from '../InnerComponents/AboutSection';
import SectionTestimonial from '../InnerComponents/SectionTestimonial';
import LocationPickerModal from '../InnerComponents/LocationPickerModal';
import PropertyByCityNew from '../InnerComponents/PropertyByCityNew';
import FAQSectionNew from '../InnerComponents/FAQSectionNew';
import SectionTestimonialNew from '../InnerComponents/SectionTestimonialNew';



const HomePageNew = () => {

    const [state, setState] = useSetState({
      propertyList: [],
      propertyTypeList: [],
      saleWithFurnishedList:[],
      cityList: [],
      developerList: [],
      selectedLocation: null as { value: number; label: string } | null,
      allCities: [],
      showLocationModal: false,
      featuredLocationEmpty: false,
      popularLocationEmpty: false,
    });
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      const savedLocation = localStorage.getItem("userLocation");

      if (savedLocation) {
        const loc = JSON.parse(savedLocation);
        setState({ selectedLocation: loc });
        propertyList("", loc.value);
        saleWithFurnishedList(loc.value);
      } else {
        propertyList("");
        saleWithFurnishedList();
        if (token) setState({ showLocationModal: true });
      }

      propertyTypeList();
      cityList(1);
      developerList();

      const onOpenPicker = () => setState({ showLocationModal: true });
      const onLocationChanged = (e: any) => {
        const loc = e.detail;
        setState({ selectedLocation: loc });
        propertyList("", loc.value);
        saleWithFurnishedList(loc.value);
      };
      window.addEventListener("openLocationPicker", onOpenPicker);
      window.addEventListener("locationChanged", onLocationChanged);
      return () => {
        window.removeEventListener("openLocationPicker", onOpenPicker);
        window.removeEventListener("locationChanged", onLocationChanged);
      };
    }, []);

    const developerList = async () => {
      try {
        const res: any = await Models.user.list(1, { group: "Developer", has_complete_developer_profile: true});
        setState({ developerList: res?.results || [] });
      } catch (error: any) {
        const msg = error?.error || error?.response?.data?.error || "";
        if (msg === "Given token not valid for any token type") {
          toastEmitter.emit("error", "Session expired. Please login again.");
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
        console.log("✌️error --->", error);
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
          allCities: locationdd,
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

    const cityLoadMore = async () => {
      try {
        if (state.cityNext) {
          const res: any = await Models.dropdowns.city(state.cityPage + 1, {});
          const newOptions = Dropdown(res?.results, "name");
          setState({
            locationList: [...state.locationList, ...newOptions],
            cityNext: res.next,
            cityPage: state.cityPage + 1,
          });
        } else {
          setState({ locationList: state.locationList });
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };

   const propertyTypeList = async () => {
      try {
        const res: any = await Models.category.list(1, {});
        setState({
          propertyTypeList: res?.results?.filter((item) => item?.properties_count != 0),
        });
      } catch (error) {
        console.log("✌️error --->", error);
      }
    };

    const saleWithFurnishedList = async (locationId?: number) => {
      try {
        setState({ loading: true, featuredLocationEmpty: false });

        const body: any = { listing_type: "sale", furnishing: "furnished" };
        if (locationId) body.location = locationId;

        const res: any = await Models.property.list(1, body);
        const results = res?.results || [];

        if (locationId && results.length === 0) {
          setState({ featuredLocationEmpty: true });
          // fallback: fetch without location filter
          const fallback: any = await Models.property.list(1, { listing_type: "sale", furnishing: "furnished" });
          setState({ saleWithFurnishedList: fallback?.results || [], loading: false });
        } else {
          setState({ saleWithFurnishedList: results, loading: false });
        }
      } catch (error) {
        setState({ loading: false });
        console.log("✌️error --->", error);
      }
    };

    const propertyList = async (type, locationId?: number) => {
      try {
        setState({ loading: true, popularLocationEmpty: false });

        const body: any = {};
        if (type === "sale") body.listing_type = "sale";
        if (type === "lease") body.listing_type = "lease";

        const locId = locationId ?? state.selectedLocation?.value;
        if (locId) body.location = locId;

        const res: any = await Models.property.list(1, body);
        const results = res?.results || [];

        if (locId && results.length === 0) {
          setState({ popularLocationEmpty: true });
          // fallback: fetch without location filter
          const fallbackBody: any = {};
          if (type === "sale") fallbackBody.listing_type = "sale";
          if (type === "lease") fallbackBody.listing_type = "lease";
          const fallback: any = await Models.property.list(1, fallbackBody);
          setState({ propertyList: fallback?.results || [], loading: false });
        } else {
          setState({ propertyList: results, loading: false });
        }
      } catch (error) {
        setState({ loading: false });
        console.log("✌️error --->", error);
      }
    };

  const handleLocationConfirm = (loc: { value: number; label: string }) => {
    localStorage.setItem("userLocation", JSON.stringify(loc));
    setState({ selectedLocation: loc, showLocationModal: false, featuredLocationEmpty: false, popularLocationEmpty: false });
    window.dispatchEvent(new CustomEvent("locationChanged", { detail: loc }));
    propertyList("", loc.value);
    saleWithFurnishedList(loc.value);
  };

  const handleLocationSkip = () => {
    setState({ showLocationModal: false });
  };

  return (
    <div className="min-h-screen">
      {/* {state.showLocationModal && (
        <LocationPickerModal
          cities={state.allCities}
          onConfirm={handleLocationConfirm}
          onSkip={handleLocationSkip}
        />
      )} */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <HomeBanner propertyTypeList={state.propertyTypeList} cityList={state.locationList} />

         <PropertyByCity cityList={state.cityList} />
         {/* <PropertyByCityNew cityList={state.cityList} /> */}

          <FeaturedListings
            list={state.saleWithFurnishedList}
            locationEmpty={state.featuredLocationEmpty}
            locationLabel={state.selectedLocation?.label}
          />

        <PropertyByType propertyTypeList={state.propertyTypeList} />

        <HowItWorks />

        <FeaturedDevelopers developerList={state.developerList} />

        <DeveloperRegistrationSection/>

        <NewPopuplarProperties
            propertyList={state.propertyList}
            updatePropertyType={(type) => propertyList(type)}
            locationEmpty={state.popularLocationEmpty}
            locationLabel={state.selectedLocation?.label}
          />

        {/* <AboutSection /> */}
         <SellingOptionsSection/>

        {/* <FAQSection/> */}
        <FAQSectionNew/>

        {/* <ExploreDreamHomeSection/> */}

        {/* <SectionTestimonial/> */}
        <SectionTestimonialNew/>

        {/* <Testimonials /> */}

        {/* <NewTestimonial/> */}

        {/* <NewFooter/> */}

      </motion.div>
    </div>
  )
}

export default HomePageNew
