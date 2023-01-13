import { useState } from "react";
import { Modal, Button } from "@nextui-org/react";

//Types
import { ISingleCategory } from "@/ts/interfaces/categories.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { deleteCategory, recoveryCategory } from "@/store/categories/actions";

//Tools
import { toast } from "react-toastify";

type Props = {
  visibleModal: boolean;
  setVisibleModal: any;
  category: ISingleCategory<{ title: string }> | undefined;
};
export default function DeleteCategoryModal({
  visibleModal,
  setVisibleModal,
  category,
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
      dispatch(deleteCategory(category?.slug as string));
      setVisibleModal(false);
      toast.warning("دسته بندی با موفقیت حذف شد", {
        
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

  function recovery() {
    try {
      setIsLoading(true);
      dispatch(recoveryCategory(category?.slug as string));
      setVisibleModal(false);
      toast.success("دسته بندی با موفقیت بازیابی شد", {
        
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
          {category?.deleted ? (
            <Button size={"lg"} auto flat color="warning" onClick={recovery}>
              بازیابی
            </Button>
          ) : (
            <Button size={"lg"} auto flat color="error" onClick={destroy}>
              حذف
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
