import * as yup from "yup";

export const createLearningValidator = yup.object().shape({
  user: yup.string().required("لطفا آیدی کاربر را وارد کنید"),
  course: yup.string().required("لطفا آیدی دوره را وارد کنید"),
});

export const editLearningValidator = yup.object().shape({
  user: yup.string().required("لطفا آیدی کاربر را وارد کنید"),
  course: yup.string().required("لطفا آیدی دوره را وارد کنید"),
});
