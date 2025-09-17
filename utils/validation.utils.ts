import moment from "moment";
import * as Yup from "yup";

export const createCoupon = Yup.object().shape({
  code: Yup.string().required("Discount code is required"),
  discount_type: Yup.string().required("Discount type is required"),
  discount_value: Yup.string().required("Discount value is required"),
  valid_from: Yup.date()
    .required("Valid from date is required")
    .typeError("Valid from date must be a valid date"),
  valid_to: Yup.date()
    .required("Valid to date is required")
    .typeError("Valid to date must be a valid date"),
});

