import { createSlice } from "@reduxjs/toolkit";

//Types
import { IAdminState } from "@/ts/interfaces/auth.interface";

//Reducers
import reducers from "@/store/auth/reducers";

const initialState: IAdminState = {
  token: null,
  admin: {
    _id: "",
    name: "",
    nickname: "",
    mobile: "",
    profileImage: "",
    createdBy: { name: "", nickname: "" },
    deleted: false,
  },
  didTryAutoLogin: false,
  isAdmin: false,
};

export const adminReducer = createSlice({
  name: "auth",
  initialState,
  reducers,
});

export default adminReducer.reducer;
