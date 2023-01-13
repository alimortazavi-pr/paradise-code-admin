import { useState } from "react";
import { Modal, Button } from "@nextui-org/react";

//Types
import { ISingleUser } from "@/ts/interfaces/users.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { deleteUser, recoveryUser } from "@/store/users/actions";

//Tools
import { toast } from "react-toastify";

type Props = {
  visibleModal: boolean;
  setVisibleModal: any;
  user: ISingleUser | undefined;
};
export default function DeleteUserModal({
  visibleModal,
  setVisibleModal,
  user,
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
      dispatch(deleteUser(user?.mobile as string));
      setVisibleModal(false);
      toast.warning("کاربر با موفقیت حذف شد", {
        
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
      dispatch(recoveryUser(user?.mobile as string));
      setVisibleModal(false);
      toast.success("کاربر با موفقیت بازیابی شد", {
        
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
          {user?.deleted ? (
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
