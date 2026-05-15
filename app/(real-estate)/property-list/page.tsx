"use client";
import { PropertyView } from "@/components/real-estate/property-list/property3And4Column/property-view";
import { PropertyView1 } from "@/components/real-estate/property-list/property3And4Column/property-view1";
import { PropertyView2 } from "@/components/real-estate/property-list/property3And4Column/property-view2";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import {
  formatNumber,
  removePlus,
  useSetState,
} from "@/utils/function.utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const developerId = searchParams.get("developerId");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const propertyType = searchParams.get("propertyType");
  const locationParam = searchParams.get("location");


  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    handNext: null,
    page: 1,
    isLoadingMore: false,
    categoryList: [],
    locationList: [],
    areaList: [],
    projectList: [],
    developerList: [],
    floorPlanList: [],
    furnishingList: [],
    listingTypeList: [],
    bedroomList: [],
    minPrice: 0,
    maxPrice: 0,
    propertyTypeParams: "",
    initialLocation: [],
    initialPropertyType: [],
  });

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);

  useEffect(() => {
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (developerId) {
      developerDetail();
    }
  }, [developerId]);



  // Build URL param filter object after validating against dynamic filter response
  const buildUrlParamFilter = (res: any) => {
    const urlFilter: any = {};

    // validate & map location param
    if (locationParam) {
      const locationId = Number(locationParam);
      const matched = (res?.location || []).find((item: any) => item.id === locationId);
      if (matched) urlFilter.location = [{ label: matched.name, value: matched.id }];
    }

    // validate & map propertyType param
    if (propertyType) {
      const typeId = Number(propertyType);
      const matched = (res?.property_type || []).find((item: any) => item.id === typeId);
      if (matched) urlFilter.propertyType = [{ label: matched.name, value: matched.id }];
    }

    // search param
    if (search) urlFilter.search = search;

    // listing type param
    if (type && type !== "all") {
      urlFilter.listingStatus = type === "sale" ? "For Sale" : "For Lease";
    }

    if (developerId) {
      const typeId = Number(developerId);
      const matched = (res?.developer || []).find((item: any) => item.id == typeId);
      if (matched) urlFilter.developer = [{ label: matched.name, value: matched.id }];
    }

    return urlFilter;
  };

  const initPage = async () => {
    try {
      setState({ loading: true });

      // 1. fetch dynamic filters first
      const res: any = await Models.property.dynamicFilter({});

      const locationList = (res?.location || []).map((item: any) => ({ label: item.name, value: item.id }));
      const categoryList = (res?.property_type || []).map((item: any) => ({ label: item.name, value: item.id }));
      const furnishingList = (res?.furnishing || []).map((item: any) => ({ label: item.name, value: item.value }));
      const listingTypeList = (res?.listing_type || []).map((item: any) => ({ label: item.name, value: item.value }));
      const bedroomList = (res?.bedrooms || []).filter((item: any) => item.value > 0).map((item: any) => String(item.value));
      const areaList = (res?.area || []).filter((item: any) => item.id !== null).map((item: any) => ({ label: item.name, value: item.id }));
      const projectList = (res?.project || []).map((item: any) => ({ label: item.name, value: item.id }));
      const developerList = (res?.developer || []).map((item: any) => ({ label: item.name, value: item.id }));
      const floorPlanList = (res?.floor_plans || []).map((item: any) => ({ label: item.name.toUpperCase(), value: item.value }));

      // 2. validate URL params against filter response
      const urlFilter = buildUrlParamFilter(res);

      setState({
        locationList,
        categoryList,
        areaList,
        projectList,
        developerList,
        floorPlanList,
        furnishingList,
        listingTypeList,
        bedroomList,
        minPrice: res?.price_range?.minimum_price || 0,
        maxPrice: res?.price_range?.maximum_price || 0,
        initialLocation: urlFilter.location || [],
        initialPropertyType: urlFilter.propertyType || [],
      });

      // 3. fetch property list with validated URL params
      const hasUrlFilters = Object.keys(urlFilter).length > 0;
      await propertyList(1, false, hasUrlFilters ? urlFilter : null);
    } catch (error) {
      setState({ loading: false });
    }
  };

  const propertyList = async (page = 1, append = false, filterData = null) => {
    try {
      if (append) {
        setState({ isLoadingMore: true });
      } else {
        setState({ loading: true });
      }

      const bodys = filterData
        ? bodyData(filterData)
        : { page_size: PROPERTY_LIST_PAGE };
      const res: any = await Models.property.list(page, bodys);

      const compareList: string[] = JSON.parse(
        localStorage.getItem("compare") || "[]"
      );

      const resultsWithCompare = res?.results.map((item: any) => ({
        ...item,
        is_compare: compareList.includes(item.id),
      }));

      // const minPrice = formatNumber(res?.min_price);
      // const maxPrice = formatNumber(res?.max_price);

      setState({
        propertyList: append
          ? [...state.propertyList, ...resultsWithCompare]
          : resultsWithCompare,
        handNext: res?.next,
        page: page,
        loading: false,
        isLoadingMore: false,
        // minPrice: filterData ? state.minPrice : minPrice,
        // maxPrice: filterData ? state.maxPrice : maxPrice,
      });
    } catch (error) {
      setState({
        loading: false,
        isLoadingMore: false,
      });
      console.log("✌️error --->", error);
    }
  };

  const developerDetail = async () => {
    try {
      const res: any = await Models.user.details(developerId);
      // console.log("✌️res --->", res);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };



  const dynamicFilterList = async (data = null) => {
    try {
      const bodys = data ? bodyData(data) : {};
      const res: any = await Models.property.dynamicFilter(bodys);

      setState({
        locationList: (res?.location || []).map((item: any) => ({ label: item.name, value: item.id })),
        categoryList: (res?.property_type || []).map((item: any) => ({ label: item.name, value: item.id })),
        furnishingList: (res?.furnishing || []).map((item: any) => ({ label: item.name, value: item.value })),
        listingTypeList: (res?.listing_type || []).map((item: any) => ({ label: item.name, value: item.value })),
        bedroomList: (res?.bedrooms || []).filter((item: any) => item.value > 0).map((item: any) => String(item.value)),
        areaList: (res?.area || []).filter((item: any) => item.id !== null).map((item: any) => ({ label: item.name, value: item.id })),
        projectList: (res?.project || []).map((item: any) => ({ label: item.name, value: item.id })),
        developerList: (res?.developer || []).map((item: any) => ({ label: item.name, value: item.id })),
        floorPlanList: (res?.floor_plans || []).map((item: any) => ({ label: item.name.toUpperCase(), value: item.value })),
        minPrice: res?.price_range?.minimum_price || 0,
        maxPrice: res?.price_range?.maximum_price || 0,
      });
    } catch (error) {
      setState({ loading: false, isLoadingMore: false });
    }
  };

  const filterList = async (page = 1, append = false, data = null) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(async () => {
      try {
        if (append) {
          setState({ isLoadingMore: true });
        } else {
          setState({ loading: true });
        }

        const bodys = bodyData(data);
        const res: any = await Models.property.list(page, bodys);

        const compareList: string[] = JSON.parse(
          localStorage.getItem("compare") || "[]"
        );

        const resultsWithCompare = res?.results.map((item: any) => ({
          ...item,
          is_compare: compareList.includes(item.id),
        }));

        setState({
          propertyList: append
            ? [...state.propertyList, ...resultsWithCompare]
            : resultsWithCompare,
          handNext: res?.next,
          page: page,
          loading: false,
          isLoadingMore: false,
        });
      } catch (error) {
        setState({
          loading: false,
          isLoadingMore: false,
        });
      }
    }, 300); // 300ms debounce
  };

  const bodyData = (data) => {

    console.log("data", data);
    
    const bodyData: any = {};

    bodyData.is_approved = "Yes";

    if (developerId && !data?.developer?.length) {
      bodyData.developer = developerId;
    }

    if (data.prefferedLocation){
      bodyData.user_preferred_locations = data.prefferedLocation;
    }

    if (data?.listingStatus) {
      // if (data?.listingStatus == "All") {
      //   bodyData.listing_type = [data?.listingStatus.toLowerCase()];
      // }

       if (data?.listingStatus == "For Sale") {
        bodyData.listing_type = ["sale"];
      }

      if (data?.listingStatus == "For Lease") {
        bodyData.listing_type = ["lease"];
      }
    }
    if (data?.propertyType?.length > 0) {
      bodyData.property_type = data?.propertyType?.map((item) => item?.value);
    }
  

    if (data?.furnishing?.length > 0) {
      bodyData.furnishing = data?.furnishing?.[0]?.value;
    }

    if (data?.search) {
      bodyData.search = data?.search;
    }

    if (data?.priceMinInput) {
      bodyData.min_price = data?.priceMinInput;
      bodyData.minimum_price = data?.priceMinInput;
    }

    if (data?.priceMaxInput) {
      bodyData.max_price = data?.priceMaxInput;
      bodyData.maximum_price = data?.priceMaxInput;
    }

    if (data?.bedrooms) {
      if (data?.bedrooms != "Any") {
        bodyData.bedrooms = removePlus(data?.bedrooms);
      }
    }
    if (data?.bathrooms) {
      if (data?.bathrooms != "Any") {
        bodyData.bathrooms = removePlus(data?.bathrooms);
      }
    }
    if (data?.location?.length > 0) {
      bodyData.location = data?.location?.map((item) => item?.value);
    }
    if (data?.area?.length > 0) {
      bodyData.area = data?.area?.map((item) => item?.value);
    }
    if (data?.project?.length > 0) {
      bodyData.project = data?.project?.map((item) => item?.value);
    }
    if (data?.developer?.length > 0) {
      bodyData.developer = data?.developer?.map((item) => item?.value);
    }
    if (data?.floorPlan?.length > 0) {
      bodyData.floor_plan = data?.floorPlan?.map((item) => item?.value);
    }
    //   if (data?.sqftMin || data?.sqftMax) {
    //   bodyData.built_up_area = data?.sqftMin && data?.sqftMax ? `${data?.sqftMin},${data?.sqftMax}` : data?.sqftMin ? `${data?.sqftMin}` : `${data?.sqftMax}`;
    // }

    if (data?.sqftMin) {
      bodyData.sqftMin = data?.sqftMin;
    }
  
    if (data?.sqftMax) {
      bodyData.sqftMax = data?.sqftMax;
    }
    if (data?.yearBuiltMin != null && data?.yearBuiltMin != "") {
      bodyData.yearBuiltMin = data?.yearBuiltMin;
    }
    if (data?.yearBuiltMax != null && data?.yearBuiltMax != "") {
      bodyData.yearBuiltMax = data?.yearBuiltMax;
    }
    if (data?.sort) {
      if (data?.sort == "price") {
        bodyData.sort_by = "minimum_price";
      } else if (data?.sort == "-price") {
        bodyData.sort_by = "-minimum_price";
      } else {
        bodyData.sort_by = data?.sort;
      }
    }

    bodyData.page_size = PROPERTY_LIST_PAGE;
    bodyData.is_approved = "Yes";
    bodyData.publish = "Yes";
    return bodyData;
  };

  const clearAllFilters = () => {
    propertyList(); // Reset to initial load without filters
  };

  return (
    <div>
      <PropertyView
        propertyTypeFilter={state.propertyTypeParams}
        minPrice={state.minPrice}
        maxPrice={state.maxPrice}
        properties={state.propertyList}
        categoryList={state.categoryList}
        locationList={state.locationList}
        areaList={state.areaList}
        projectList={state.projectList}
        developerList={state.developerList}
        floorPlanList={state.floorPlanList}
        furnishingList={state.furnishingList}
        listingTypeList={state.listingTypeList}
        bedroomList={state.bedroomList}
        filters={(data) => filterList(1, false, data)}
        onFilterChange={(data) => dynamicFilterList(data)}
        loading={state.loading}
        isLoadingMore={state.isLoadingMore}
        handNext={state.handNext}
        loadMore={(data) => filterList(state.page + 1, true, data)}
        updateList={(data) => setState({ propertyList: data })}
        clearFilter={clearAllFilters}
        initialSearch={search}
        initialLocation={state.initialLocation}
        initialPropertyType={state.initialPropertyType}
        initialListingStatus={type ? (type === "all" ? "All" : type === "sale" ? "For Sale" : "For Lease") : "All"}
      />
    </div>
  );
}
