import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleLearning } from "@/ts/interfaces/learnings.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLearnings } from "@/store/learnings/actions";
import { getLearnings } from "@/store/learnings/selectors";

//Tools
import api from "@/api";

//Components
import DeleteLearningModal from "@/components/learnings/DeleteLearningModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  learnings: ISingleLearning[];
  totalPages: number;
};
export default function Learnings({ learnings, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const learningsGlobal = useAppSelector(getLearnings);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [learningSelected, setLearningSelected] =
    useState<ISingleLearning>();

  //Effects
  useEffect(() => {
    dispatch(setLearnings(learnings));
  }, [learnings, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/learnings?page=${index}`);
  }

  function destroyLearning(learning: ISingleLearning) {
    setLearningSelected(learning);
    setVisibleModal(true);
  }

  return (
    <div>
      <div className="w-full lg:w-20">
        <Link href={"/learnings/create"}>
          <Button shadow bordered ghost className="z-0 w-full">
            ایجاد در حال یادگیری
          </Button>
        </Link>
      </div>
      <hr className="my-5" />
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
            نام و نام خانوادگی
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>عنوان دوره</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>
            ایجاد شده توسط
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>حذف شده</Table.Column>
          <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            {" "}
            <span></span>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {learningsGlobal.map((learning) => (
            <Table.Row css={{ zIndex: "0" }} key={learning._id}>
              <Table.Cell>
                {learning.user.firstName} {learning.user.lastName}
              </Table.Cell>
              <Table.Cell>{learning.course.title}</Table.Cell>
              <Table.Cell>{learning.createdBy?.name}</Table.Cell>
              <Table.Cell>
                {learning.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!learning.deleted ? (
                    <div
                      onClick={() => destroyLearning(learning)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyLearning(learning)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/learnings/${learning._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
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
      <DeleteLearningModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        learning={learningSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let learnings: ISingleLearning[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/learnings?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      learnings = response.data.learnings;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      learnings: learnings,
      totalPages: totalPages,
    },
  };
};
