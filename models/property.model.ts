import instance from "@/utils/axios.utils";

const properties = {
  list: (page, body) => {
    console.log("✌️body --->", body);
    let promise = new Promise((resolve, reject) => {
      let url = `properties?page=${page}`;

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

      if (body?.minPrice) {
        url += `&min_price=${encodeURIComponent(body?.minPrice)}`;
      }

      if (body?.maxPrice) {
        url += `&max_price=${encodeURIComponent(body?.maxPrice)}`;
      }

      if (body?.bedrooms) {
        url += `&bedrooms=${encodeURIComponent(body?.bedrooms)}`;
      }
      if (body?.bathrooms) {
        url += `&bathrooms=${encodeURIComponent(body?.bathrooms)}`;
      }
      if (body?.location) {
        url += `&city=${encodeURIComponent(body?.location)}`;
      }
      if (body?.sqftMin) {
        url += `&min_area=${encodeURIComponent(body?.sqftMin)}`;
      }
      if (body?.sqftMax) {
        url += `&max_area=${encodeURIComponent(body?.sqftMax)}`;
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


      if (body?.sort_by) {
        url += `&sort_by=${encodeURIComponent(body?.sort_by)}`;
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
