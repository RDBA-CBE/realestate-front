import instance from "@/utils/axios.utils";

const dropdowns = {
     city: (page, body) => {
    let promise = new Promise((resolve, reject) => {
      let url = `locations?page=${page}`;
      if (body?.search) url += `&search=${encodeURIComponent(body.search)}`;
      if (body?.pagination == "No") url += `&pagination=${false}`;
      instance()
        .get(url)
        .then((res) => resolve(res.data))
        .catch((error) => {
          if (error.response) reject(error.response.message);
          else reject(error);
        });
    });
    return promise;
  },
}

export default dropdowns;
