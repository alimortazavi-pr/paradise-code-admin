import { ChangeEvent, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, FormElement, Input, Loading } from "@nextui-org/react";

//Types
import {
  IFormSendCode,
  IValidationErrorsSendCode,
} from "@/ts/interfaces/auth.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { sendCode } from "@/store/auth/actions";

//Tools
import { toast } from "react-toastify";

//Validators
import { sendCodeValidator } from "@/validators/authValidator";

export default function SendCode() {
  //Redux
  const dispatch = useAppDispatch();

  //Next
  const router = useRouter();

  //States
  const [form, setForm] = useState<IFormSendCode>({
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<IValidationErrorsSendCode>({
    paths: [],
    messages: {
      mobile: "",
    },
  });

  //Functions
  function inputHandler(e: ChangeEvent<FormElement>) {
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
        mobile: "",
      },
    });
    setIsLoading(true);
    sendCodeValidator
      .validate(form, { abortEarly: false })
      .then(async () => {
        try {
          await dispatch(sendCode(form));
          toast.success("کد تایید با موفقیت ارسال شد", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
          router.push(`/auth/sign-in?mobile=${form.mobile}`);
        } catch (err: any) {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        let errorsArray: IValidationErrorsSendCode = {
          paths: [],
          messages: {
            mobile: "",
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
    <div>
      <Head>
        <title>ورود (ادمین) | پارادایس کد</title>
      </Head>
      <div className="h-screen bg-dark-900 flex justify-center pt-10 md:items-start bg-cover">
        <div className="w-80 bg-white backdrop-blur py-14 rounded-xl shadow-sm">
          <h5 className="text-4xl text-black text-center mb-11 font-bold">
            ورود
          </h5>
          <div className="w-full flex flex-col items-center">
            <form
              className="w-full flex flex-col items-center mb-5"
              onSubmit={submit}
            >
              <div
                className={`form-control w-10/12 mb-3 ${
                  errors.paths.includes("mobile") ? "mb-6" : "mb-3"
                }`}
              >
                <Input bordered
                  value={form.mobile}
                  name="mobile"
                  onChange={inputHandler}
                  placeholder="شماره موبایل خود را وارد کنید"
                  helperText={
                    errors.paths.includes("mobile")
                      ? errors.messages.mobile
                      : ""
                  }
                  helperColor="error"
                  size="lg"
                />
              </div>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-10/12 mt-2"
                color="success"
                size={"lg"}
                shadow
                bordered
              >
                <Loading
                  hidden={!isLoading}
                  type="points"
                  color="currentColor"
                  size="sm"
                />
                <span className={`${isLoading ? "hidden" : "block"}`}>
                  درخواست کد
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
