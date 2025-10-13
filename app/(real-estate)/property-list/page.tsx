"use client";
import { PropertyView } from "@/components/real-estate/property-list/property3And4Column/property-view";
import { PropertyView1 } from "@/components/real-estate/property-list/property3And4Column/property-view1";
import { PropertyView2 } from "@/components/real-estate/property-list/property3And4Column/property-view2";
import Models from "@/imports/models.import";
import { PROPERTY_LIST_PAGE } from "@/utils/constant.utils";
import { useSetState } from "@/utils/function.utils";
import { useEffect, useCallback } from "react";

export default function Page() {
  const [state, setState] = useSetState({
    propertyList: [],
    loading: false,
    handNext: null,
    page: 1,
    isLoadingMore: false,
  });

  useEffect(() => {
    propertyList();
  }, []);

  const propertyList = async (page = 1, append = false) => {
    try {
      if (append) {
        setState({ isLoadingMore: true });
      } else {
        setState({ loading: true });
      }

      const body = {
        page_size: PROPERTY_LIST_PAGE,
      };
      const res: any = await Models.property.list(page, body);

      setState({
        propertyList: append
          ? [...state.propertyList, ...res?.results]
          : res?.results,
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

      const body = bodyData(data);
      const res: any = await Models.property.list(page, body);

      setState({
        propertyList: append
          ? [...state.propertyList, ...res?.results]
          : res?.results,
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
    let body: any = {};

    if (data?.search) {
      body.search = data?.search;
    }

    if (data?.minPrice) {
      body.minPrice = data?.minPrice;
    }

    if (data?.maxPrice) {
      body.maxPrice = data?.maxPrice;
    }

    if (data?.bedrooms) {
      body.bedrooms = data?.bedrooms;
    }
    if (data?.bathrooms) {
      body.bathrooms = data?.bathrooms;
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
    if (data?.yearBuiltMin) {
      body.yearBuiltMin = data?.yearBuiltMin;
    }
    if (data?.yearBuiltMax) {
      body.yearBuiltMax = data?.yearBuiltMax;
    }

    body.page_size = PROPERTY_LIST_PAGE;
    return body;
  };

  return (
    <div>
      <PropertyView
        properties={state.propertyList}
        filters={(data) => filterList(1,false,data)}
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
