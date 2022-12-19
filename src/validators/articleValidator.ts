import * as yup from "yup";

export const createArticleValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان مقاله را وارد کنید")
    .min(3, "عنوان مقاله باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان مقاله باید حداکثر 50 کاراکتر باشد"),
  category: yup.string().required("لطفا دسته بندی را وارد کنید"),
  slug: yup.string().required("لطفا اسلاگ مقاله را وارد کنید"),
  content: yup.string().required("لطفا محتوا مقاله را وارد کنید"),
  readingTime: yup.string().required("لطفا قیمت مقاله را وارد کنید"),
  status: yup.string().required("لطفا وضعیت مقاله را وارد کنید"),
  imageThumb: yup
    .mixed()
    .test("imageThumb", "فرمت تصویر باید jpeg, png, jpg باشد", (value) => {
      return (
        !value ||
        (value.type === "image/jpeg" ||
          value.type === "image/png" ||
          value.type === "image/jpg")
      );
    }),
  introductionVideo: yup
    .mixed()
    .test("introductionVideo", "فرمت ویدیو باید mp4 , mkv باشد", (value) => {
      return (
        !value || (value.type === "video/mp4" || value.type === "video/mkv")
      );
    }),
});

export const editArticleValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان مقاله را وارد کنید")
    .min(3, "عنوان مقاله باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان مقاله باید حداکثر 50 کاراکتر باشد"),
  category: yup.string().required("لطفا دسته بندی را وارد کنید"),
  slug: yup.string().required("لطفا اسلاگ مقاله را وارد کنید"),
  content: yup.string().required("لطفا محتوا مقاله را وارد کنید"),
  readingTime: yup.string().required("لطفا قیمت مقاله را وارد کنید"),
  status: yup.string().required("لطفا وضعیت مقاله را وارد کنید"),
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
