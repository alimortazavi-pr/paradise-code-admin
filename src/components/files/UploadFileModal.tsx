import { ChangeEvent, useState } from "react";
import { Modal, Button } from "@nextui-org/react";
import Image from "next/image";

//Types

//Redux
import { useAppDispatch } from "@/store/hooks";
import { uploadFile } from "@/store/layouts/actions";

//Tools
import { toast } from "react-toastify";

type Props = {
  visibleModal: boolean;
  setVisibleModal: any;
};
export default function UploadFileModal({
  visibleModal,
  setVisibleModal,
}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  //Functions
  function closeHandler() {
    setFile(undefined);
    setVisibleModal(false);
  }

  function fileHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  function submit() {
    try {
      if (!file) {
        return toast.error("لطفا یک عکس انتخاب کنید", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      dispatch(uploadFile(formData));
      toast.success("فایل با موفقیت آپلود شد", {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsLoading(false);
      setVisibleModal(false);
    } catch (err: any) {
      toast.error(err.message, {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsLoading(false);
      setVisibleModal(false);
    }
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={visibleModal}
      onClose={closeHandler}
      className={"cursor-default"}
    >
      <div className={"my-10 mx-5"}>
        <h3>{file?.name}</h3>
        <label
          htmlFor="file"
          className="h-full w-full flex justify-center relative"
        >
          <input
            type="file"
            className="hidden"
            id="file"
            onChange={fileHandler}
          />
          <label htmlFor="file" className="btn z-10 mt-2">
            انتخاب فایل
          </label>
        </label>
        <div className={"flex items-center justify-center gap-2 mt-7"}>
          <Button
            disabled={isLoading}
            size={"lg"}
            auto
            flat
            color={"error"}
            onClick={closeHandler}
          >
            لغو
          </Button>
          <Button
            disabled={isLoading}
            size={"lg"}
            auto
            flat
            color="success"
            onClick={submit}
          >
            آپلود
          </Button>
        </div>
      </div>
    </Modal>
  );
}
