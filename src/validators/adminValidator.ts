import * as yup from "yup";

export const createAdminValidator = yup.object().shape({
  name: yup
    .string()
    .required("لطفا نام ادمین را وارد کنید")
    .min(3, "نام ادمین باید حداقل 3 کاراکتر باشد")
    .max(50, "نام ادمین باید حداکثر 50 کاراکتر باشد"),
  nickname: yup
    .string()
    .required("لطفا نام خانوادگی ادمین را وارد کنید")
    .min(3, "نام خانوادگی ادمین باید حداقل 3 کاراکتر باشد")
    .max(50, "نام خانوادگی ادمین باید حداکثر 50 کاراکتر باشد"),
  mobile: yup
    .string()
    .required("لطفا شماره موبایل ادمین را وارد کنید")
    .min(11, "شماره موبایل باید حداقل 11 کاراکتر باشد")
    .max(11, "شماره موبایل باید حداکثر 11 کاراکتر باشد"),
  profileImage: yup
    .mixed()
    .test("imageThumb", "فرمت تصویر باید jpeg, png, jpg باشد", (value) => {
      return (
        !value ||
        value.type === "image/jpeg" ||
        value.type === "image/png" ||
        value.type === "image/jpg"
      );
    }),
});

export const editAdminValidator = yup.object().shape({
  name: yup
    .string()
    .required("لطفا نام ادمین را وارد کنید")
    .min(3, "نام ادمین باید حداقل 3 کاراکتر باشد")
    .max(50, "نام ادمین باید حداکثر 50 کاراکتر باشد"),
  nickname: yup
    .string()
    .required("لطفا نام خانوادگی ادمین را وارد کنید")
    .min(3, "نام خانوادگی ادمین باید حداقل 3 کاراکتر باشد")
    .max(50, "نام خانوادگی ادمین باید حداکثر 50 کاراکتر باشد"),
  mobile: yup
    .string()
    .required("لطفا شماره موبایل ادمین را وارد کنید")
    .min(11, "شماره موبایل باید حداقل 11 کاراکتر باشد")
    .max(11, "شماره موبایل باید حداکثر 11 کاراکتر باشد"),
  profileImage: yup
    .mixed()
    .test("imageThumb", "فرمت تصویر باید jpeg, png, jpg باشد", (value) => {
      return (
        !value ||
        value.type === "image/jpeg" ||
        value.type === "image/png" ||
        value.type === "image/jpg"
      );
    }),
});
