import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Button,
  FormElement,
  Input,
  Loading,
  Switch,
  Textarea,
} from "@nextui-org/react";

//Types
import {
  IEditComment,
  ISingleComment,
  IValidationErrorsEditComment,
} from "@/ts/interfaces/comments.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { editComment } from "@/store/comments/actions";

//Tools
import api from "@/api";
import { toast } from "react-toastify";

//Components
import { CloseCircle, TickCircle } from "iconsax-react";

//Validators
import { editCommentValidator } from "@/validators/commentValidator";

type Props = {
  comments: any[];
  commentsTypes: any[];
  comment: ISingleComment;
};
export default function EditComment({
  comments,
  commentsTypes,
  comment,
}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IEditComment>({
    user: "",
    course: "",
    episode: "",
    article: "",
    grandParent: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IValidationErrorsEditComment>({
    paths: [],
    messages: {
      user: "",
      course: "",
      episode: "",
      article: "",
      grandParent: "",
      description: "",
    },
  });

  //Effects
  useEffect(() => {
    setForm({
      course: comment.course?._id,
      episode: comment.episode?._id,
      article: comment.article?._id,
      user: comment.user?._id as string,
      grandParent: comment.grandParent?._id || "",
      description: comment.description,
    });
  }, [comment]);

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
        user: "",
        course: "",
        episode: "",
        article: "",
        grandParent: "",
        description: "",
      },
    });
    setIsLoading(true);
    editCommentValidator
      .validate(
        {
          ...form,
        },
        { abortEarly: false }
      )
      .then(async () => {
        try {
          await dispatch(editComment(form, router.query._id as string));
          toast.success("نظر با موفقیت ویرایش شد", {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
          router.push("/comments");
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsEditComment = {
          paths: [],
          messages: {
            user: "",
            course: "",
            episode: "",
            article: "",
            grandParent: "",
            description: "",
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
            errors.paths.includes("description") ? "mb-6" : "mb-3"
          }`}
        >
          <Textarea bordered
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
        <div className={`flex items-end justify-start col-span-12`}>
          <label htmlFor="approved" className="ml-2 font-semibold">
            تایید شده
          </label>
          <Switch
            id="approved"
            color="success"
            bordered
            shadow
            checked={form.approved == true}
            onChange={(e) => setForm({ ...form, approved: e.target.checked })}
            size="xl"
            iconOff={<CloseCircle />}
            iconOn={<TickCircle />}
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
            ویرایش نظر
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
  let comment: ISingleComment | object = {};
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const commentRes = await api.get(`/admin/comments/${params?._id}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      comment = commentRes.data.comment;
    }
  } catch (error: any) {
    console.log(error.response?.response || error.response);
  }

  return {
    props: {
      comment: comment,
    },
  };
};
