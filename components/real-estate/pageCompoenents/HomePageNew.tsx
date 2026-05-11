import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import HomeBanner from '../InnerComponents/HomeBanner';
import { Dropdown, useSetState } from '@/utils/function.utils';
import Models from '@/imports/models.import';
import PropertyByCity from '../InnerComponents/PropertyByCity';
import PropertyByType from '../InnerComponents/PropertyByType';
import FeaturedListings from '../InnerComponents/FeaturedListings';
import HowItWorks from '../InnerComponents/HowItWorks';
import NewTestimonial from '../InnerComponents/NewTestimonial';
import SellingOptionsSection from '../InnerComponents/SellingOptionsSection';
import NewFooter from '../NewFooter';
import NewPopuplarProperties from '../InnerComponents/NewPopuplarProperties';


const HomePageNew = () => {

    const [state, setState] = useSetState({
      propertyList: [],
      propertyTypeList: [],
      saleWithFurnishedList:[],
      cityList: [],
    });
  
    useEffect(() => {
      propertyList("");
      propertyTypeList();
       saleWithFurnishedList();
      cityList(1)
    }, []);

    const cityList = async (page) => {
      try {
        const body: any = {};
        if (state.search) body.search = state.search;
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

    console.log("cityList", state.locationList);
    
  
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
          setState({
            locationList: state.locationList,
          });
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };

   const propertyTypeList = async () => {
      try {
        const res: any = await Models.category.list(1, {});
        setState({
          propertyTypeList: res?.results?.filter((item)=>item?.properties_count != 0),
        });
      } catch (error) {
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

            // derive unique cities
            const seen = new Set();
            const cityList = res?.results
              ?.filter((p) => {
                if (p?.city && !seen.has(p.city)) { seen.add(p.city); return true; }
                return false;
              })
              .map((p) => ({
                name: p.city,
                image: p.primary_image,
                count: res?.results?.filter((x) => x.city === p.city).length,
              }));
      
            setState({
              propertyList: res?.results,
              cityList: cityList || [],
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

        console.log("propertyList", state.propertyList);
        


  return (
    <div className="min-h-screen">
         <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <HomeBanner propertyTypeList={state.propertyTypeList} cityList={state.locationList} />

         <PropertyByCity cityList={state.cityList} />

          <FeaturedListings list={state.saleWithFurnishedList}/>

        <PropertyByType propertyTypeList={state.propertyTypeList} />

       

        <HowItWorks />

        <NewPopuplarProperties
            propertyList={state.propertyList}
            updatePropertyType={(type) => propertyList(type)}
          />

        <SellingOptionsSection/>



        {/* <HelpServicesSection/> */}

        <NewTestimonial/>

        <NewFooter/>


      </motion.div>
    </div>
  )
}

export default HomePageNew