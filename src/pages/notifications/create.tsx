import { ChangeEvent, useState } from "react";
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
import { ISingleUser } from "@/ts/interfaces/users.interface";
import { createNotificationPropsType } from "@/ts/types/notifications.type";
import {
  ICreateNotification,
  ISingleUserForCreateNotification,
  IValidationErrorsCreateNotification,
} from "@/ts/interfaces/notifications.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { createLearning } from "@/store/learnings/actions";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Components
import InfiniteScrollUsers from "@/components/notifications/InfiniteScrollUsers";
import SelectedUsers from "@/components/notifications/SelectedUsers";
import { createNotificationValidator } from "@/validators/notificationValidator";
import { createNotification } from "@/store/notifications/actions";

//Validators

export default function CreateNotification({
  users,
}: createNotificationPropsType) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<ICreateNotification>({
    users: [],
    subject: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsCreateNotification>({
    paths: [],
    messages: {
      users: "",
      description: "",
      subject: "",
    },
  });

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
        users: "",
        description: "",
        subject: "",
      },
    });
    setIsLoading(true);
    createNotificationValidator
      .validate(form, { abortEarly: false })
      .then(async () => {
        try {
          await dispatch(createNotification(form));
          toast.success("پیام با موفقیت ایجاد شد", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
          // router.push("/notifications");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsCreateNotification = {
          paths: [],
          messages: {
            users: "",
            description: "",
            subject: "",
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
            errors.paths.includes("subject") ? "mb-6" : "mb-3"
          }`}
        >
          <Input
            bordered
            value={form.subject}
            name="subject"
            onChange={inputHandler}
            placeholder="موضوع"
            helperText={
              errors.paths.includes("subject") ? errors.messages.subject : ""
            }
            helperColor="error"
            label="موضوع"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 ${
            errors.paths.includes("shortDescription") ? "mb-6" : "mb-3"
          }`}
        >
          <Textarea
            bordered
            value={form.description}
            name="description"
            onChange={inputHandler}
            placeholder="توضیحات"
            helperText={
              errors.paths.includes("description")
                ? errors.messages.description
                : ""
            }
            helperColor="error"
            label="توضیحات"
          />
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 ${
            errors.paths.includes("user") ? "mb-6" : "mb-3"
          }`}
        >
          <InfiniteScrollUsers users={users} form={form} setForm={setForm} />
          {errors.paths.includes("users") ? (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.messages.users}
              </span>
            </label>
          ) : (
            ""
          )}
        </div>
        <div
          className={`form-control mb-3 col-span-12 md:col-span-6 ${
            errors.paths.includes("user") ? "mb-6" : "mb-3"
          }`}
        >
          <SelectedUsers form={form} setForm={setForm} />
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
            ایجاد پیام
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let users: ISingleUser[] = [];
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const usersResponse = await api.get(`/admin/variables/users`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      users = usersResponse.data.users;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      users: users,
    },
  };
};
