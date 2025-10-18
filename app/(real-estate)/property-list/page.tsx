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
import { useEffect, useCallback } from "react";

export default function Page() {
  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    handNext: null,
    page: 1,
    isLoadingMore: false,
    categoryList: [],
    minPrice: 0,
    maxPrice: 1000000,
  });

  useEffect(() => {
    propertyList();
    categoryList();
  }, []);

console.log('✌️propertyList --->', state.propertyList);

  const propertyList = async (page = 1, append = false) => {
    try {
      if (append) {
        setState({ isLoadingMore: true });
      } else {
        setState({ loading: true });
      }

      const bodys = {
        page_size: PROPERTY_LIST_PAGE,
      };
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
        minPrice,
        maxPrice,
      });
    } catch (error) {
      setState({
        loading: false,
        isLoadingMore: false,
      });
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
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const filterList = async (page = 1, append = false, data) => {
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
      setState({ loading: false });
    }
  };

  const bodyData = (data) => {
    const bodyData: any = {};

    if (data?.listingStatus) {
      if (data?.listingStatus != "All") {
        bodyData.listing_type = [data?.listingStatus.toLowerCase()];
      }
    }
    if (data?.propertyType?.length > 0) {
      bodyData.property_type = data?.propertyType?.[0]?.value;
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
      bodyData.sort_by = data?.sort;
    }

    bodyData.page_size = PROPERTY_LIST_PAGE;
    bodyData.is_approved = "Yes";
    return bodyData;
  };

  return (
    <div>
      <PropertyView
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
      />
    </div>
  );
}
