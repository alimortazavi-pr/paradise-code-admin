import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, FormElement, Input, Loading } from "@nextui-org/react";

//Types
import {
  IEditCategory,
  ISingleCategory,
  IValidationErrorsEditCategory,
} from "@/ts/interfaces/categories.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { editCategory } from "@/store/categories/actions";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Validators
import { editCategoryValidator } from "@/validators/categoryValidator";

type Props = {
  categories: any[];
  categoriesTypes: any[];
  category: ISingleCategory<string | null>;
};
export default function EditCategory({
  categories,
  categoriesTypes,
  category,
}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditCategory>({
    title: "",
    grandParent: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsEditCategory>({
    paths: [],
    messages: {
      title: "",
      type: "",
    },
  });

  //Refs
  const imageThumb = useRef<HTMLInputElement>(null);
  const introductionVideo = useRef<HTMLInputElement>(null);

  //Effects
  useEffect(() => {
    setForm({
      ...category,
      grandParent: category.grandParent || "",
    });
  }, [category]);

  //Functions
  function inputHandler(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | FormElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function selectgrandParentHandler(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | FormElement>
  ) {
    const categoryFound = categories.find((c) => c._id === e.target.value);
    setForm({
      ...form,
      type: categoryFound?.type || category.type,
      grandParent: e.target.value,
    });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({
      paths: [],
      messages: {
        title: "",
        grandParent: "",
        type: "",
      },
    });
    setIsLoading(true);
    editCategoryValidator
      .validate(
        {
          ...form,
          imageThumb: imageThumb.current?.files?.item(0) || "",
          introductionVideo: introductionVideo.current?.files?.item(0) || "",
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          await dispatch(editCategory(form, router.query.slug as string));
          toast.success("دسته بندی با موفقیت ویرایش شد", {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
          router.push("/categories");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsEditCategory = {
          paths: [],
          messages: {
            title: "",
            type: "",
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
          className={`form-control mb-3 col-span-12 ${
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
        <div className="form-control mb-3 col-span-12 md:col-span-6">
          <label className="label">
            <span className="label-text">دسته بندی</span>
          </label>
          <select
            className="select select-bordered"
            name="grandParent"
            value={form.grandParent || ""}
            onChange={selectgrandParentHandler}
          >
            <option disabled>دسته بندی</option>
            <option value={""}>هیچکدام</option>
            {categories.map((category) =>
              category.slug !== router.query.slug ? (
                <option value={category._id} key={category._id}>
                  {category.title}
                </option>
              ) : null
            )}
          </select>
          {errors.paths.includes("category") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.grandParent}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div className="form-control mb-3 col-span-12 md:col-span-6">
          <label className="label">
            <span className="label-text">نوع</span>
          </label>
          <select
            className="select select-bordered"
            name="type"
            value={form.type || ""}
            onChange={inputHandler}
            disabled={form.grandParent ? true : false}
          >
            <option disabled>نوع</option>
            <option value={""}>هیچکدام</option>
            {categoriesTypes.map((categoryType) => (
              <option value={categoryType} key={categoryType}>
                {categoryType}
              </option>
            ))}
          </select>
          {errors.paths.includes("type") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.grandParent}
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
          color="warning"
          size={"lg"}
          ghost
        >
          <span className={`${isLoading ? "hidden" : "block"}`}>
            ویرایش دسته بندی
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
  let categories: object[] = [];
  let categoriesTypes: object[] = [];
  let category: ISingleCategory | object = {};
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const categoryRes = await api.get(`/admin/categories/${params?.slug}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      const categoriesRes = await api.get("/admin/variables/categories", {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      const categoriesTypesRes = await api.get(
        "/admin/variables/categories-types",
        {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        }
      );
      categories = categoriesRes.data.categories;
      categoriesTypes = categoriesTypesRes.data.categoriesTypes;
      category = categoryRes.data.category;
    }
  } catch (error: any) {
    console.log(error.response?.response || error.response);
  }

  return {
    props: {
      category: category,
      categories: categories,
      categoriesTypes: categoriesTypes,
    },
  };
};
