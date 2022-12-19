import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Button, FormElement, Input, Loading, Switch } from "@nextui-org/react";

//Types
import {
  IEditEpisode,
  IEpisodeLevel,
  ISingleEpisode,
  IValidationErrorsEditEpisode,
} from "@/ts/interfaces/episodes.interface";
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editEpisode } from "@/store/episodes/actions";
import { getToken } from "@/store/auth/selectors";

//Tools
import api from "@/api";
import { CKEditor } from "ckeditor4-react";
import { toast } from "react-toastify";

//Components
import CoursesListModal from "@/components/episodes/CoursesListModal";
import MyPlyrVideo from "@/components/layouts/MyPlyrVideo";
import { MoneyRemove, MoneyTick, VideoPlay } from "iconsax-react";

//Validators
import { editEpisodeValidator } from "@/validators/episodeValidator";

type Props = {
  courses: ISingleCourse[];
  episode: ISingleEpisode<ISingleCourse>;
  levels: IEpisodeLevel[];
};
export default function EditEpisode({ courses, episode, levels }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const token = useAppSelector(getToken);

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditEpisode>({
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
  const [errors, setErrors] = useState<IValidationErrorsEditEpisode>({
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
  const imageThumb = useRef<HTMLInputElement>(null);
  const videoUrl = useRef<HTMLInputElement>(null);

  //Effects
  useEffect(() => {
    setDescription(episode.description);
    setForm({
      ...episode,
      course: {
        title: episode.course.title,
        _id: episode.course._id as string,
      },
      status: episode.status?.toString(),
    });
  }, [episode]);

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
    editEpisodeValidator
      .validate(
        {
          ...form,
          description,
          imageThumb: imageThumb.current?.files?.item(0) || "",
          videoUrl: videoUrl.current?.files?.item(0) || "",
          course: form.course._id,
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
          await dispatch(editEpisode(formData, router.query.slug as string));
          toast.success("جلسه با موفقیت ویرایش شد", {
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
        let errorsArray: IValidationErrorsEditEpisode = {
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
        <div className="form-control mb-3 col-span-12 md:col-span-6 lg:col-span-4">
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

          {description ? (
            <CKEditor
              initData={description}
              onChange={(e) => setDescription(e.editor.getData())}
            />
          ) : null}

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
          <div className="w-full h-[80vh] mt-5">
            <MyPlyrVideo
              videoSrc={`http://localhost:7011/static${episode.videoUrl}&a=${token}&admin=true`}
            />
          </div>
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
            ویرایش جلسه
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
  let courses: ISingleCourse[] = [];
  let episode: ISingleEpisode | object = {};
  let levels: IEpisodeLevel[] = [];
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const episodeRes = await api.get(`/admin/episodes/${params?.slug}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      const coursesRes = await api.get("/admin/variables/courses", {
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
      episode = episodeRes.data.episode;
    }
  } catch (error: any) {
    console.log(error.response?.response || error);
  }

  return {
    props: {
      episode: episode,
      courses: courses,
      levels: levels,
    },
  };
};
