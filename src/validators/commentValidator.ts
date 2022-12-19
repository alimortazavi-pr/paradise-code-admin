import * as yup from "yup";

export const editCommentValidator = yup.object().shape({
  description: yup
    .string()
    .required("لطفا عنوان دسته بندی را وارد کنید")
    .min(3, "عنوان دسته بندی باید حداقل 3 کاراکتر باشد")
    .max(2500, "عنوان دسته بندی باید حداکثر 2500 کاراکتر باشد"),
});
