import * as yup from "yup";

export const createCourseValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان دوره را وارد کنید")
    .min(3, "عنوان دوره باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان دوره باید حداکثر 50 کاراکتر باشد"),
  category: yup.string().required("لطفا دسته بندی را وارد کنید"),
  slug: yup.string().required("لطفا اسلاگ دوره را وارد کنید"),
  description: yup.string().required("لطفا توضیحات دوره را وارد کنید"),
  shortDescription: yup.string().required("لطفا توضیحات دوره را وارد کنید").max(400, "توضیحات کوتاه دوره باید حداقل 400 کاراکتر باشد"),
  price: yup
    .string()
    .required("لطفا قیمت دوره را وارد کنید")
    .max(9, "قیمت دوره باید حداکثر 9 کاراکتر باشد"),
  status: yup.string().required("لطفا وضعیت دوره را وارد کنید"),
  imageThumb: yup
    .mixed()
    .test("imageThumb", "فرمت تصویر باید jpeg, png, jpg باشد", (value) => {
      return (
        value &&
        (value.type === "image/jpeg" ||
          value.type === "image/png" ||
          value.type === "image/jpg")
      );
    }),
  introductionVideo: yup
    .mixed()
    .test("introductionVideo", "فرمت ویدیو باید mp4 , mkv باشد", (value) => {
      return (
        value && (value.type === "video/mp4" || value.type === "video/mkv")
      );
    }),
});

export const editCourseValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان دوره را وارد کنید")
    .min(3, "عنوان دوره باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان دوره باید حداکثر 50 کاراکتر باشد"),
  category: yup.string().required("لطفا دسته بندی را وارد کنید"),
  slug: yup.string().required("لطفا اسلاگ دوره را وارد کنید"),
  description: yup.string().required("لطفا توضیحات دوره را وارد کنید"),
  shortDescription: yup.string().required("لطفا توضیحات کوتاه دوره را وارد کنید").max(400, "توضیحات کوتاه دوره باید حداقل 400 کاراکتر باشد"),
  price: yup
    .string()
    .required("لطفا قیمت دوره را وارد کنید")
    .max(9, "قیمت دوره باید حداکثر 9 کاراکتر باشد"),
  status: yup.string().required("لطفا وضعیت دوره را وارد کنید"),
  imageThumb: yup
    .mixed()
    .test("imageThumb", "فرمت تصویر باید jpeg, png, jpg باشد", (value) => {
      return (
        !value ||
        value.type === "image/jpeg" ||
        value.type === "image/png" ||
        value.type === "image/jpg"
      );
    }),
  introductionVideo: yup
    .mixed()
    .test("introductionVideo", "فرمت ویدیو باید mp4 , mkv باشد", (value) => {
      return !value || value.type === "video/mp4" || value.type === "video/mkv";
    }),
});
