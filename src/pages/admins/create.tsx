import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, FormElement, Input, Loading, Switch } from "@nextui-org/react";

//Types
import {
  ICreateAdmin,
  IValidationErrorsCreateAdmin,
} from "@/ts/interfaces/admins.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { createAdmin } from "@/store/admins/actions";

//Components
import { Gallery } from "iconsax-react";

//Tools
import { toast } from "react-toastify";

//Validators
import { createAdminValidator } from "@/validators/adminValidator";

type Props = {};
export default function CreateAdmin({}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<ICreateAdmin>({
    name: "",
    nickname: "",
    mobile: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsCreateAdmin>({
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
    createAdminValidator
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
          await dispatch(createAdmin(formData));
          toast.success("ادمین با موفقیت ایجاد شد", {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
          router.push("s");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsCreateAdmin = {
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
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("name") ? "mb-6" : "mb-3"
          }`}
        >
          <Input bordered
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
          <Input bordered
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
          <Input bordered
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
              انتخاب تصویر ادمین
            </span>
            <Input bordered
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
            ایجاد ادمین
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
