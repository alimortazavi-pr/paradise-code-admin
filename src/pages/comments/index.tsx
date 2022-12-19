import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination, useModal, Switch } from "@nextui-org/react";

//Types
import { ISingleComment } from "@/ts/interfaces/comments.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setComments } from "@/store/comments/actions";
import { getComments } from "@/store/comments/selectors";

//Tools
import api from "@/api";

//Components
import DeleteCommentModal from "@/components/comments/DeleteCommentModal";
import ApproveCommentModal from "@/components/comments/ApproveCommentModal";
import { ArrowLeft2, CloseSquare, Edit, Messages3, TickSquare, Trash } from "iconsax-react";

type Props = {
  comments: ISingleComment[];
  totalPages: number;
};
export default function Comments({ comments, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const commentsGlobal = useAppSelector(getComments);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const { setVisible, bindings } = useModal();
  const [commentSelected, setCommentSelected] =
    useState<ISingleComment>();

  //Effects
  useEffect(() => {
    dispatch(setComments(comments));
  }, [comments, dispatch, router.query]);

  //Functions
  function toggleGetComments() {
    if (router.query.all == "true") {
      router.push({
        pathname: "/comments",
        query: { ...router.query, all: false },
      });
    } else if (router.query.all == "false" || !router.query.all) {
      router.push({
        pathname: "/comments",
        query: { ...router.query, all: true },
      });
    }
  }

  function changePage(index: number) {
    router.push(`/comments?page=${index}`);
  }

  function destroyComment(comment: ISingleComment) {
    setCommentSelected(comment);
    setVisibleModal(true);
  }

  function approveComment(comment: ISingleComment) {
    setCommentSelected(comment);
    setVisible(true);
  }

  return (
    <div>
      <div className={`flex items-center mb-3`}>
        <label htmlFor="allComments" className="ml-2 font-semibold">
          همه نظرات
        </label>
        <Switch
          id="allComments"
          color="success"
          bordered
          shadow
          checked={router.query.all == "true"}
          onChange={toggleGetComments}
          size="xl"
          iconOff={<TickSquare />}
          iconOn={<Messages3 />}
        />
      </div>
      <Table
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="none"
        className="z-0"
        aria-label="simple table"
      >
        <Table.Header>
          <Table.Column
            css={{
              borderRadius: "0 1rem 1rem 0",
              textAlign: "right",
              paddingRight: "12px",
            }}
          >
            کاربر
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>نوع</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>عنوان</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>تایید شده</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>پاسخ</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>حذف شده</Table.Column>
          <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            <span></span>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {commentsGlobal.map((comment) => (
            <Table.Row css={{ zIndex: "0" }} key={comment._id}>
              <Table.Cell>
                {comment.user?.firstName} {comment.user?.lastName}
              </Table.Cell>
              <Table.Cell>
                {comment.type === "course" ? (
                  <span className="badge text-xs p-2 badge-secondary">
                    دوره
                  </span>
                ) : comment.type === "episode" ? (
                  <span className="badge text-xs p-2 badge-info">جلسه</span>
                ) : (
                  <span className="badge text-xs p-2 badge-primary">مقاله</span>
                )}
              </Table.Cell>
              <Table.Cell>
                {comment.type === "course"
                  ? comment.course?.title
                  : comment.type === "episode"
                  ? comment.episode?.course.title + " " + comment.episode?.title
                  : comment.article?.title}
              </Table.Cell>
              <Table.Cell>
                {comment.approved ? (
                  <span className="badge text-xs p-2 badge-success">
                    تایید شده
                  </span>
                ) : (
                  <span className="badge text-xs p-2 badge-error">
                    تایید نشده
                  </span>
                )}
              </Table.Cell>
              <Table.Cell>
                {comment.grandParent ? (
                  <span className="badge text-xs p-2 badge-info">پاسخ</span>
                ) : (
                  <span className="badge text-xs p-2 badge-warning">
                    پاسخ نیست
                  </span>
                )}
              </Table.Cell>
              <Table.Cell>
                {comment.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!comment.approved ? (
                    <div
                      onClick={() => approveComment(comment)}
                      className="font-medium text-green-600 ml-3 cursor-pointer flex items-center"
                    >
                      <TickSquare width={20} height={20} />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 ml-3 cursor-pointer flex items-center"
                      onClick={() => approveComment(comment)}
                    >
                      <CloseSquare width={20} height={20} />
                    </div>
                  )}
                  {!comment.deleted ? (
                    <div
                      onClick={() => destroyComment(comment)}
                      className="font-medium text-red-600 ml-3 cursor-pointer flex items-center"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 ml-3 cursor-pointer flex items-center"
                      onClick={() => destroyComment(comment)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/comments/${comment._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 flex items-center"
                    >
                      <Edit size="20" />
                    </Link>
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="ltr-important flex justify-center w-full mt-5">
        <Pagination
          shadow
          color={"default"}
          initialPage={
            router.query.page ? parseInt(router.query.page as string) : 1
          }
          total={totalPages}
          onChange={changePage}
          hidden={totalPages < 1}
        />
      </div>
      <DeleteCommentModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        comment={commentSelected}
      />
      <ApproveCommentModal
        setVisible={setVisible}
        bindings={bindings}
        comment={commentSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let comments: ISingleComment[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      if (query.all == "true") {
        const response = await api.get(`/admin/comments?page=${page}`, {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        });
        comments = response.data.comments;
        totalPages = response.data.totalPages;
      } else if (query.all == "false" || !query.all) {
        const response = await api.get(`/admin/comments/pending?page=${page}`, {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        });
        comments = response.data.comments;
        totalPages = response.data.totalPages;
      }
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      comments: comments,
      totalPages: totalPages,
    },
  };
};
