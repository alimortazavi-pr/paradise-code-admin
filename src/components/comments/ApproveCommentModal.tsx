import { useState } from "react";
import { Modal, Button } from "@nextui-org/react";

//Types
import { ISingleComment } from "@/ts/interfaces/comments.interface";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { approveComment, disapproveComment } from "@/store/comments/actions";

//Tools
import { toast } from "react-toastify";

type Props = {
  setVisible: any;
  bindings: any;
  comment: ISingleComment | undefined;
};
export default function ApproveCommentModal({
  setVisible,
  bindings,
  comment,
}: Props) {
  //Redux
  const dispatch = useAppDispatch();

  //States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Functions
  function closeHandler() {
    setVisible(false);
  }

  function approve() {
    try {
      setIsLoading(true);
      dispatch(approveComment(comment?._id as string));
      setVisible(false);
      toast.success("نظر با موفقیت تایید شد", {
        
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err: any) {
      toast.error(err.message, {
        
        position: toast.POSITION.TOP_CENTER,
      });
      setIsLoading(false);
      setVisible(false);
    }
  }

  function disapprove() {
    try {
      setIsLoading(true);
      dispatch(disapproveComment(comment?._id as string));
      setVisible(false);
      toast.warning("نظر باموفقیت لغو تایید شد", {
        
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err: any) {
      toast.error(err.message, {
        
        position: toast.POSITION.TOP_CENTER,
      });
      setIsLoading(false);
      setVisible(false);
    }
  }

  return (
    <Modal
      scroll
      closeButton
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      animated={true}
      {...bindings}
      className="cursor-default"
    >
      <div className={"my-10 mx-5"}>
        <h5 className={"text-right text-2xl"}>آیا مطمئن هستید؟</h5>
        <div className={"flex items-center justify-center gap-2 mt-7"}>
          <Button
            size={"lg"}
            auto
            flat
            color={"warning"}
            onClick={closeHandler}
          >
            خیر
          </Button>
          {!comment?.approved ? (
            <Button size={"lg"} auto flat color="success" onClick={approve}>
              تایید
            </Button>
          ) : (
            <Button size={"lg"} auto flat color="error" onClick={disapprove}>
              لغو تایید
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
