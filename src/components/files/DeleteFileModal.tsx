import { useState } from "react";
import { Modal, Button } from "@nextui-org/react";

//Types
import { ISingleFile } from "@/ts/interfaces/layouts.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { deleteFile } from "@/store/layouts/actions";

//Tools
import { toast } from "react-toastify";

type Props = {
  visibleModal: boolean;
  setVisibleModal: any;
  file: ISingleFile | undefined;
};
export default function DeleteFileModal({
  visibleModal,
  setVisibleModal,
  file,
}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Functions
  function closeHandler() {
    setVisibleModal(false);
  }

  function destroy() {
    try {
      setIsLoading(true);
      dispatch(deleteFile(file?._id as string));
      setVisibleModal(false);
      toast.warning("تصویر با موفقیت حذف شد", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (err: any) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_CENTER,
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
        <h5 className={"text-right text-2xl"}>آیا مطمئن هستید؟</h5>
        <div className={"flex items-center justify-center gap-2 mt-7"}>
          <Button
            size={"lg"}
            auto
            flat
            color={"success"}
            onClick={closeHandler}
          >
            خیر
          </Button>
          <Button size={"lg"} auto flat color="error" onClick={destroy}>
            حذف
          </Button>
        </div>
      </div>
    </Modal>
  );
}
