import { createSlice } from "@reduxjs/toolkit";

//Types
import { ICommentsState } from "@/ts/interfaces/comments.interface";

//Reducers
import reducers from "@/store/comments/reducers";

const initialState: ICommentsState = {
  comments: [],
};

export const commentsReducer = createSlice({
  name: "comments",
  initialState,
  reducers,
});

export default commentsReducer.reducer;
