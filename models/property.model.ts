import instance from "@/utils/axios.utils";

const properties = {
  list: (page, body) => {
    console.log("✌️body --->", body);
    let promise = new Promise((resolve, reject) => {
      let url = `properties?page=${page}&is_approved=true&publish=true`;

      if (body?.publish == "Yes") {
        url += `&publish=${encodeURIComponent(true)}`;
      }

      if (body?.listing_type) {
        url += `&listing_type=${encodeURIComponent(body?.listing_type)}`;
      }

      if (body?.property_type) {
        url += `&property_type=${encodeURIComponent(body?.property_type)}`;
      }

      if (body?.furnishing) {
        url += `&furnishing=${encodeURIComponent(body?.furnishing)}`;
      }

      if (body?.page_size) {
        url += `&page_size=${encodeURIComponent(body?.page_size)}`;
      }

      if (body?.search) {
        url += `&search=${encodeURIComponent(body?.search)}`;
      }

      if (body?.min_price) {
        url += `&min_price=${encodeURIComponent(body?.min_price)}`;
      }

      if (body?.max_price) {
        url += `&max_price=${encodeURIComponent(body?.max_price)}`;
      }

      if (body?.bedrooms) {
        url += `&bedrooms=${encodeURIComponent(body?.bedrooms)}`;
      }
      if (body?.bathrooms) {
        url += `&bathrooms=${encodeURIComponent(body?.bathrooms)}`;
      }
      if (body?.location) {
        url += `&location=${encodeURIComponent(body?.location)}`;
      }
      if (body?.area) {
        url += `&area=${encodeURIComponent(body?.area)}`;
      }
      if (body?.developer) {
        url += `&developer=${encodeURIComponent(body?.developer)}`;
      }
      if (body?.project) {
        url += `&project=${encodeURIComponent(body?.project)}`;
      }

      if (body?.floor_plan) {
        url += `&floor_plans_category=${encodeURIComponent(body?.floor_plan)}`;
      }

      // if (body?.built_up_area) {
      //   url += `&built_up_area=${encodeURIComponent(body?.built_up_area)}`;
      // }

      if (body?.sqftMin) {
        url += `&min_built_up_area=${encodeURIComponent(body?.sqftMin)}`;
      }
      if (body?.sqftMax) {
        url += `&max_built_up_area=${encodeURIComponent(body?.sqftMax)}`;
      }

      if (body?.yearBuiltMin) {
        url += `&yearBuiltMin=${encodeURIComponent(body?.yearBuiltMin)}`;
      }
      if (body?.yearBuiltMax) {
        url += `&yearBuiltMax=${encodeURIComponent(body?.yearBuiltMax)}`;
      }

      if (body?.sort) {
        url += `&is_approved=${encodeURIComponent(true)}`;
      }

       if (body?.is_approved == "Yes") {
        url += `&is_approved=${encodeURIComponent(true)}`;
      }
      if (body?.developer) {
        url += `&developer=${encodeURIComponent(body?.developer)}`;
      }

      if (body?.sort_by) {
        url += `&sort_by=${encodeURIComponent(body?.sort_by)}`;
      }

      if(body?.user_preferred_locations ){
        url += `&user_preferred_locations=${encodeURIComponent(body?.user_preferred_locations)}`;
      }

      instance()
        .get(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  dynamicFilter: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      const params: string[] = [];

      if (body?.listing_type) params.push(`listing_type=${encodeURIComponent(body.listing_type)}`);
      if (body?.property_type) params.push(`property_type=${encodeURIComponent(body.property_type)}`);
      if (body?.furnishing) params.push(`furnishing=${encodeURIComponent(body.furnishing)}`);
      if (body?.search) params.push(`search=${encodeURIComponent(body.search)}`);
      if (body?.minimum_price) params.push(`minimum_price=${encodeURIComponent(body.minimum_price)}`);
      if (body?.maximum_price) params.push(`maximum_price=${encodeURIComponent(body.maximum_price)}`);
      if (body?.bedrooms) params.push(`bedrooms=${encodeURIComponent(body.bedrooms)}`);
      if (body?.bathrooms) params.push(`bathrooms=${encodeURIComponent(body.bathrooms)}`);
      if (body?.location) params.push(`location=${encodeURIComponent(body.location)}`);
      if (body?.area) params.push(`area=${encodeURIComponent(body.area)}`);
      if (body?.developer) params.push(`developer=${encodeURIComponent(body.developer)}`);
      if (body?.project) params.push(`project=${encodeURIComponent(body.project)}`);
      if (body?.floor_plan) params.push(`floor_plans_category=${encodeURIComponent(body.floor_plan)}`);
      //  if (body?.built_up_area) {
      //   params.push(`built_up_area=${encodeURIComponent(body?.built_up_area)}`);
      // }
      if (body?.sqftMin) params.push(`min_built_up_area=${encodeURIComponent(body.sqftMin)}`);
      if (body?.sqftMax) params.push(`max_built_up_area=${encodeURIComponent(body.sqftMax)}`);
      if (body?.yearBuiltMin) params.push(`yearBuiltMin=${encodeURIComponent(body.yearBuiltMin)}`);
      if (body?.yearBuiltMax) params.push(`yearBuiltMax=${encodeURIComponent(body.yearBuiltMax)}`);
      if (body?.sort_by) params.push(`sort_by=${encodeURIComponent(body.sort_by)}`);

      const url = `properties/filter-options/${params.length > 0 ? `?${params.join("&")}` : ""}`;

      instance()
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  create: (data: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `properties/`;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8;",
        },
      };
      instance()
        .post(url, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  update: (data: any, id: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `properties/${id}/`;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8;",
        },
      };
      instance()
        .patch(url, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  delete: (id: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `properties/${id}/`;

      instance()
        .delete(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  details: (id: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `properties/${id}/`;

      instance()
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  uploadFile: (file: any) => {
    let promise = new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      let url = "/hdd/upload_file";
      const config = {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8;",
        },
      };
      instance()
        .post(url, formData, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },
};

export default properties;
