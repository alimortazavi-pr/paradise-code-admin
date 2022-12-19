import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { Button } from "@nextui-org/react";

//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";
import { ICreateLearning } from "@/ts/interfaces/learnings.interface";

//Redux
import { useAppSelector } from "@/store/hooks";
import { getToken } from "@/store/auth/selectors";

//Tools
import api from "@/api";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  courses: ISingleCourse[];
  form: any;
  setForm: any;
  setVisible: any;
};
export default function InfiniteScrollCourses({
  courses,
  form,
  setForm,
  setVisible,
}: Props) {
  //Redux
  const adminToken = useAppSelector(getToken);

  //States
  const [coursePage, setCoursePage] = useState<number>(1);
  const [coursesContainer, setCoursesContainer] = useState<ISingleCourse[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  //Effects
  useEffect(() => {
    if (courses.length <= 0) {
      setHasMore(false)
    }
    setCoursesContainer(courses);
  }, [courses]);

  //Functions
  async function getMoreCourses() {
    try {
      const res = await api.get(
        `/admin/variables/courses?page=${coursePage + 1}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (res.data.courses.length === 0) {
        setHasMore(false);
      }
      setCoursesContainer([...coursesContainer, ...res.data.courses]);
      setCoursePage(coursePage + 1);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  function setCourse(course: ICreateLearning["course"]) {
    setForm({
      ...form,
      course: course,
    });
    setVisible(false);
  }

  return (
    <div
      className="h-52 w-full bg-gray-100 bg-opacity-20 mt-5 rounded-xl overflow-y-auto px-2"
      id="scrollableCoursesContainer"
    >
      <InfiniteScroll
        dataLength={coursesContainer.length}
        next={getMoreCourses}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableCoursesContainer"
      >
        {coursesContainer.map((course) => (
          <Button
            key={course._id}
            className="w-full my-2"
            bordered
            color={"secondary"}
            onClick={() =>
              setCourse({
                _id: course._id as string,
                title: course.title,
              })
            }
          >
            {course.title}
          </Button>
        ))}
      </InfiniteScroll>
    </div>
  );
}
