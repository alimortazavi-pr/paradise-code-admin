import * as yup from "yup";

export const createEpisodeValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان جلسه را وارد کنید")
    .min(3, "عنوان جلسه باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان جلسه باید حداکثر 50 کاراکتر باشد"),
  course: yup.string().required("لطفا دوره را انتخاب کنید"),
  slug: yup.string().required("لطفا اسلاگ جلسه را وارد کنید"),
  description: yup.string().required("لطفا توضیحات جلسه را وارد کنید"),
  status: yup.string().required("لطفا وضعیت جلسه را وارد کنید"),
  videoUrl: yup
    .mixed()
    .test("videoUrl", "فرمت ویدیو باید mp4 , mkv باشد", (value) => {
      return (
        value && (value.type === "video/mp4" || value.type === "video/mkv")
      );
    }),
});

export const editEpisodeValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان جلسه را وارد کنید")
    .min(3, "عنوان جلسه باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان جلسه باید حداکثر 50 کاراکتر باشد"),
  course: yup.string().required("لطفا دوره را انتخاب کنید"),
  slug: yup.string().required("لطفا اسلاگ جلسه را وارد کنید"),
  description: yup.string().required("لطفا توضیحات جلسه را وارد کنید"),
  status: yup.string().required("لطفا وضعیت جلسه را وارد کنید"),
  videoUrl: yup
    .mixed()
    .test("videoUrl", "فرمت ویدیو باید mp4 , mkv باشد", (value) => {
      return !value || value.type === "video/mp4" || value.type === "video/mkv";
    }),
});
