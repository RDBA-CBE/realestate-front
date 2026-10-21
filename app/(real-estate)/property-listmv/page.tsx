"use client";

import { MapView } from "@/components/real-estate/property-list/property3And4Column/property-mapview";
import { MobileMapView } from "@/components/real-estate/property-list/property3And4Column/property-mapview-mobile";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import { removePlus, useSetState } from "@/utils/function.utils";
import { toastEmitter } from "@/utils/toast.utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const developerId = searchParams.get("developerId");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const propertyType = searchParams.get("propertyType");
  const locationParam = searchParams.get("location");
  const furnishing = searchParams.get("furnishing");

  const ai_location = searchParams.get("ai_location");
  const ai_area = searchParams.get("ai_area");
  const ai_propertyType = searchParams.get("ai_propertyType");
  const ai_floor_plans_category = searchParams.get("ai_floor_plans_category");
  const ai_maxPrice = searchParams.get("ai_maxPrice");
  const ai_furnishing = searchParams.get("ai_furnishing");
  const ai_amenities = searchParams.get("ai_amenities");

  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    isFilterLoading: false,
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
    initialLocation: [],
    initialPropertyType: [],
    initialArea: [],
    initialDeveloper: [],
    initialFurnishingList: [],
  });

  useEffect(() => {
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developerId, search, type, propertyType, locationParam, ai_location, furnishing]);

  const toFilterOptions = (items: any[] = []) =>
    items.map((item: any) => ({
      label: item.name,
      value: item.id,
      count: item.count,
    }));

  const setFilterLists = (res: any) => {
    setState({
      locationList: toFilterOptions(res?.location || []),
      categoryList: toFilterOptions(res?.property_type || []),
      areaList: (res?.area || [])
        .filter((item: any) => item.id !== null)
        .map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.count,
        })),
      projectList: toFilterOptions(res?.project || []),
      developerList: toFilterOptions(res?.developer || []),
      furnishingList: (res?.furnishing || []).map((item: any) => ({
        label: item.name,
        value: item.value,
        count: item.count,
      })),
      listingTypeList: (res?.listing_type || []).map((item: any) => ({
        label: item.name,
        value: item.value,
        count: item.count,
      })),
      floorPlanList: (res?.floor_plans || []).map((item: any) => ({
        label: item.name?.toUpperCase(),
        value: item.value,
        count: item.count,
      })),
      bedroomList: (res?.bedrooms || [])
        .filter((item: any) => item.value > 0)
        .map((item: any) => String(item.value)),
      minPrice: res?.price_range?.minimum_price || 0,
      maxPrice: res?.price_range?.maximum_price || 0,
    });
  };

  const buildUrlParamFilter = (res: any) => {
    const urlFilter: any = {};

    if (locationParam) {
      const locationId = Number(locationParam);
      const matched = (res?.location || []).find((item: any) => item.id === locationId);
      if (matched) urlFilter.location = [{ label: matched.name, value: matched.id }];
    }

    if (propertyType) {
      const typeVal = propertyType.toLowerCase();
      const matched = (res?.property_type || []).find(
        (item: any) =>
          String(item.id) === typeVal ||
          item.name?.toLowerCase() === typeVal
      );
      if (matched) urlFilter.propertyType = [{ label: matched.name, value: matched.id }];
    }

    if (search) urlFilter.search = search;
    if (type && type !== "all") urlFilter.listingStatus = type === "sale" ? "For Sale" : "For Lease";

    if (furnishing) {
      const matched = (res?.furnishing || []).find((item: any) => item.value === furnishing);
      if (matched) urlFilter.furnishing = [{ label: matched.name, value: matched.value }];
    }

    if (developerId) {
      const id = Number(developerId);
      const matched = (res?.developer || []).find((item: any) => item.id === id);
      if (matched) urlFilter.developer = [{ label: matched.name, value: matched.id }];
    }

    return urlFilter;
  };

  // Progressively match ai_ params against dynamicFilter response step by step
  const buildAiFilter = async () => {
    const matched: any = {};

    // Step 1: match ai_location by name
    if (ai_location) {
      const res1: any = await Models.property.dynamicFilter({});
      const loc = (res1?.location || []).find(
        (item: any) =>
          item.name?.toLowerCase() === ai_location.toLowerCase() ||
          item.id == ai_location
      );
      if (loc) matched.location = [loc.id];
    }

    if (ai_area) {
      const res2: any = await Models.property.dynamicFilter(
        matched.location ? { location: matched.location } : {}
      );
      const pt = (res2?.area || []).find(
        (item: any) => item.name == ai_area
      );
      if (pt) matched.area = [pt.id];
    }

    // Step 2: match ai_propertyType by name, passing location so far
    if (ai_propertyType) {
      const res2: any = await Models.property.dynamicFilter({
        ...(matched.location ? { location: matched.location } : {}),
        ...(matched.area ? { area: matched.area } : {}),
      });
      const pt = (res2?.property_type || []).find(
        (item: any) =>
          item.name?.toLowerCase() === ai_propertyType.toLowerCase() ||
          item.id == ai_propertyType
      );
      if (pt) matched.property_type = [pt.id];
    }

    // Step 3: match ai_floor_plans_category by value/name
    if (ai_floor_plans_category) {
      const res3: any = await Models.property.dynamicFilter({
        ...(matched.location ? { location: matched.location } : {}),
        ...(matched.area ? { area: matched.area } : {}),
        ...(matched.property_type ? { property_type: matched.property_type } : {}),
      });
      const fp = (res3?.floor_plans || []).find(
        (item: any) =>
          item.value?.toLowerCase() === ai_floor_plans_category.toLowerCase() ||
          item.name?.toLowerCase() === ai_floor_plans_category.toLowerCase()
      );
      if (fp) matched.floor_plan = [fp.value];
    }

    // Step 4: match ai_furnishing by value/name
    if (ai_furnishing) {
      const res4: any = await Models.property.dynamicFilter({
        ...(matched.location ? { location: matched.location } : {}),
        ...(matched.area ? { area: matched.area } : {}),
        ...(matched.property_type ? { property_type: matched.property_type } : {}),
        ...(matched.floor_plan ? { floor_plan: matched.floor_plan } : {}),
      });
      const fur = (res4?.furnishing || []).find(
        (item: any) =>
          item.value?.toLowerCase() === ai_furnishing.toLowerCase() ||
          item.name?.toLowerCase() === ai_furnishing.toLowerCase()
      );
      if (fur) matched.furnishing = fur.value;
    }

    // Step 5: ai_maxPrice — use directly as max_price
    if (ai_maxPrice) {
      matched.max_price = Number(ai_maxPrice);
    }

    // Final: fetch with all matched filters, get final dynamicFilter response
    const finalRes: any = await Models.property.dynamicFilter({
      ...(matched.location ? { location: matched.location } : {}),
      ...(matched.area ? { area: matched.area } : {}),
      ...(matched.property_type ? { property_type: matched.property_type } : {}),
      ...(matched.floor_plan ? { floor_plan: matched.floor_plan } : {}),
      ...(matched.furnishing ? { furnishing: matched.furnishing } : {}),
      ...(matched.max_price ? { max_price: matched.max_price } : {}),
    });

    return { matched, finalFilterResponse: finalRes };
  };

  const initPage = async () => {
    try {
      setState({ loading: true });

      const hasAiParams =
        ai_location ||
        ai_propertyType ||
        ai_floor_plans_category ||
        ai_maxPrice ||
        ai_furnishing ||
        ai_amenities;

      // 1. fetch dynamic filters first
      const res: any = await Models.property.dynamicFilter({});
      setFilterLists(res);

      if (hasAiParams) {
        // 2a. Build ai filter progressively
        const { matched, finalFilterResponse } = await buildAiFilter();

        // Map matched ids back to label/value format for UI
        const aiLocation = (matched.location || [])
          .map((id: number) => {
            const found = (finalFilterResponse?.location || res?.location || []).find((l: any) => l.id === id);
            return found ? { label: found.name, value: found.id } : null;
          })
          .filter(Boolean);

        const aiPropertyType = (matched.property_type || [])
          .map((id: number) => {
            const found = (res?.property_type || []).find((p: any) => p.id === id);
            return found ? { label: found.name, value: found.id } : null;
          })
          .filter(Boolean);

        const aiFloorPlan = (matched.floor_plan || [])
          .map((val: string) => {
            const found = (res?.floor_plans || []).find((f: any) => f.value === val);
            return found ? { label: found.name.toUpperCase(), value: found.value } : null;
          })
          .filter(Boolean);

        const aiFurnishing = matched.furnishing
          ? (res?.furnishing || [])
              .filter((f: any) => f.value === matched.furnishing)
              .map((f: any) => ({ label: f.name, value: f.value }))
          : [];

        const aiArea = (matched.area || [])
          .map((id: number) => {
            const found = (res?.area || []).find((a: any) => a.id === id);
            return found ? { label: found.name, value: found.id } : null;
          })
          .filter(Boolean);

        setState({
          initialLocation: aiLocation,
          initialPropertyType: aiPropertyType,
          initialArea: aiArea,
          initialDeveloper: [],
        });

        const aiFilterBody: any = {
          ...(matched.location?.length ? { location: aiLocation } : {}),
          ...(matched.area?.length ? { area: aiArea } : {}),
          ...(matched.property_type?.length ? { propertyType: aiPropertyType } : {}),
          ...(matched.floor_plan?.length ? { floorPlan: aiFloorPlan } : {}),
          ...(aiFurnishing.length ? { furnishing: aiFurnishing } : {}),
          ...(matched.max_price ? { priceMaxInput: matched.max_price } : {}),
        };

        await propertyList(1, false, aiFilterBody);
      } else {
        // 2b. validate URL params against filter response
        const urlFilter = buildUrlParamFilter(res);

        setState({
          initialLocation: urlFilter.location || [],
          initialPropertyType: urlFilter.propertyType || [],
          initialArea: [],
          initialDeveloper: urlFilter.developer || [],
          initialFurnishingList: urlFilter.furnishing || [],
        });

        await propertyList(1, false, Object.keys(urlFilter).length ? urlFilter : null);
      }
    } catch (error: any) {
      toastEmitter.emit("error", error?.error || error?.response?.data?.error || "Failed to load properties");
      setState({ loading: false, isFilterLoading: false, isLoadingMore: false });
    }
  };

  const propertyList = async (page = 1, append = false, filterData: any = null) => {
    try {
      setState(append ? { isLoadingMore: true } : { loading: true });

      const body = filterData ? bodyData(filterData) : bodyData({});
      const res: any = await Models.property.list(page, body);
      const compareList: string[] = JSON.parse(localStorage.getItem("compare") || "[]");
      const resultsWithCompare = (res?.results || []).map((item: any) => ({
        ...item,
        is_compare: compareList.includes(item.id),
      }));

      setState({
        propertyList: append ? [...state.propertyList, ...resultsWithCompare] : resultsWithCompare,
        handNext: res?.next,
        page,
        loading: false,
        isFilterLoading: false,
        isLoadingMore: false,
      });
    } catch (error: any) {
      toastEmitter.emit("error", error?.error || error?.response?.data?.error || "Failed to load properties");
      setState({ loading: false, isFilterLoading: false, isLoadingMore: false });
    }
  };

  const dynamicFilterList = async (data: any = null) => {
    try {
      const res: any = await Models.property.dynamicFilter(data ? bodyData(data) : {});
      setFilterLists(res);
    } catch {
      setState({ loading: false, isFilterLoading: false, isLoadingMore: false });
    }
  };

  const filterList = async (page = 1, append = false, data: any = null) => {
    try {
      setState(append ? { isLoadingMore: true } : { isFilterLoading: true });
      await propertyList(page, append, data || {});
    } catch {
      setState({ loading: false, isFilterLoading: false, isLoadingMore: false });
    }
  };

  const bodyData = (data: any = {}) => {
    const body: any = {
      page_size: PROPERTY_LIST_PAGE,
      is_approved: "Yes",
      publish: "Yes",
    };

    if (developerId && !data?.developer?.length) body.developer = developerId;

    if (data?.listingStatus === "For Sale" || data?.listingStatus === "Sale") body.listing_type = ["sale"];
    if (data?.listingStatus === "For Lease" || data?.listingStatus === "Lease") body.listing_type = ["lease"];

    if (data?.propertyType?.length > 0) body.property_type = data.propertyType.map((item: any) => item?.value);
    if (data?.furnishing?.length > 0) body.furnishing = data.furnishing[0]?.value;
    if (data?.search) body.search = data.search;
    if (data?.location?.length > 0) body.location = data.location.map((item: any) => item?.value);
    if (data?.area?.length > 0) body.area = data.area.map((item: any) => item?.value);
    if (data?.project?.length > 0) body.project = data.project.map((item: any) => item?.value);
    if (data?.developer?.length > 0) body.developer = data.developer.map((item: any) => item?.value);
    if (data?.floorPlan?.length > 0) body.floor_plan = data.floorPlan.map((item: any) => item?.value);

    if (data?.priceMinInput) {
      body.min_price = data.priceMinInput;
      body.minimum_price = data.priceMinInput;
    }
    if (data?.priceMaxInput) {
      body.max_price = data.priceMaxInput;
      body.maximum_price = data.priceMaxInput;
    }

    if (data?.bedrooms && data.bedrooms !== "Any") body.bedrooms = removePlus(data.bedrooms);
    if (data?.bathrooms && data.bathrooms !== "Any") body.bathrooms = removePlus(data.bathrooms);
    if (data?.sqftMin) body.sqftMin = data.sqftMin;
    if (data?.sqftMax) body.sqftMax = data.sqftMax;
    if (data?.yearBuiltMin !== undefined && data?.yearBuiltMin !== "") body.yearBuiltMin = data.yearBuiltMin;
    if (data?.yearBuiltMax !== undefined && data?.yearBuiltMax !== "") body.yearBuiltMax = data.yearBuiltMax;

    if (data?.sort) {
      body.sort_by =
        data.sort === "price"
          ? "minimum_price"
          : data.sort === "-price"
          ? "-minimum_price"
          : data.sort;
    }

    return body;
  };

  const clearAllFilters = () => {
    setState({ propertyList: [], loading: true });
    propertyList(1, false, null);
    dynamicFilterList(null);
  };

  const mapViewProps = {
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    properties: state.propertyList,
    categoryList: state.categoryList,
    locationList: state.locationList,
    areaList: state.areaList,
    projectList: state.projectList,
    developerList: state.developerList,
    floorPlanList: state.floorPlanList,
    furnishingList: state.furnishingList,
    listingTypeList: state.listingTypeList,
    bedroomList: state.bedroomList,
    filters: (data: any) => filterList(1, false, data),
    onFilterChange: (data: any) => dynamicFilterList(data),
    loading: state.loading,
    isFilterLoading: state.isFilterLoading,
    isLoadingMore: state.isLoadingMore,
    handNext: state.handNext,
    loadMore: (data: any) => filterList(state.page + 1, true, data),
    updateList: (data: any) => setState({ propertyList: data }),
    clearFilter: clearAllFilters,
    initialSearch: search,
    initialLocation: state.initialLocation,
    initialPropertyType: state.initialPropertyType,
    initialArea: state.initialArea,
    initialDeveloper: state.initialDeveloper,
    initialFurnishingList: state.initialFurnishingList,
    initialListingStatus: type ? (type === "all" ? "All" : type === "sale" ? "For Sale" : "For Lease") : "All",
  };

  return (
    <>
      <div className="hidden xl:block">
        <MapView {...mapViewProps} />
      </div>
      <div className="block xl:hidden">
        <MobileMapView {...mapViewProps} />
      </div>
    </>
  );
}
