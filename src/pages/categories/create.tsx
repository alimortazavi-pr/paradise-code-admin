import { ChangeEvent, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Button, FormElement, Input, Loading } from "@nextui-org/react";

//Types
import {
  ICreateCategory,
  IValidationErrorsCreateCategory,
} from "@/ts/interfaces/categories.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { createCategory } from "@/store/categories/actions";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Validators
import { createCategoryValidator } from "@/validators/categoryValidator";

type Props = {
  categories: any[];
  categoriesTypes: any[];
};
export default function CreateCategory({ categories, categoriesTypes }: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<ICreateCategory>({
    title: "",
    grandParent: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsCreateCategory>(
    {
      paths: [],
      messages: {
        title: "",
        type: "",
      },
    }
  );

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
      type: categoryFound?.type || "",
      grandParent: e.target.value,
    });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({
      paths: [],
      messages: {
        title: "",
        type: "",
      },
    });
    setIsLoading(true);
    createCategoryValidator
      .validate(
        {
          ...form,
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          await dispatch(createCategory(form));
          toast.success("دسته بندی با موفقیت ایجاد شد", {
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
        let errorsArray: IValidationErrorsCreateCategory = {
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
            name="category"
            value={form.grandParent || ""}
            onChange={selectgrandParentHandler}
          >
            <option disabled>دسته بندی</option>
            <option value={""}>هیچکدام</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.title}
              </option>
            ))}
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
          color="gradient"
          size={"lg"}
          ghost
        >
          <span className={`${isLoading ? "hidden" : "block"}`}>
            ایجاد دسته بندی
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
  let categories: object[] = [];
  let categoriesTypes: object[] = [];
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
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
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      categories: categories,
      categoriesTypes: categoriesTypes,
    },
  };
};
