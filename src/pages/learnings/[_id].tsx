import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Button, Input, Loading } from "@nextui-org/react";

//Types
import {
  IEditLearning,
  ISingleLearning,
  IValidationErrorsEditLearning,
} from "@/ts/interfaces/learnings.interface";
import { ISingleUser } from "@/ts/interfaces/users.interface";
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { editLearning } from "@/store/learnings/actions";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Components
import InfiniteScrollUsers from "@/components/learnings/InfiniteScrollUsers";
import InfiniteScrollCourses from "@/components/learnings/InfiniteScrollCourses";

//Validators
import { editLearningValidator } from "@/validators/learningValidator";

type Props = {
  learning: ISingleLearning;
  users: ISingleUser[];
  courses: ISingleCourse[];
};
export default function EditLearning({ learning, users, courses }: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditLearning>({
    user: {
      _id: "",
      firstName: "",
      lastName: "",
      mobile: "",
    },
    course: {
      _id: "",
      title: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsEditLearning>({
    paths: [],
    messages: {
      user: "",
      course: "",
    },
  });

  //Effects
  useEffect(() => {
    setForm({
      user: {
        _id: learning?.user._id as string,
        firstName: learning?.user.firstName,
        lastName: learning?.user.lastName,
        mobile: learning?.user.mobile,
      },
      course: {
        _id: learning?.course._id as string,
        title: learning?.course.title,
      },
    });
  }, [learning]);

  //Functions
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({
      paths: [],
      messages: {
        user: "",
        course: "",
      },
    });
    setIsLoading(true);
    editLearningValidator
      .validate(
        {
          user: form.user._id,
          course: form.course._id,
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          await dispatch(editLearning(form, router.query._id as string));
          toast.success("در حال یادگیری با موفقیت ویرایش شد", {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
          router.push("/learnings");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsEditLearning = {
          paths: [],
          messages: {
            user: "",
            course: "",
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
          className={`form-control mb-3 col-span-12 md:col-span-6 ${
            errors.paths.includes("user") ? "mb-6" : "mb-3"
          }`}
        >
          <Input bordered
            value={`${form.user.firstName} ${form.user.lastName} - ${form.user.mobile}`}
            name="user"
            placeholder="کاربر"
            helperText={
              errors.paths.includes("user") ? errors.messages.user : ""
            }
            helperColor="error"
            label="کاربر"
            disabled={true}
          />
          <InfiniteScrollUsers users={users} form={form} setForm={setForm} />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 ${
            errors.paths.includes("course") ? "mb-6" : "mb-3"
          }`}
        >
          <Input bordered
            value={form.course.title}
            name="course"
            placeholder="دوره"
            helperText={
              errors.paths.includes("course") ? errors.messages.course : ""
            }
            helperColor="error"
            label="دوره"
            disabled={true}
          />
          <InfiniteScrollCourses
            courses={courses}
            form={form}
            setForm={setForm}
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
            ویرایش در حال یادگیری
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
  params,
}) => {
  let learning: ISingleLearning | object = {};
  let users: object[] = [];
  let courses: object[] = [];
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const learningRes = await api.get(`/admin/learnings/${params?._id}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      learning = learningRes.data.learning;
      const usersResponse = await api.get(`/admin/variables/users`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      users = usersResponse.data.users;
      const coursesResponse = await api.get(`/admin/variables/courses`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      courses = coursesResponse.data.courses;
    }
  } catch (error: any) {
    console.log(error.response?.response || error);
  }

  return {
    props: {
      learning: learning,
      users: users,
      courses: courses,
    },
  };
};
