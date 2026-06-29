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
  removeSpace,
  useSetState,
} from "@/utils/function.utils";
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
    initialArea: [],
  });

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);

  useEffect(() => {
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developerId, search, type, propertyType, locationParam, ai_location, furnishing]);

  useEffect(() => {
    if (developerId) {
      developerDetail();
    }
  }, [developerId]);

  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  }, []);

  // Build URL param filter object after validating against dynamic filter response
  const buildUrlParamFilter = (res: any) => {
    const urlFilter: any = {};

    // validate & map location param
    if (locationParam) {
      const locationId = Number(locationParam);
      const matched = (res?.location || []).find(
        (item: any) => item.id === locationId
      );
      if (matched)
        urlFilter.location = [{ label: matched.name, value: matched.id }];
    }

    // validate & map propertyType param
    if (propertyType) {
      const typeVal = propertyType.toLowerCase();
      const matched = (res?.property_type || []).find(
        (item: any) =>
          String(item.id) === typeVal ||
          (item.name && item.name.toLowerCase() === typeVal)
      );
      if (matched)
        urlFilter.propertyType = [{ label: matched.name, value: matched.id }];
    }

    // search param
    if (search) urlFilter.search = search;

    // listing type param
    if (type && type !== "all") {
      urlFilter.listingStatus = type === "sale" ? "For Sale" : "For Lease";
    }

    if (furnishing) {
      const matched = (res?.furnishing || []).find(
        (item: any) => item.value === furnishing
      );
      if(matched){
      urlFilter.furnishing = [{ label: matched.name, value: matched.value }];
      }
    }

    if (developerId) {
      const typeId = Number(developerId);
      const matched = (res?.developer || []).find(
        (item: any) => item.id == typeId
      );
      if (matched)
        urlFilter.developer = [{ label: matched.name, value: matched.id }];
    }

    return urlFilter;
  };

  // Progressively match ai_ params against dynamicFilter response step by step
  // Each step passes previously matched ids to narrow down next filter
  const buildAiFilter = async () => {
    const matched: any = {};

    // Step 1: match ai_location by name
    if (ai_location) {
      const res1: any = await Models.property.dynamicFilter({});
      const loc = (res1?.location || []).find(
        (item: any) =>
          item.name?.toLowerCase() == ai_location.toLowerCase() ||
          item.id == ai_location
      );
      console.log("loc", loc);
      if (loc) matched.location = [loc.id];
    }

    if (ai_area) {
      console.log("ai_area",ai_area)
      const res2: any = await Models.property.dynamicFilter(
        matched.location ? { location: matched.location } : {}
      );
      console.log("pt_auhudf",res2)
      
      const pt = (res2?.area || []).find(
        (item: any) =>
          item.name == (ai_area) 
      );
      console.log("matchdsf",pt)

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
          item.name?.toLowerCase() == ai_propertyType.toLowerCase() ||
          item.id == ai_propertyType
      );
      if (pt) matched.property_type = [pt.id];
    }

    // Step 3: match ai_floor_plans_category by value/name
    if (ai_floor_plans_category) {
      const res3: any = await Models.property.dynamicFilter({
        ...(matched.location ? { location: matched.location } : {}),
        ...(matched.area ? { area: matched.area } : {}),

        ...(matched.property_type
          ? { property_type: matched.property_type }
          : {}),
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

        ...(matched.property_type
          ? { property_type: matched.property_type }
          : {}),
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

      ...(matched.property_type
        ? { property_type: matched.property_type }
        : {}),
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

      const locationList = (res?.location || []).map((item: any) => ({
        label: item.name,
        value: item.id,
        count: item.count,
      }));
      const categoryList = (res?.property_type || []).map((item: any) => ({
        label: item.name,
        value: item.id,
        count: item.count,
      }));
      const furnishingList = (res?.furnishing || []).map((item: any) => ({
        label: item.name,
        value: item.value,
        count: item.count,
      }));
      const listingTypeList = (res?.listing_type || []).map((item: any) => ({
        label: item.name,
        value: item.value,
        count: item.count,
      }));
      const bedroomList = (res?.bedrooms || [])
        .filter((item: any) => item.value > 0)
        .map((item: any) => String(item.value));
      const areaList = (res?.area || [])
        .filter((item: any) => item.id !== null)
        .map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.count,
        }));
      const projectList = (res?.project || []).map((item: any) => ({
        label: item.name,
        value: item.id,
        count: item.count,
      }));
      const developerList = (res?.developer || []).map((item: any) => ({
        label: item.name,
        value: item.id,
        count: item.count,
      }));
      const floorPlanList = (res?.floor_plans || []).map((item: any) => ({
        label: item.name.toUpperCase(),
        value: item.value,
        count: item.count,
      }));

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
      });

      if (hasAiParams) {
        // 2a. Build ai filter progressively
        const { matched, finalFilterResponse } = await buildAiFilter();

        // Map matched ids back to label/value format for UI
        const aiLocation = (matched.location || [])
          .map((id: number) => {
            const found = (
              finalFilterResponse?.location ||
              res?.location ||
              []
            ).find((l: any) => l.id === id);
            return found ? { label: found.name, value: found.id } : null;
          })
          .filter(Boolean);

          // const aiArea = (matched.area || [])
          // .map((id: number) => {
          //   const found = (
          //     finalFilterResponse?.area ||
          //     res?.area ||
          //     []
          //   ).find((l: any) => l.id === id);
          //   return found ? { label: found.name, value: found.id } : null;
          // })
          // .filter(Boolean);

        const aiPropertyType = (matched.property_type || [])
          .map((id: number) => {
            const found = (res?.property_type || []).find(
              (p: any) => p.id === id
            );
            return found ? { label: found.name, value: found.id } : null;
          })
          .filter(Boolean);

        const aiFloorPlan = (matched.floor_plan || [])
          .map((val: string) => {
            const found = (res?.floor_plans || []).find(
              (f: any) => f.value === val
            );
            return found
              ? { label: found.name.toUpperCase(), value: found.value }
              : null;
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

          ...(matched.property_type?.length
            ? { propertyType: aiPropertyType }
            : {}),
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
          initialDeveloper: urlFilter.developer || [],
          initialFurnishingList: urlFilter.furnishing || [],
        });

        const hasUrlFilters = Object.keys(urlFilter).length > 0;
        await propertyList(1, false, hasUrlFilters ? urlFilter : null);
      }
    } catch (error) {
      const msg =
        error?.error ||
        error?.response?.data?.error ||
        "Failed to initialize filters";
      toastEmitter.emit("error", msg);
      setState({ loading: false });
    }
  };

  const propertyList = async (page = 1, append = false, filterData = null) => {
    console.log("filterData",filterData)

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
      const msg =
        error?.error ||
        error?.response?.data?.error ||
        "Failed to load properties";
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
        locationList: (res?.location || []).map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.count,
        })),
        categoryList: (res?.property_type || []).map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.count,
        })),
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
        bedroomList: (res?.bedrooms || [])
          .filter((item: any) => item.value > 0)
          .map((item: any) => String(item.value)),
        areaList: (res?.area || [])
          .filter((item: any) => item.id !== null)
          .map((item: any) => ({
            label: item.name,
            value: item.id,
            count: item.count,
          })),
        projectList: (res?.project || []).map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.count,
        })),
        developerList: (res?.developer || []).map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.count,
        })),
        floorPlanList: (res?.floor_plans || []).map((item: any) => ({
          label: item.name.toUpperCase(),
          value: item.value,
          count: item.count,
        })),
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

    if (data.prefferedLocation) {
      console.log(
        "bodyData sending prefferedLocation:",
        data.prefferedLocation
      ); // Debug log
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
      console.log(
        "bodyData sending property_type:",
        data.propertyType.map((item) => item?.value)
      ); // Debug log
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
      console.log(
        "bodyData sending location:",
        data.location.map((item) => item?.value)
      ); // Debug log
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
        initialPropertyType={state.initialPropertyType}
        initialArea={state.initialArea}
        initialFurnishingList = {state.initialFurnishingList}
        initialListingStatus={
          type
            ? type === "all"
              ? "All"
              : type === "sale"
              ? "For Sale"
              : "For Lease"
            : "All"
        }
      />
    </div>
  );
}
