import { createSlice } from "@reduxjs/toolkit";

//Types
import { ICoursesState } from "@/ts/interfaces/courses.interface";

//Reducers
import reducers from "@/store/courses/reducers";

const initialState: ICoursesState = {
  courses: [],
};

export const coursesReducer = createSlice({
  name: "courses",
  initialState,
  reducers,
});

export default coursesReducer.reducer;
