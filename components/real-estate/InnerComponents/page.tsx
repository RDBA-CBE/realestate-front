"use client";
import { PropertyView } from "@/components/real-estate/property-list/property3And4Column/property-view";
import { PropertyView1 } from "@/components/real-estate/property-list/property3And4Column/property-view1";
import { PropertyView2 } from "@/components/real-estate/property-list/property3And4Column/property-view2";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import {
  capitalizeFLetter,
  formatNumber,
  removePlus,
  useSetState,
} from "@/utils/function.utils";
import { Timer, Briefcase, Layers, Building } from "lucide-react";
import { toastEmitter } from "@/utils/toast.utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const developerId = searchParams.get("developerId");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const propertyType = searchParams.get("propertyType");
  const locationParam = searchParams.get("location");

  // Create a key that changes when relevant search params change to force PropertyView re-mount
  const pageKey = `${developerId || ''}-${search || ''}-${type || ''}-${propertyType || ''}-${locationParam || ''}`;


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
    developerInfo: null,
  });

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);

  useEffect(() => {
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developerId, search, type, propertyType, locationParam]);

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
      const typeVal = propertyType.toLowerCase();
      const matched = (res?.property_type || []).find((item: any) => 
        String(item.id) === typeVal || (item.name && item.name.toLowerCase() === typeVal)
      );
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

      const locationList = (res?.location || []).map((item: any) => ({ label: item.name, value: item.id , count: item.count}));
      const categoryList = (res?.property_type || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const furnishingList = (res?.furnishing || []).map((item: any) => ({ label: item.name, value: item.value, count: item.count }));
      const listingTypeList = (res?.listing_type || []).map((item: any) => ({ label: item.name, value: item.value, count: item.count }));
      const bedroomList = (res?.bedrooms || []).filter((item: any) => item.value > 0).map((item: any) => String(item.value));
      const areaList = (res?.area || []).filter((item: any) => item.id !== null).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const projectList = (res?.project || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const developerList = (res?.developer || []).map((item: any) => ({ label: item.name, value: item.id , count: item.count}));
      const floorPlanList = (res?.floor_plans || []).map((item: any) => ({ label: item.name.toUpperCase(), value: item.value, count: item.count }));

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
        initialDeveloper: urlFilter.developer || [],
      });

      // 3. fetch property list with validated URL params
      const hasUrlFilters = Object.keys(urlFilter).length > 0;
      await propertyList(1, false, hasUrlFilters ? urlFilter : null);
    } catch (error) {
      setState({ loading: false });
      
      // If unauthorized, let the axios interceptor handle it
      if (error?.response?.status === 401) return;

      const msg = error?.error || error?.response?.data?.error || "Failed to initialize filters";
      toastEmitter.emit("error", msg);
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

      if (error?.response?.status === 401) return;

      const msg = error?.error || error?.response?.data?.error || "Failed to load properties";
      toastEmitter.emit("error", msg);
      console.log("✌️error --->", error);
    }
  };

  const developerDetail = async () => {
    try {
      const res: any = await Models.user.details(developerId);
      setState({ developerInfo: res });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };



  const dynamicFilterList = async (data = null) => {
    try {
      const bodys = data ? bodyData(data) : {};
      const res: any = await Models.property.dynamicFilter(bodys);

      setState({
        locationList: (res?.location || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count })),
        categoryList: (res?.property_type || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count })),
        furnishingList: (res?.furnishing || []).map((item: any) => ({ label: item.name, value: item.value, count: item.count })),
        listingTypeList: (res?.listing_type || []).map((item: any) => ({ label: item.name, value: item.value, count: item.count })),
        bedroomList: (res?.bedrooms || []).filter((item: any) => item.value > 0).map((item: any) => String(item.value)),
        areaList: (res?.area || []).filter((item: any) => item.id !== null).map((item: any) => ({ label: item.name, value: item.id, count: item.count })),
        projectList: (res?.project || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count })),
        developerList: (res?.developer || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count })),
        floorPlanList: (res?.floor_plans || []).map((item: any) => ({ label: item.name.toUpperCase(), value: item.value, count: item.count })),
        minPrice: res?.price_range?.minimum_price || 0,
        maxPrice: res?.price_range?.maximum_price || 0,
      });
    } catch (error) {
      setState({ loading: false, isLoadingMore: false });
    }
  };

  const filterList = async (page = 1, append = false, data = null) => {
    try {
      if (append) {
        setState({ isLoadingMore: true });
      } else {
        setState({ isFilterLoading: true });
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
        isFilterLoading: false,
        isLoadingMore: false,
      });
    } catch (error) {
      setState({
        loading: false,
        isFilterLoading: false,
        isLoadingMore: false,
      });
    }
  };

  const bodyData = (data) => {

    console.log("data", data);
    console.log("bodyData received data:", data); // Debug log
    
    const bodyData: any = {};

    bodyData.is_approved = "Yes";

    if (developerId && !data?.developer?.length) {
      bodyData.developer = developerId;
    }

    if (data.prefferedLocation){
      console.log("bodyData sending prefferedLocation:", data.prefferedLocation); // Debug log
      bodyData.user_preferred_locations = data.prefferedLocation;
    }

    if (data?.listingStatus) {
      // if (data?.listingStatus == "All") {
      //   bodyData.listing_type = [data?.listingStatus.toLowerCase()];
      // }

       if (data?.listingStatus == "For Sale") {
        bodyData.listing_type = ["sale"];
      }
      // Explicitly handle "All" listing status by sending an empty array for listing_type
      if (data?.listingStatus == "All") {
        bodyData.listing_type = [];
      }

      if (data?.listingStatus == "For Lease") {
        bodyData.listing_type = ["lease"];
      }
    }
    if (data?.propertyType?.length > 0) {
      console.log("bodyData sending property_type:", data.propertyType.map((item) => item?.value)); // Debug log
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
      console.log("bodyData sending location:", data.location.map((item) => item?.value)); // Debug log
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
    // Reset filters and fetch properties without any filters
    setState({
      propertyList: [],
      loading: true,
    });
    // Call propertyList with no filter data to get all properties
    propertyList(1, false, null);
  };

  return (
    <div>
      {developerId && state.developerInfo && (
        <div className="container mx-auto px-4 mt-6">
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-themeColor1/10 flex items-center justify-center shrink-0">
                  <Timer className="w-6 h-6 text-themeColor1" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Experience</p>
                  <p className="text-sm font-semibold">{state.developerInfo.years_in_business || 0} Years</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-themeColor1/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-themeColor1" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Specialization</p>
                  <p className="text-sm font-semibold truncate" title={state.developerInfo.specialization?.map((s: any) => s.specialization).join(", ")}>
                    {state.developerInfo.specialization?.map((s: any) => s.specialization).join(", ") || "General"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-themeColor1/10 flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6 text-themeColor1" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Projects</p>
                  <p className="text-sm font-semibold">{state.developerInfo.total_project_count || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-themeColor1/10 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6 text-themeColor1" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Properties</p>
                  <p className="text-sm font-semibold">{state.developerInfo.total_properties_count || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <PropertyView
        key={pageKey} // Add this key to force re-mount on URL param changes
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
        initialDeveloper={state.initialDeveloper}
        filters={(data) => filterList(1, false, data)}
        onFilterChange={(data) => dynamicFilterList(data)}
        loading={state.loading}
        isFilterLoading={state.isFilterLoading}
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
