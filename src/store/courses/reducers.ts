import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  ICoursesState,
  ISingleCourse,
} from "@/ts/interfaces/courses.interface";

const reducers = {
  setCourses: (
    state: ICoursesState<{ title: string }>,
    action: PayloadAction<ISingleCourse<{ title: string }>[]>
  ) => {
    state.courses = action.payload;
  },
  toggleDeleteCourse: (
    state: ICoursesState<{ title: string }>,
    action: PayloadAction<string>
  ) => {
    state.courses = state.courses.map((course) => {
      if (course.slug !== action.payload) {
        return course;
      }
      return { ...course, deleted: !course.deleted };
    });
  },
};

export default reducers;
