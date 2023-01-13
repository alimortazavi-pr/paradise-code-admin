import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Table, Pagination, Button } from "@nextui-org/react";

//Types
import { ISingleNotification } from "@/ts/interfaces/notifications.interface";
import { theNotificationsPropsType } from "@/ts/types/notifications.type";
import { notificationStatusEnum } from "@/ts/enums/notifications.enum";

//Tools
import api from "@/api";
import convertToPersian from "num-to-persian";

//Components
import {
  ArrowLeft2,
  CloseSquare,
  Edit,
  TickSquare,
  Trash,
} from "iconsax-react";

export default function Comments({
  notifications,
  totalPages,
}: theNotificationsPropsType) {
  //Next
  const router = useRouter();

  //Functions
  function changePage(index: number) {
    router.push(`/notifications?page=${index}`);
  }

  return (
    <div>
      <div className="w-full lg:w-20">
        <Button
          shadow
          bordered
          ghost
          className="z-0 w-full"
          onClick={() => router.push("/notifications/create")}
        >
          ایجاد پیام
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
          <Table.Column css={{ textAlign: "right" }}>
            ایجاد شده توسط
          </Table.Column>
          <Table.Column
            css={{
              borderRadius: "0 1rem 1rem 0",
              textAlign: "right",
              paddingRight: "12px",
            }}
          >
            کاربر
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>وضعیت</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>موضوع</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>سری</Table.Column>
          {/* <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            <span></span>
          </Table.Column> */}
        </Table.Header>
        <Table.Body>
          {notifications?.map((notification) => (
            <Table.Row css={{ zIndex: "0" }} key={notification._id}>
              <Table.Cell>
                {notification.user?.firstName} {notification.user?.lastName}
              </Table.Cell>
              <Table.Cell>{notification.createdBy?.name}</Table.Cell>
              <Table.Cell>
                {notification.status === notificationStatusEnum.SENT ? (
                  <span className="badge text-xs p-2 badge-info">
                    ارسال شده
                  </span>
                ) : notification.status === notificationStatusEnum.READ ? (
                  <span className="badge text-xs p-2 badge-success">
                    خوانده شده
                  </span>
                ) : (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                )}
              </Table.Cell>
              <Table.Cell>{notification.subject}</Table.Cell>
              <Table.Cell>{convertToPersian(notification.time)}</Table.Cell>
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let notifications: ISingleNotification[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/notifications?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      notifications = response.data.notifications;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      notifications: notifications,
      totalPages: totalPages,
    },
  };
};
