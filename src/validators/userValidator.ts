import * as yup from "yup";

export const createUserValidator = yup.object().shape({
  firstName: yup
    .string()
    .required("لطفا نام کاربر را وارد کنید")
    .min(3, "نام کاربر باید حداقل 3 کاراکتر باشد")
    .max(50, "نام کاربر باید حداکثر 50 کاراکتر باشد"),
  lastName: yup
    .string()
    .required("لطفا نام خانوادگی کاربر را وارد کنید")
    .min(3, "نام خانوادگی کاربر باید حداقل 3 کاراکتر باشد")
    .max(50, "نام خانوادگی کاربر باید حداکثر 50 کاراکتر باشد"),
  mobile: yup
    .string()
    .required("لطفا شماره موبایل کاربر را وارد کنید")
    .min(11, "شماره موبایل باید حداقل 11 کاراکتر باشد")
    .max(11, "شماره موبایل باید حداکثر 11 کاراکتر باشد"),
  email: yup.string().email("فرمت ایمیل نادرست است").nullable(true),
  password: yup
    .string()
    .required("لطفا رمزعبور کاربر را وارد کنید")
    .min(8, "رمزعبور باید حداقل 8 کاراکتر باشد"),
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

export const editUserValidator = yup.object().shape({
  firstName: yup
    .string()
    .required("لطفا نام کاربر را وارد کنید")
    .min(3, "نام کاربر باید حداقل 3 کاراکتر باشد")
    .max(50, "نام کاربر باید حداکثر 50 کاراکتر باشد"),
  lastName: yup
    .string()
    .required("لطفا نام خانوادگی کاربر را وارد کنید")
    .min(3, "نام خانوادگی کاربر باید حداقل 3 کاراکتر باشد")
    .max(50, "نام خانوادگی کاربر باید حداکثر 50 کاراکتر باشد"),
  mobile: yup
    .string()
    .required("لطفا شماره موبایل کاربر را وارد کنید")
    .min(11, "شماره موبایل باید حداقل 11 کاراکتر باشد")
    .max(11, "شماره موبایل باید حداکثر 11 کاراکتر باشد"),
  password: yup
    .string()
    .min(8, "رمزعبور باید حداقل 8 کاراکتر باشد")
    .nullable(true),
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
