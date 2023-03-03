import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleAdmin } from "@/ts/interfaces/admins.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAdmins } from "@/store/admins/actions";
import { getAdmins } from "@/store/admins/selectors";

//Tools
import api from "@/api";

//Components
import DeleteAdminModal from "@/components/admins/DeleteAdminModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  admins: ISingleAdmin[];
  totalPages: number;
};
export default function Admins({ admins, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const adminsGlobal = useAppSelector(getAdmins);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [adminSelected, setAdminSelected] = useState<ISingleAdmin>();

  //Effects
  useEffect(() => {
    console.log(admins);

    dispatch(setAdmins(admins));
  }, [admins, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/?page=${index}`);
  }

  function destroyAdmin(admin: ISingleAdmin) {
    setAdminSelected(admin);
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
          onClick={() => router.push("/admins/create")}
        >
          ایجاد ادمین
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
            نام
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>لقب</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>شماره موبایل</Table.Column>
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
          {adminsGlobal.map((admin) => (
            <Table.Row css={{ zIndex: "0" }} key={admin._id}>
              <Table.Cell>{admin.name}</Table.Cell>
              <Table.Cell>{admin.nickname}</Table.Cell>
              <Table.Cell>{admin.mobile}</Table.Cell>
              <Table.Cell>{admin.createdBy?.name}</Table.Cell>
              <Table.Cell>
                {admin.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!admin.deleted ? (
                    <div
                      onClick={() => destroyAdmin(admin)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyAdmin(admin)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/admins/${admin.mobile}`}
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
      <DeleteAdminModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        admin={adminSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let admins: ISingleAdmin[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/admins?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      admins = response.data.admins;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.message);

    console.log(error.response?.data);
  }

  return {
    props: {
      admins: admins,
      totalPages: totalPages,
    },
  };
};
