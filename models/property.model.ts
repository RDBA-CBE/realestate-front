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

      if (body?.user_preferred_locations) {
        url += `&user_preferred_locations=${encodeURIComponent(body?.user_preferred_locations)}`;
      }

      if (body?.property_url) {
        url += `&property_url=${encodeURIComponent(body.property_url)}`;
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

      const appendParam = (key: string, val: any) => {
        if (Array.isArray(val)) {
          val.forEach((item) => {
            if (item !== undefined && item !== null && item !== "") {
              params.push(`${key}=${encodeURIComponent(item)}`);
            }
          });
        } else if (val !== undefined && val !== null && val !== "") {
          params.push(`${key}=${encodeURIComponent(val)}`);
        }
      };

      if (body?.listing_type) appendParam("listing_type", body.listing_type);
      if (body?.property_type) appendParam("property_type", body.property_type);
      if (body?.furnishing) appendParam("furnishing", body.furnishing);
      if (body?.search) appendParam("search", body.search);
      if (body?.minimum_price) appendParam("minimum_price", body.minimum_price);
      if (body?.maximum_price) appendParam("maximum_price", body.maximum_price);
      if (body?.bedrooms) appendParam("bedrooms", body.bedrooms);
      if (body?.bathrooms) appendParam("bathrooms", body.bathrooms);
      if (body?.location) appendParam("location", body.location);
      if (body?.area) appendParam("area", body.area);
      if (body?.developer) appendParam("developer", body.developer);
      if (body?.project) appendParam("project", body.project);
      if (body?.floor_plan) appendParam("floor_plans_category", body.floor_plan);
      if (body?.sqftMin) appendParam("min_built_up_area", body.sqftMin);
      if (body?.sqftMax) appendParam("max_built_up_area", body.sqftMax);
      if (body?.yearBuiltMin) appendParam("yearBuiltMin", body.yearBuiltMin);
      if (body?.yearBuiltMax) appendParam("yearBuiltMax", body.yearBuiltMax);
      if (body?.sort_by) appendParam("sort_by", body.sort_by);

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

  detailByUrl: (propertyUrl: string) => {
    let promise = new Promise(async (resolve, reject) => {
      const raw = String(propertyUrl || "").trim();
      const cleanSlug = raw
        .replace(/https?:\/\/[^\/]+/, "")
        .replace(/^\/property-list\/?/, "")
        .replace(/^\//, "");

      // 1. First try querying by direct slug parameter if cleanSlug is a single segment property slug
      if (cleanSlug && !cleanSlug.includes("/")) {
        try {
          const directUrl = `properties/?page=1&is_approved=true&publish=true&page_size=1&slug=${encodeURIComponent(cleanSlug)}`;
          const res = await instance().get(directUrl);
          const results = res.data?.results || [];
          const match = results.find(
            (item: any) =>
              item.slug === cleanSlug || String(item.id) === cleanSlug
          );
          if (match) {
            resolve(match);
            return;
          }
        } catch (err) {}
      }

      // 2. Try candidate property_url endpoints and validate exact slug match
      const candidates = Array.from(
        new Set([
          `https://www.boomrealtys.com/property-list/${cleanSlug}`,
          `https://www.boomrealtys.com/${cleanSlug}`,
          raw,
        ])
      ).filter(Boolean);

      for (const candidateUrl of candidates) {
        try {
          const url = `properties/?page=1&is_approved=true&publish=true&page_size=10&property_url=${encodeURIComponent(candidateUrl)}`;
          const res = await instance().get(url);
          const results = res.data?.results || [];
          const match = results.find(
            (item: any) =>
              item.slug === cleanSlug ||
              String(item.id) === cleanSlug ||
              (Array.isArray(item.property_url) &&
                item.property_url.some(
                  (u: string) => u.endsWith(`/${cleanSlug}`) || u === candidateUrl
                ))
          );
          if (match) {
            resolve(match);
            return;
          }
        } catch (err) {
          // continue checking next candidate URL
        }
      }
      reject({ error: "Not found." });
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
