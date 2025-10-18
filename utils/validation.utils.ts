import moment from "moment";
import * as Yup from "yup";

export const signup= Yup.object().shape({
  email: Yup.string().required("Email is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  password: Yup.string().required("Password is required"),


});

export const signin = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),


});

