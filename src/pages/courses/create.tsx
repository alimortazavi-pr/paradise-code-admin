import { ChangeEvent, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Button,
  FormElement,
  Input,
  Loading,
  Textarea,
} from "@nextui-org/react";

//Types
import {
  ICourseLevel,
  ICreateCourse,
  IValidationErrorsCreateCourse,
} from "@/ts/interfaces/courses.interface";
import { ISingleCategory } from "@/ts/interfaces/categories.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { createCourse } from "@/store/courses/actions";

//Tools
import api from "@/api";
import { CKEditor } from "ckeditor4-react";
import { toast } from "react-toastify";

//Components
import { Gallery, VideoPlay } from "iconsax-react";

//Validators
import { createCourseValidator } from "@/validators/courseValidator";

type Props = {
  categories: ISingleCategory[];
  levels: ICourseLevel[];
};
export default function CreateCourse({ categories, levels }: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<ICreateCourse>({
    title: "",
    category: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "0",
    status: "",
    imageThumb: "",
    introductionVideo: "",
  });
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsCreateCourse>({
    paths: [],
    messages: {
      title: "",
      category: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: "0",
      status: "0",
      imageThumb: "",
      introductionVideo: "",
    },
  });

  //Refs
  const imageThumb = useRef<HTMLInputElement>(null);
  const introductionVideo = useRef<HTMLInputElement>(null);

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
        title: "",
        category: "",
        slug: "",
        description: "",
        shortDescription: "",
        price: "0",
        status: "",
        imageThumb: "",
        introductionVideo: "",
      },
    });
    setIsLoading(true);
    createCourseValidator
      .validate(
        {
          ...form,
          description,
          imageThumb: imageThumb.current?.files?.item(0) || "",
          introductionVideo: introductionVideo.current?.files?.item(0) || "",
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          const formData = new FormData();
          formData.append("title", form.title);
          formData.append("category", form.category);
          formData.append("slug", form.slug);
          formData.append("description", description);
          formData.append("shortDescription", form.shortDescription);
          formData.append("price", form.price);
          formData.append("status", form.status);
          formData.append(
            "imageThumb",
            imageThumb.current?.files?.item(0) || ""
          );
          formData.append(
            "introductionVideo",
            introductionVideo.current?.files?.item(0) || ""
          );
          await dispatch(createCourse(formData));
          toast.success("دوره با موفقیت ایجاد شد", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
          router.push("/courses");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsCreateCourse = {
          paths: [],
          messages: {
            title: "",
            category: "",
            slug: "",
            description: "",
            shortDescription: "",
            price: "0",
            status: "0",
            imageThumb: "",
            introductionVideo: "",
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
            errors.paths.includes("title") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.title}
            name="title"
            onChange={inputHandler}
            placeholder="عنوان"
            helperText={
              errors.paths.includes("title") ? errors.messages.title : ""
            }
            helperColor="error"
            label="عنوان"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("slug") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.slug}
            name="slug"
            onChange={inputHandler}
            placeholder="اسلاگ"
            helperText={
              errors.paths.includes("slug") ? errors.messages.slug : ""
            }
            helperColor="error"
            label="اسلاگ"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 ${
            errors.paths.includes("price") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            type="number"
            value={form.price}
            name="price"
            onChange={inputHandler}
            placeholder="قیمت"
            helperText={
              errors.paths.includes("price") ? errors.messages.price : ""
            }
            helperColor="error"
            label="قیمت"
          />
        </div>
        <div className="form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4">
          <label className="label">
            <span className="label-text">دسته بندی</span>
          </label>
          <select
            className="select select-bordered"
            name="category"
            value={form.category}
            onChange={inputHandler}
          >
            <option disabled value={""}>
              دسته بندی
            </option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          {errors.paths.includes("category") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.category}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div className="form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4">
          <label className="label">
            <span className="label-text">وضعیت</span>
          </label>
          <select
            className="select select-bordered"
            name="status"
            value={form.status}
            onChange={inputHandler}
          >
            <option disabled value={""}>
              وضعیت
            </option>
            {levels.map((level) => (
              <option value={level.status} key={level.status}>
                {level.title}
              </option>
            ))}
          </select>
          {errors.paths.includes("status") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.status}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div
          className={`form-control mb-3 col-span-12 ${
            errors.paths.includes("shortDescription") ? "mb-6" : "mb-3"
          }`}
        >
          <Textarea
            bordered
            value={form.shortDescription}
            name="shortDescription"
            onChange={inputHandler}
            placeholder="توضیحات کوتاه"
            helperText={
              errors.paths.includes("shortDescription")
                ? errors.messages.shortDescription
                : ""
            }
            helperColor="error"
            label="توضیحات کوتاه"
          />
        </div>
        <div className="form-control mb-3 col-span-12">
          <label className="label">
            <span className="label-text">توضیحات</span>
          </label>

          <CKEditor
            initData={description}
            onChange={(e) => setDescription(e.editor.getData())}
            config={{
              extraPlugins: ["justify", "font"],
              contentsLangDirection: "rtl",
            }}
          />
          {errors.paths.includes("description") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.description}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div className="form-control mb-3 col-span-12 md:col-span-6 lg:col-span-6">
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
              انتخاب تصویر دوره
            </span>
            <Input
              bordered
              type="file"
              className="hidden"
              ref={imageThumb}
              accept=".png,.jpeg,.jpg"
            />
          </label>
          {errors.paths.includes("imageThumb") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.imageThumb}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div className="form-control mb-3 col-span-12 md:col-span-6 lg:col-span-6">
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
            <VideoPlay size="35" />
            <span className="mt-2 text-base leading-normal">
              انتخاب ویدیو معرفی دوره
            </span>
            <Input
              bordered
              type="file"
              className="hidden"
              ref={introductionVideo}
              accept=".mkv,.mp4"
            />
          </label>
          {errors.paths.includes("introductionVideo") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.introductionVideo}
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
            ایجاد دوره
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let categories: ISingleCategory[] = [];
  let levels: ICourseLevel[] = [];
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const categoriesRes = await api.get(
        "/admin/variables/course-categories",
        {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        }
      );
      const coursesLevelsRes = await api.get(
        "/admin/variables/courses-levels",
        {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        }
      );
      categories = categoriesRes.data.coursesCategories;
      levels = coursesLevelsRes.data.coursesLevels;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      categories: categories,
      levels: levels,
    },
  };
};
