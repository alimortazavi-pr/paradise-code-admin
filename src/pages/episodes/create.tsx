import { ChangeEvent, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Button, FormElement, Input, Loading, Switch } from "@nextui-org/react";

//Types
import {
  ICreateEpisode,
  IEpisodeLevel,
  IValidationErrorsCreateEpisode,
} from "@/ts/interfaces/episodes.interface";
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { createEpisode } from "@/store/episodes/actions";

//Tools
import api from "@/api";
import { CKEditor } from "ckeditor4-react";
import { toast } from "react-toastify";

//Components
import CoursesListModal from "@/components/episodes/CoursesListModal";
import { MoneyRemove, MoneyTick, VideoPlay } from "iconsax-react";

//Validators
import { createEpisodeValidator } from "@/validators/episodeValidator";

type Props = {
  courses: ISingleCourse[];
  levels: IEpisodeLevel[];
};
export default function CreateEpisode({ courses, levels }: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<ICreateEpisode>({
    title: "",
    course: { _id: "", title: "" },
    slug: "",
    description: "",
    status: "",
    videoUrl: "",
    row: "",
    free: false,
  });
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsCreateEpisode>({
    paths: [],
    messages: {
      title: "",
      course: "",
      slug: "",
      description: "",
      status: "0",
      videoUrl: "",
      row: "",
    },
  });

  //Refs
  const videoUrl = useRef<HTMLInputElement>(null);

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
        course: "",
        slug: "",
        description: "",
        status: "",
        videoUrl: "",
        row: "",
      },
    });
    setIsLoading(true);
    createEpisodeValidator
      .validate(
        {
          ...form,
          description,
          course: form.course._id,
          videoUrl: videoUrl.current?.files?.item(0) || "",
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          const formData = new FormData();
          formData.append("title", form.title);
          formData.append("course", form.course._id);
          formData.append("slug", form.slug);
          formData.append("description", description);
          formData.append("status", form.status);
          formData.append("row", form.row as string);
          formData.append("free", `${form.free}`);
          formData.append("videoUrl", videoUrl.current?.files?.item(0) || "");
          await dispatch(createEpisode(formData));
          toast.success("جلسه با موفقیت ایجاد شد", {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
          router.push("/episodes");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsCreateEpisode = {
          paths: [],
          messages: {
            title: "",
            course: "",
            slug: "",
            description: "",
            status: "0",
            videoUrl: "",
            row: "",
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
            errors.paths.includes("row") ? "mb-6" : "mb-3"
          }`}
        >
          <Input bordered
            value={form.row}
            name="row"
            onChange={inputHandler}
            placeholder="ردیف"
            helperText={errors.paths.includes("row") ? errors.messages.row : ""}
            helperColor="error"
            label="ردیف"
          />
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
        <div className="form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4 flex justify-end">
          <label className="label">
            <span className="label-text">
              دوره انتخاب شده: {form.course.title}
            </span>
          </label>
          <CoursesListModal courses={courses} form={form} setForm={setForm} />
          {errors.paths.includes("course") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.course}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div
          className={`flex items-center justify-center col-span-12 md:col-span-6 lg:col-span-4`}
        >
          <Switch
            color="success"
            bordered
            shadow
            checked={form.free == true}
            onChange={(e) => setForm({ ...form, free: e.target.checked })}
            size="xl"
            iconOff={<MoneyRemove />}
            iconOn={<MoneyTick />}
          />
        </div>
        <div className="form-control mb-3 col-span-12">
          <label className="label">
            <span className="label-text">توضیحات</span>
          </label>

          <CKEditor
            initData={description}
            onChange={(e) => setDescription(e.editor.getData())}
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
            <VideoPlay size="35" />
            <span className="mt-2 text-base leading-normal">
              انتخاب ویدیو معرفی جلسه
            </span>
            <Input bordered
              type="file"
              className="hidden"
              ref={videoUrl}
              accept=".mkv,.mp4"
            />
          </label>
          {errors.paths.includes("videoUrl") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.videoUrl}
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
            ایجاد جلسه
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
  let courses: ISingleCourse[] = [];
  let levels: IEpisodeLevel[] = [];
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const coursesRes = await api.get(`/admin/variables/courses`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      const episodesLevelsRes = await api.get(
        "/admin/variables/episodes-levels",
        {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        }
      );
      
      courses = coursesRes.data.courses;
      levels = episodesLevelsRes.data.episodesLevels;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      courses: courses,
      levels: levels,
    },
  };
};