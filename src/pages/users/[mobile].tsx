import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, FormElement, Input, Loading, Switch } from "@nextui-org/react";

//Types
import {
  IEditUser,
  ISingleUser,
  IValidationErrorsEditUser,
} from "@/ts/interfaces/users.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { editUser } from "@/store/users/actions";

//Components
import { CallReceived, CallRemove, Camera } from "iconsax-react";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Validators
import { editUserValidator } from "@/validators/userValidator";

type Props = {
  user: ISingleUser;
};
export default function EditUser({ user }: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditUser>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    profileImage: "",
    password: "",
    mobileActive: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsEditUser>({
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

  //Effects
  useEffect(() => {
    setForm({
      ...user,
      profileImage: user.profileImage || "",
      mobileActive: user.mobileActive as boolean,
    });
  }, [user]);

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
    editUserValidator
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
          await dispatch(editUser(formData, router.query.mobile as string));
          toast.success("کاربر با موفقیت ویرایش شد", {
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
        let errorsArray: IValidationErrorsEditUser = {
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
        <div className="col-span-12 flex justify-center mb-5">
          <div className="relative w-28 h-28">
            {user.profileImage ? (
              <Image
                src={`https://api.paradisecode.org/static${user.profileImage}`}
                alt=""
                layout="fill"
                className="object-contain rounded-full"
              />
            ) : (
              <Image
                src={`https://api.paradisecode.org/static/images/user.png`}
                alt=""
                layout="fill"
                className="object-contain rounded-full"
              />
            )}
            <label className="absolute top-0 w-full h-full rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-20 hover:bg-gray-300 duration-200 cursor-pointer z-20">
              <Input
                bordered
                type="file"
                className="hidden"
                ref={profileImage}
                accept=".png,.jpeg,.jpg"
              />
              <Camera className="text-gray-800 opacity-70" />
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
        </div>
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
        <Button
          disabled={isLoading}
          type="submit"
          className="col-span-12 mt-2"
          color="warning"
          size={"lg"}
          ghost
        >
          <span className={`${isLoading ? "hidden" : "block"}`}>
            ویرایش کاربر
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  let user: ISingleUser | object = {};
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const userRes = await api.get(`/admin/users/${params?.mobile}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      user = userRes.data.user;
    }
  } catch (error: any) {
    console.log(error.response?.response || error);
  }

  return {
    props: {
      user: user,
    },
  };
};
