"use client";
import { PropertyView } from "@/components/real-estate/property-list/property3And4Column/property-view";
import { PropertyView1 } from "@/components/real-estate/property-list/property3And4Column/property-view1";
import { PropertyView2 } from "@/components/real-estate/property-list/property3And4Column/property-view2";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import {
  Dropdown,
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

  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    handNext: null,
    page: 1,
    isLoadingMore: false,
    categoryList: [],
    minPrice: 0,
    maxPrice: 0,
    propertyTypeParams: "",
  });

  const initialLoadRef = useRef(true);
  const filterTimeoutRef = useRef(null);

  useEffect(() => {
    let filterData: any = null;
    if (search || type) {
      filterData = {};
      if (search) filterData.search = search;
      if (type) filterData.listingStatus = type == "All" ? "All" : type.charAt(0).toUpperCase() + type.slice(1);
    }

    propertyList(1, false, filterData);
    categoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type]);

  useEffect(() => {
    if (developerId) {
      developerDetail();
    }
  }, [developerId]);

  useEffect(() => {
    if (propertyType) {
      categoryList();
    }
  }, [propertyType]);

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

      const minPrice = formatNumber(res?.min_price);
      const maxPrice = formatNumber(res?.max_price);

      setState({
        propertyList: append
          ? [...state.propertyList, ...resultsWithCompare]
          : resultsWithCompare,
        handNext: res?.next,
        page: page,
        loading: false,
        isLoadingMore: false,
        minPrice: filterData ? state.minPrice : minPrice,
        maxPrice: filterData ? state.maxPrice : maxPrice,
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

  const categoryList = async () => {
    try {
      const res: any = await Models.category.list(1, {});
      const dropdown = Dropdown(res?.results, "name");
      setState({
        categoryList: dropdown,
      });

      if (propertyType) {
        const find = res?.results?.filter((item) => item?.id == propertyType);
      const dropdown = Dropdown(find, "name");

        setState({ propertyTypeParams: dropdown });
      }
    } catch (error) {
      console.log("✌️error --->", error);
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
    const bodyData: any = {};

    bodyData.is_approved = "Yes";

    if (developerId) {
      bodyData.developer = developerId;
    }

    if (data?.listingStatus) {
      if (data?.listingStatus != "All") {
        bodyData.listing_type = [data?.listingStatus.toLowerCase()];
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

    if (data?.priceRange?.length > 0) {
      bodyData.minPrice = data?.priceRange[0];
    }

    if (data?.priceRange?.length >= 1) {
      bodyData.maxPrice = data?.priceRange[1];
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
    if (data?.location) {
      bodyData.location = data?.location;
    }
    if (data?.sqftMin) {
      bodyData.sqftMin = data?.sqftMin;
    }
    if (data?.sqftMax) {
      bodyData.sqftMax = data?.sqftMax;
    }
    if (data?.yearBuiltMin != "") {
      bodyData.yearBuiltMin = data?.yearBuiltMin;
    }
    if (data?.yearBuiltMax != "") {
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
        filters={(data) => filterList(1, false, data)}
        loading={state.loading}
        isLoadingMore={state.isLoadingMore}
        handNext={state.handNext}
        loadMore={(data) => {
          filterList(state.page + 1, true, data);
        }}
        updateList={(data) => setState({ propertyList: data })}
        clearFilter={clearAllFilters}
        initialSearch={search}
        initialListingStatus={type ? (type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)) : "All"}
      />
    </div>
  );
}
