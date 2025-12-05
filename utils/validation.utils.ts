import moment from "moment";
import * as Yup from "yup";

export const signup = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  password: Yup.string().required("Password is required"),
});

export const signin = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const forgetPassword = Yup.object().shape({
  email: Yup.string().required("Email is required"),
});

export const profileSchema = Yup.object({
  first_name: Yup.string()
  .required("First Name is required"),
  last_name: Yup.string()
  .required("Last Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  // city: Yup.string().required("City is required"),
  // country: Yup.string().required("Country is required"),
  // postal_code: Yup.string()
  //   .matches(/^\d{5}(-\d{4})?$/, "Please enter a valid zip code")
  //   .required("Zip code is required"),
  // address: Yup.string().max(500, "Address me cannot exceed 500 characters"),
});
