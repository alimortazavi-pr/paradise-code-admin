import { createSlice } from "@reduxjs/toolkit";

//Types
import { IAdminsState } from "@/ts/interfaces/admins.interface";

//Reducers
import reducers from "@/store/admins/reducers";

const initialState: IAdminsState = {
  admins: [],
};

export const adminsReducer = createSlice({
  name: "admins",
  initialState,
  reducers,
});

export default adminsReducer.reducer;
