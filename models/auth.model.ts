import instance from "@/utils/axios.utils";

const auth = {
  login: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `authentication/login/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  singup: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `register/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  change_password: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `authentication/change-password/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  forget_password: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `/password-reset/request_reset/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  reset_password: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `password-reset/confirm_reset/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  logout: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `authentication/logout/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

  verify_email: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `register/verify-email/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
     return promise;
  },

  resend_token: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `register/resend-verification/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
     return promise;
  },

  request_account_removal_otp: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post("authentication/remove-account/send-otp/", body)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error.response ? error.response?.data : error));
    });
    return promise;
  },

  verify_account_removal_otp: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post("authentication/remove-account/verify-otp/", body)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error.response ? error.response?.data : error));
    });
    return promise;
  },

  remove_account: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post("authentication/remove-account/", body)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error.response ? error.response?.data : error));
    });
    return promise;
  },

  group : () => {
    let promise = new Promise((resolve, reject) => {
      let url = `groups/`;
      instance()
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response?.data);
          } else {
            reject(error);
          }
        });
    });
     return promise;
  }

 

   
};

export default auth;
