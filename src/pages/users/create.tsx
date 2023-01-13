import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, FormElement, Input, Loading, Switch } from "@nextui-org/react";

//Types
import {
  ICreateUser,
  IValidationErrorsCreateUser,
} from "@/ts/interfaces/users.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/users/actions";

//Tools
import { toast } from "react-toastify";

//Validators
import { createUserValidator } from "@/validators/userValidator";
import { CallReceived, CallRemove, Gallery } from "iconsax-react";

type Props = {};
export default function CreateUser({}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<ICreateUser>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    profileImage: "",
    password: "",
    mobileActive: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsCreateUser>({
    paths: [],
    messages: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      profileImage: "",
      password: "",
    },
  });

  //Refs
  const profileImage = useRef<HTMLInputElement>(null);

  //Functions
  function inputHandler(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | FormElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({
      paths: [],
      messages: {
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        profileImage: "",
        password: "",
      },
    });
    setIsLoading(true);
    createUserValidator
      .validate(
        {
          ...form,
          profileImage: profileImage.current?.files?.item(0) || "",
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          const formData = new FormData();
          formData.append("firstName", form.firstName);
          formData.append("lastName", form.lastName);
          formData.append("mobile", form.mobile);
          formData.append("email", form.email);
          formData.append("password", form.password);
          formData.append("mobileActive", form.mobileActive as string);
          formData.append(
            "profileImage",
            profileImage.current?.files?.item(0) || ""
          );
          await dispatch(createUser(formData));
          toast.success("کاربر با موفقیت ایجاد شد", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
          router.push("/users");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsCreateUser = {
          paths: [],
          messages: {
            firstName: "",
            lastName: "",
            mobile: "",
            email: "",
            profileImage: "",
            password: "",
          },
        };
        err.inner.forEach((error: any) => {
          errorsArray = {
            paths: [...errorsArray.paths, error.path],
            messages: { ...errorsArray.messages, [error.path]: error.message },
          };
        });
        setErrors(errorsArray);
        setIsLoading(false);
      });
  }

  return (
    <form className="mb-10 bg-white p-10 rounded-2xl" onSubmit={submit}>
      <div className="grid grid-cols-12 gap-3">
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("firstName") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.firstName}
            name="firstName"
            onChange={inputHandler}
            placeholder="نام"
            helperText={
              errors.paths.includes("firstName")
                ? errors.messages.firstName
                : ""
            }
            helperColor="error"
            label="نام"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("lastName") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.lastName}
            name="lastName"
            onChange={inputHandler}
            placeholder="نام خانوادگی"
            helperText={
              errors.paths.includes("lastName") ? errors.messages.lastName : ""
            }
            helperColor="error"
            label="نام خانوادگی"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("mobile") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.mobile}
            name="mobile"
            onChange={inputHandler}
            placeholder="شماره موبایل"
            helperText={
              errors.paths.includes("mobile") ? errors.messages.mobile : ""
            }
            helperColor="error"
            label="شماره موبایل"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("email") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.email}
            name="email"
            onChange={inputHandler}
            placeholder="ایمیل"
            helperText={
              errors.paths.includes("email") ? errors.messages.email : ""
            }
            helperColor="error"
            label="ایمیل"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("firstName") ? "mb-6" : "mb-3"
          }`}
        >
          <Input.Password
            bordered
            value={form.password}
            name="password"
            onChange={inputHandler}
            placeholder="رمزعبور"
            helperText={
              errors.paths.includes("password") ? errors.messages.password : ""
            }
            helperColor="error"
            label="رمزعبور"
          />
        </div>
        <div
          className={`flex items-center justify-center col-span-12 md:col-span-6 lg:col-span-4`}
        >
          <Switch
            color="success"
            bordered
            shadow
            checked={form.mobileActive == "true" || form.mobileActive == true}
            onChange={(e) =>
              setForm({ ...form, mobileActive: e.target.checked })
            }
            size="xl"
            iconOff={<CallRemove size="18" />}
            iconOn={<CallReceived size="18" />}
          />
        </div>
        <div className="form-control mb-3 col-span-12">
          <label
            className="
    w-full
    h-120
    flex flex-col
    items-center
    justify-center
    bg-white
    rounded-xl
    shadow-md
    tracking-wide
    uppercase
    border border-blue
    cursor-pointer
    hover:bg-blue-400 hover:text-white
    text-blue-400
    ease-linear
    transition-all
    duration-150
    p-6
  "
          >
            <Gallery size="35" />
            <span className="mt-2 text-base leading-normal">
              انتخاب تصویر کاربر
            </span>
            <Input
              bordered
              type="file"
              className="hidden"
              ref={profileImage}
              accept=".png,.jpeg,.jpg"
            />
          </label>
          {errors.paths.includes("profileImage") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.profileImage}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="col-span-12 mt-2"
          color="gradient"
          size={"lg"}
          ghost
        >
          <span className={`${isLoading ? "hidden" : "block"}`}>
            ایجاد کاربر
          </span>
          <Loading
            hidden={!isLoading}
            type="points"
            color="currentColor"
            size="sm"
          />
        </Button>
      </div>
    </form>
  );
}
