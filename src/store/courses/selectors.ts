import { RootState } from "@/store/index";

//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

export function getCourses(state: RootState): ISingleCourse[] {
  return state.courses.courses;
}
