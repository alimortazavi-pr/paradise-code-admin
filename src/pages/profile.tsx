import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, FormElement, Input, Loading } from "@nextui-org/react";

//Types
import {
  IEditAdmin,
  ISingleAdmin,
  IValidationErrorsEditAdmin,
} from "@/ts/interfaces/admins.interface";
import { theProfilePropsType } from "@/ts/types/admins.type";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { editProfile } from "@/store/auth/actions";

//Components
import { Camera } from "iconsax-react";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Validators
import { editAdminValidator } from "@/validators/adminValidator";

export default function TheProfile({ profile }: theProfilePropsType) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditAdmin>({
    name: "",
    nickname: "",
    mobile: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsEditAdmin>({
    paths: [],
    messages: {
      name: "",
      nickname: "",
      mobile: "",
      profileImage: "",
    },
  });

  //Refs
  const profileImage = useRef<HTMLInputElement>(null);

  //Effects
  useEffect(() => {
    setForm({
      ...profile,
      profileImage: profile.profileImage || "",
    });
  }, [profile]);

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
        name: "",
        nickname: "",
        mobile: "",
        profileImage: "",
      },
    });
    setIsLoading(true);
    editAdminValidator
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
          formData.append("name", form.name);
          formData.append("nickname", form.nickname);
          formData.append("mobile", form.mobile);
          formData.append(
            "profileImage",
            profileImage.current?.files?.item(0) || ""
          );
          await dispatch(editProfile(formData));
          toast.success("پروفایل شما با موفقیت ویرایش شد", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          router.push("/");
          setIsLoading(false);
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsEditAdmin = {
          paths: [],
          messages: {
            name: "",
            nickname: "",
            mobile: "",
            profileImage: "",
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
            {profile.profileImage ? (
              <Image
                src={`https://api.paradisecode.org/static${profile.profileImage}`}
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
              <Camera className="text-gray-800 opacity-70" size="24" />
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
            errors.paths.includes("name") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.name}
            name="name"
            onChange={inputHandler}
            placeholder="نام"
            helperText={
              errors.paths.includes("name") ? errors.messages.name : ""
            }
            helperColor="error"
            label="نام"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("nickname") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.nickname}
            name="nickname"
            onChange={inputHandler}
            placeholder="لقب"
            helperText={
              errors.paths.includes("nickname") ? errors.messages.nickname : ""
            }
            helperColor="error"
            label="لقب"
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
        <Button
          disabled={isLoading}
          type="submit"
          className="col-span-12 mt-2"
          color="success"
          size={"lg"}
          ghost
        >
          <span className={`${isLoading ? "hidden" : "block"}`}>
            ویرایش پروفایل
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
  let profile: ISingleAdmin | object = {};
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const profileRes = await api.get(`/admin/profile`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      profile = profileRes.data.profile;
    }
  } catch (error: any) {
    console.log(error.response?.response || error);
  }

  return {
    props: {
      profile: profile,
    },
  };
};
