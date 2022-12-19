import * as yup from "yup";

export const sendCodeValidator = yup.object().shape({
  mobile: yup
    .string()
    .required("لططفا شماره موبایل خود را وارد کنید")
    .min(11, "فرمت شماره موبایل نادرست است")
    .max(11, "فرمت شماره موبایل نادرست است"),
});

export const signInValidator = yup.object().shape({
  mobile: yup
    .string()
    .required("لططفا شماره موبایل خود را وارد کنید")
    .min(11, "فرمت شماره موبایل نادرست است")
    .max(11, "فرمت شماره موبایل نادرست است"),
  code: yup.string().required("لطفا کد ارسالی را وارد کنید"),
});
