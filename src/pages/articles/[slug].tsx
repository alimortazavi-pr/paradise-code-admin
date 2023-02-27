import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, FormElement, Input, Loading } from "@nextui-org/react";

//Types
import {
  IArticleLevel,
  IEditArticle,
  ISingleArticle,
  IValidationErrorsEditArticle,
} from "@/ts/interfaces/articles.interface";
import { ISingleCategory } from "@/ts/interfaces/categories.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { editArticle } from "@/store/articles/actions";

//Tools
import api from "@/api";
import { CKEditor } from "ckeditor4-react";
import { toast } from "react-toastify";

//Components
import MyPlyrVideo from "@/components/layouts/MyPlyrVideo";
import { Gallery, VideoPlay } from "iconsax-react";

//Validators
import { editArticleValidator } from "@/validators/articleValidator";

type Props = {
  categories: ISingleCategory[];
  levels: IArticleLevel[];
  article: ISingleArticle<string>;
};
export default function EditArticle({ categories, article, levels }: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditArticle>({
    title: "",
    category: "",
    slug: "",
    content: "",
    readingTime: "",
    status: "",
    imageThumb: "",
    introductionVideo: "",
  });
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsEditArticle>({
    paths: [],
    messages: {
      title: "",
      category: "",
      slug: "",
      content: "",
      readingTime: "",
      status: "0",
      imageThumb: "",
      introductionVideo: "",
    },
  });

  //Refs
  const imageThumb = useRef<HTMLInputElement>(null);
  const introductionVideo = useRef<HTMLInputElement>(null);

  //Effects
  useEffect(() => {
    setContent(article.content);
    setForm({
      ...article,
      category: article.category as string,
      status: article.status.toString(),
      readingTime: article.readingTime as string,
    });
  }, [article]);

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
        content: "",
        readingTime: "",
        status: "",
        imageThumb: "",
        introductionVideo: "",
      },
    });
    setIsLoading(true);
    editArticleValidator
      .validate(
        {
          ...form,
          content,
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
          formData.append("content", content);
          formData.append("readingTime", form.readingTime);
          formData.append("status", form.status);
          formData.append(
            "imageThumb",
            imageThumb.current?.files?.item(0) || ""
          );
          formData.append(
            "introductionVideo",
            introductionVideo.current?.files?.item(0) || ""
          );
          await dispatch(editArticle(formData, router.query.slug as string));
          toast.success("مقاله با موفقیت ویرایش شد", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
          router.push("/articles");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsEditArticle = {
          paths: [],
          messages: {
            title: "",
            category: "",
            slug: "",
            content: "",
            readingTime: "",
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
          <Input bordered
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
          <Input bordered
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
            errors.paths.includes("readingTime") ? "mb-6" : "mb-3"
          }`}
        >
          <Input bordered
            type="text"
            value={form.readingTime}
            name="readingTime"
            onChange={inputHandler}
            placeholder="زمان خواندن"
            helperText={
              errors.paths.includes("readingTime")
                ? errors.messages.readingTime
                : ""
            }
            helperColor="error"
            label="زمان خواندن"
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
        <div className="form-control mb-3 col-span-12">
          <label className="label">
            <span className="label-text">محتوا</span>
          </label>

          {content ? (
            <CKEditor
              initData={content}
              onChange={(e) => setContent(e.editor.getData())}
            />
          ) : null}

          {errors.paths.includes("content") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.content}
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
              انتخاب تصویر مقاله
            </span>
            <Input bordered
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
          <div className="relative w-full h-96 mt-5 ">
            <Image
              src={`https://api.paradisecode.org/static${article.imageThumb}`}
              alt=""
              layout="fill"
              className="object-contain"
            />
          </div>
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
              انتخاب ویدیو معرفی مقاله
            </span>
            <Input bordered
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
          {article.introductionVideo ? (
            <div className="w-full h-[80vh] mt-5">
              <MyPlyrVideo
                videoSrc={`https://api.paradisecode.org/static${article.introductionVideo}`}
              />
            </div>
          ) : null}
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
            ویرایش مقاله
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
  let categories: ISingleCategory[] = [];
  let levels: IArticleLevel[] = [];
  let article: ISingleArticle | object = {};
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const articleRes = await api.get(`/admin/articles/${params?.slug}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      const categoriesRes = await api.get(
        "/admin/variables/article-categories",
        {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        }
      );
      const articlesLevelsRes = await api.get(
        "/admin/variables/articles-levels",
        {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        }
      );
      categories = categoriesRes.data.articlesCategories;
      article = articleRes.data.article;
      levels = articlesLevelsRes.data.articlesLevels;
    }
  } catch (error: any) {
    console.log(error.response?.response || error);
  }

  return {
    props: {
      article: article,
      categories: categories,
      levels: levels,
    },
  };
};
