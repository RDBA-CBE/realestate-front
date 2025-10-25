"use client";
import { MapView } from "@/components/real-estate/property-list/property3And4Column/property-mapview";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import {
  Dropdown,
  formatNumber,
  removePlus,
  useSetState,
} from "@/utils/function.utils";
import { useEffect } from "react";

export default function Page() {
  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    handNext: null,
    page: 1,
    isLoadingMore: false,
    categoryList: [],
    minPrice: 0,
    maxPrice: 0,
  });

  useEffect(() => {
    // propertyList();
    categoryList();
  }, []);

  const propertyList = async (page = 1, append = false) => {
    try {
      if (append) {
        setState({ isLoadingMore: true });
      } else {
        setState({ loading: true });
      }

      const bodys = bodyData(null);

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
      console.log("✌️res --->", res);

      const dropdown = Dropdown(res?.results, "name");
      console.log("✌️droprdown --->", dropdown);

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
      console.log("✌️bodys --->", bodys);
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
      setState({ loading: false });
    }
  };

  const bodyData = (data) => {
    const body: any = {};

    if (data?.listingStatus) {
      if (data?.listingStatus != "All") {
        body.listing_type = [data?.listingStatus.toLowerCase()];
      }
    }
    if (data?.propertyType?.length > 0) {
      body.property_type = data?.propertyType?.[0]?.value;
    }

    if (data?.furnishing?.length > 0) {
      body.furnishing = data?.furnishing?.[0]?.value;
    }

    if (data?.search) {
      body.search = data?.search;
    }

    if (data?.priceRange?.length > 0) {
      body.minPrice = data?.priceRange[0];
    }

    if (data?.priceRange?.length >= 1) {
      body.maxPrice = data?.priceRange[1];
    }

    if (data?.bedrooms) {
      if (data?.bedrooms != "Any") {
        body.bedrooms = removePlus(data?.bedrooms);
      }
    }
    if (data?.bathrooms) {
      if (data?.bathrooms != "Any") {
        body.bathrooms = removePlus(data?.bathrooms);
      }
    }
    if (data?.location) {
      body.location = data?.location;
    }
    if (data?.sqftMin) {
      body.sqftMin = data?.sqftMin;
    }
    if (data?.sqftMax) {
      body.sqftMax = data?.sqftMax;
    }
    if (data?.yearBuiltMin != "") {
      body.yearBuiltMin = data?.yearBuiltMin;
    }
    if (data?.yearBuiltMax != "") {
      body.yearBuiltMax = data?.yearBuiltMax;
    }
   if (data?.sort) {
      if (data?.sort == "price") {
        body.sort_by = "minimum_price";
      } else if (data?.sort == "-price") {
        body.sort_by = "-minimum_price";
      } else {
        body.sort_by = data?.sort;
      }
    }

    body.page_size = PROPERTY_LIST_PAGE;
    body.is_approved = "Yes";
    return body;
  };

  return (
    <div>
      <MapView
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
        clearFilter={()=>propertyList()}
      />
    </div>
  );
}
