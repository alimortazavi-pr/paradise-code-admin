import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleUser } from "@/ts/interfaces/users.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUsers } from "@/store/users/actions";
import { getUsers } from "@/store/users/selectors";

//Tools
import api from "@/api";

//Components
import DeleteUserModal from "@/components/users/DeleteUserModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  users: ISingleUser[];
  totalPages: number;
};
export default function Users({ users, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const usersGlobal = useAppSelector(getUsers);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [userSelected, setUserSelected] = useState<ISingleUser>();

  //Effects
  useEffect(() => {
    dispatch(setUsers(users));
    if (router.query.page) {
    }
  }, [users, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/users?page=${index}`);
  }

  function destroyUser(user: ISingleUser) {
    setUserSelected(user);
    setVisibleModal(true);
  }

  return (
    <div>
      <div className="w-full lg:w-20">
        <Button
          shadow
          bordered
          ghost
          className="z-0 w-full"
          onClick={() => router.push("/users/create")}
        >
          ایجاد کاربر
        </Button>
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
          <Table.Column css={{ textAlign: "right" }}>شماره موبایل</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>ایمیل</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>
            وضعیت شماره موبایل
          </Table.Column>
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
          {usersGlobal.map((user) => (
            <Table.Row css={{ zIndex: "0" }} key={user._id}>
              <Table.Cell>
                {user.firstName} {user.lastName}
              </Table.Cell>
              <Table.Cell>{user.mobile}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <span
                  className={`badge text-xs p-2 ${
                    user.mobileActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {user.mobileActive ? "تایید شده" : "تایید نشده"}
                </span>
              </Table.Cell>
              <Table.Cell>{user.createdBy?.name}</Table.Cell>
              <Table.Cell>
                {user.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!user.deleted ? (
                    <div
                      onClick={() => destroyUser(user)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyUser(user)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/users/${user.mobile}`}
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
      <DeleteUserModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        user={userSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let users: ISingleUser[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      users = response.data.users;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      users: users,
      totalPages: totalPages,
    },
  };
};
