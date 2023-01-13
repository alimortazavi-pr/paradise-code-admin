import * as yup from "yup";

export const createNotificationValidator = yup.object().shape({
  users: yup.array().min(1, "لطفا حداقل یک کاربر را انتخاب کنید"),
  subject: yup.string().required("لطفا موضوع پیام را وارد کنید"),
  description: yup.string().required("لطفا توضیحات پیام را وارد کنید"),
});
