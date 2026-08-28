"use client";
import { PropertyView } from "@/components/real-estate/property-list/property3And4Column/property-view";
import PropertyDetailClient from "@/components/real-estate/property-detail/PropertyDetailClient";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import {
  removePlus,
  useSetState,
} from "@/utils/function.utils";
import { toastEmitter } from "@/utils/toast.utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

type PropertyListClientProps = {
  slug?: string;
  jobUrl?: string;
};

const slugToSearch = (value?: string) =>
  value ? decodeURIComponent(value).replace(/-/g, " ").trim() : "";

export default function PropertyListClient({ slug, jobUrl }: PropertyListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const developerId = searchParams.get("developerId");
  const search = searchParams.get("search") || "";
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
    masterLocationList: [],
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
    initialArea: [],
    initialProject: [],
    initialPropertyType: [],
    initialDeveloper: [],
    initialListingStatus: "All",
    isDetailView: false,
  });

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);

  useEffect(() => {
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developerId, search, type, propertyType, locationParam, slug, jobUrl]);

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

  const formatSlugStr = (str: any) =>
    decodeURIComponent(String(str || ""))
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

  // Extract filter object from URL slugs (e.g. /property-list/location/india/tamil-nadu/chennai)
  const findFilterFromUrlSlugs = (urlOrPath: string, filterRes: any) => {
    if (!urlOrPath) return {};

    const cleanPath = urlOrPath.replace(/.*\/property-list\/?/, "").split("?")[0];
    const segments = cleanPath.split("/").filter(Boolean);

    if (segments.length === 0) return {};

    const urlFilter: any = {};
    const filterType = segments[0]?.toLowerCase();

    const valueSegments = (
      filterType === "location" ||
      filterType === "property-type" ||
      filterType === "category" ||
      filterType === "offer-type" ||
      filterType === "developer" ||
      filterType === "project" ||
      filterType === "state" ||
      filterType === "city-name" ||
      filterType === "area-name"
    ) ? segments.slice(1) : segments;

    const locationsFromRes = filterRes?.location || [];
    const areasFromRes = filterRes?.area || [];
    const categoriesFromRes = filterRes?.property_type || [];
    const developersFromRes = filterRes?.developer || [];
    const projectsFromRes = filterRes?.project || [];

    // Search backwards (most specific segment like 'chennai' first)
    for (let i = valueSegments.length - 1; i >= 0; i--) {
      const seg = formatSlugStr(valueSegments[i]);
      if (!seg) continue;

      if (filterType === "location" || filterType === "state" || filterType === "city-name" || !urlFilter.location) {
        const locMatch = locationsFromRes.find(
          (item: any) =>
            formatSlugStr(item.name) === seg ||
            formatSlugStr(item.slug || "") === seg ||
            String(item.id) === seg
        );
        if (locMatch) {
          urlFilter.location = [{ label: locMatch.name, value: locMatch.id }];
          break;
        }
      }

      if (filterType === "area-name" || !urlFilter.area) {
        const areaMatch = areasFromRes.find(
          (item: any) =>
            formatSlugStr(item.name) === seg ||
            formatSlugStr(item.slug || "") === seg ||
            String(item.id) === seg
        );
        if (areaMatch) {
          urlFilter.area = [{ label: areaMatch.name, value: areaMatch.id }];
          break;
        }
      }

      if (filterType === "property-type" || filterType === "category" || !urlFilter.propertyType) {
        const catMatch = categoriesFromRes.find(
          (item: any) =>
            formatSlugStr(item.name) === seg ||
            formatSlugStr(item.slug || "") === seg ||
            String(item.id) === seg
        );
        if (catMatch) {
          urlFilter.propertyType = [{ label: catMatch.name, value: catMatch.id }];
          break;
        }
      }

      if (filterType === "developer" || !urlFilter.developer) {
        const devMatch = developersFromRes.find(
          (item: any) =>
            formatSlugStr(item.name) === seg ||
            formatSlugStr(item.slug || "") === seg ||
            String(item.id) === seg
        );
        if (devMatch) {
          urlFilter.developer = [{ label: devMatch.name, value: devMatch.id }];
          break;
        }
      }

      if (filterType === "project" || !urlFilter.project) {
        const projMatch = projectsFromRes.find(
          (item: any) =>
            formatSlugStr(item.name) === seg ||
            formatSlugStr(item.slug || "") === seg ||
            String(item.id) === seg
        );
        if (projMatch) {
          urlFilter.project = [{ label: projMatch.name, value: projMatch.id }];
          break;
        }
      }
    }

    if (filterType === "offer-type" || valueSegments.some(s => formatSlugStr(s) === "for-sale" || formatSlugStr(s) === "for-lease" || formatSlugStr(s) === "for-rent")) {
      const lastSeg = formatSlugStr(valueSegments[valueSegments.length - 1]);
      if (lastSeg === "for-sale") {
        urlFilter.listingStatus = "For Sale";
      } else if (lastSeg === "for-lease" || lastSeg === "for-rent") {
        urlFilter.listingStatus = "For Lease";
      }
    }

    return urlFilter;
  };

  const initPage = async () => {
    try {
      setState({ loading: true });

      // Check if jobUrl or slug points to a single property detail view first
      const rawSlug = slug || (jobUrl ? String(jobUrl).replace(/.*\/property-list\/?/, "").split("?")[0] : "");
      const slugValue = rawSlug.replace(/^(property-list\/)+/, "");
      const filterPrefixes = [
        "property-list",
        "location",
        "property-type",
        "category",
        "offer-type",
        "developer",
        "project",
        "state",
        "city-name",
        "city",
        "area-name",
        "area",
        "country",
        "price",
        "type",
      ];
      const firstSegment = slugValue ? slugValue.split("/")[0].toLowerCase() : "";
      const isFilterRoute = filterPrefixes.includes(firstSegment);

      if (slugValue && !isFilterRoute) {
        try {
          const detailObj: any = await Models.property.detailByUrl(slugValue);
          if (detailObj && detailObj.id) {
            setState({ isDetailView: true, loading: false });
            return;
          }
        } catch (e) {
          // Route is not a single property detail view, proceed with property listing view
        }
      }

      // 1. Fetch initial dynamicFilter response (unfiltered)
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

      // Save initial filter lists into state
      setState({
        masterLocationList: locationList,
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
      });

      // 2. Extract filters from query parameters and URL slugs
      const queryFilter = buildUrlParamFilter(res);
      const targetUrl = jobUrl || (typeof window !== "undefined" ? window.location.pathname : "");
      const slugFilter = findFilterFromUrlSlugs(targetUrl, res);

      const combinedFilter: any = {
        ...queryFilter,
        ...slugFilter,
      };

      if (slugFilter.location || queryFilter.location) combinedFilter.location = slugFilter.location || queryFilter.location;
      if (slugFilter.area || queryFilter.area) combinedFilter.area = slugFilter.area || queryFilter.area;
      if (slugFilter.propertyType || queryFilter.propertyType) combinedFilter.propertyType = slugFilter.propertyType || queryFilter.propertyType;
      if (slugFilter.developer || queryFilter.developer) combinedFilter.developer = slugFilter.developer || queryFilter.developer;
      if (slugFilter.project || queryFilter.project) combinedFilter.project = slugFilter.project || queryFilter.project;
      if (slugFilter.listingStatus || queryFilter.listingStatus) combinedFilter.listingStatus = slugFilter.listingStatus || queryFilter.listingStatus;

      const hasFilters = Object.keys(combinedFilter).length > 0;

      if (hasFilters) {
        // Set initial UI filter selections
        setState({
          initialLocation: combinedFilter.location || [],
          initialArea: combinedFilter.area || [],
          initialProject: combinedFilter.project || [],
          initialPropertyType: combinedFilter.propertyType || [],
          initialDeveloper: combinedFilter.developer || [],
          initialListingStatus: combinedFilter.listingStatus || "All",
        });

        // Pass matched filter in body to dynamicFilter to fetch updated counts & options for this filter
        await dynamicFilterList(combinedFilter, locationList);

        // Fetch properties matching this filter
        await propertyList(1, false, combinedFilter);
      } else {
        await propertyList(1, false, null);
      }
    } catch (error) {
      const msg = error?.error || error?.response?.data?.error || "Failed to initialize filters";
      toastEmitter.emit("error", msg);
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
      const msg = error?.error || error?.response?.data?.error || "Failed to load properties";
      toastEmitter.emit("error", msg);
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
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const dynamicFilterList = async (data = null, masterLocs = null) => {
    try {
      const bodys = data ? bodyData(data) : {};
      const res: any = await Models.property.dynamicFilter(bodys);

      const newLocations = (res?.location || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const categoryList = (res?.property_type || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const furnishingList = (res?.furnishing || []).map((item: any) => ({ label: item.name, value: item.value, count: item.count }));
      const listingTypeList = (res?.listing_type || []).map((item: any) => ({ label: item.name, value: item.value, count: item.count }));
      const bedroomList = (res?.bedrooms || []).filter((item: any) => item.value > 0).map((item: any) => String(item.value));
      const areaList = (res?.area || []).filter((item: any) => item.id !== null).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const projectList = (res?.project || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const developerList = (res?.developer || []).map((item: any) => ({ label: item.name, value: item.id, count: item.count }));
      const floorPlanList = (res?.floor_plans || []).map((item: any) => ({ label: item.name.toUpperCase(), value: item.value, count: item.count }));

      const currentMaster = masterLocs || (state.masterLocationList?.length ? state.masterLocationList : newLocations);
      const updatedLocationList = currentMaster.map((masterLoc: any) => {
        const match = newLocations.find((loc: any) => String(loc.value) === String(masterLoc.value));
        return { ...masterLoc, count: match ? match.count : 0 };
      });

      setState({
        locationList: updatedLocationList.length > 0 ? updatedLocationList : newLocations,
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
      });
      return res;
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
    // Reset browser URL to /property-list (remove slug)
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/property-list");
    }
    try {
      router.push("/property-list");
    } catch (e) {
      console.log(e);
    }

    // Reset initial filter selections & state
    setState({
      propertyList: [],
      loading: true,
      initialLocation: [],
      initialArea: [],
      initialProject: [],
      initialPropertyType: [],
      initialDeveloper: [],
      initialListingStatus: "All",
    });

    // Refresh dynamic filters for all properties
    dynamicFilterList(null);

    // Call propertyList with no filter data to get all properties
    propertyList(1, false, null);
  };

  if (state.isDetailView) {
    return <PropertyDetailClient />;
  }

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
        initialArea={state.initialArea}
        initialProject={state.initialProject}
        initialPropertyType={state.initialPropertyType}
        initialListingStatus={state.initialListingStatus || (type ? (type === "all" ? "All" : type === "sale" ? "For Sale" : "For Lease") : "All")}
      />
    </div>
  );
}
