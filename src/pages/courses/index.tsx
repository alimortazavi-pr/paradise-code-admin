import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCourses } from "@/store/courses/actions";
import { getCourses } from "@/store/courses/selectors";

//Tools
import api from "@/api";

//Components
import DeleteCourseModal from "@/components/courses/DeleteCourseModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  courses: ISingleCourse<{ title: string }>[];
  totalPages: number;
};
export default function Courses({ courses, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const coursesGlobal = useAppSelector(getCourses);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [courseSelected, setCourseSelected] =
    useState<ISingleCourse<{ title: string }>>();

  //Effects
  useEffect(() => {
    dispatch(setCourses(courses));
  }, [courses, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/courses?page=${index}`);
  }

  function destroyCourse(course: ISingleCourse<{ title: string }>) {
    setCourseSelected(course);
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
          onClick={() => router.push("/courses/create")}
        >
          ایجاد دوره
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
            عنوان
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>مدرس</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>دسته بندی</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>قیمت</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>وضعیت</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>حذف شده</Table.Column>
          <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            {" "}
            <span></span>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {coursesGlobal.map((course) => (
            <Table.Row css={{ zIndex: "0" }} key={course._id}>
              <Table.Cell>{course.title}</Table.Cell>
              <Table.Cell>{course.createdBy?.name}</Table.Cell>
              <Table.Cell>{course.category?.title}</Table.Cell>
              <Table.Cell>{course.price}</Table.Cell>
              <Table.Cell>
                {course.status === 0 ? (
                  <span className="badge text-xs p-2 badge-warning">
                    پیش نویس
                  </span>
                ) : course.status === 1 ? (
                  <span className="badge text-xs p-2 badge-info">
                    درحال ضبط
                  </span>
                ) : course.status === 2 ? (
                  <span className="badge text-xs p-2 badge-success">
                    تمام شده
                  </span>
                ) : null}
              </Table.Cell>
              <Table.Cell>
                {course.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!course.deleted ? (
                    <div
                      onClick={() => destroyCourse(course)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyCourse(course)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/courses/${course.slug}`}
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
      <DeleteCourseModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        course={courseSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let courses: ISingleCourse[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/courses?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      courses = response.data.courses;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      courses: courses,
      totalPages: totalPages,
    },
  };
};
