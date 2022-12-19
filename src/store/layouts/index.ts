import { createSlice } from "@reduxjs/toolkit";

//Types
import { ILayoutState } from "@/ts/interfaces/layouts.interface";

//Reducers
import reducers from "@/store/layouts/reducers";

const initialState: ILayoutState = {
  files: [],
};

export const layoutsReducer = createSlice({
  name: "layouts",
  initialState,
  reducers,
});

export default layoutsReducer.reducer;
