import { createSlice } from "@reduxjs/toolkit";

//Types
import { ILearningsState } from "@/ts/interfaces/learnings.interface";

//Reducers
import reducers from "@/store/learnings/reducers";

const initialState: ILearningsState = {
  learnings: [],
};

export const learningsReducer = createSlice({
  name: "learnings",
  initialState,
  reducers,
});

export default learningsReducer.reducer;
