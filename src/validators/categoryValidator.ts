import * as yup from "yup";

export const createCategoryValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان دسته بندی را وارد کنید")
    .min(3, "عنوان دسته بندی باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان دسته بندی باید حداکثر 50 کاراکتر باشد"),
});

export const editCategoryValidator = yup.object().shape({
  title: yup
    .string()
    .required("لطفا عنوان دسته بندی را وارد کنید")
    .min(3, "عنوان دسته بندی باید حداقل 3 کاراکتر باشد")
    .max(50, "عنوان دسته بندی باید حداکثر 50 کاراکتر باشد"),
});
