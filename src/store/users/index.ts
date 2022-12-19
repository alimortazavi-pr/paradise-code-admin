import { createSlice } from "@reduxjs/toolkit";

//Types
import { IUsersState } from "@/ts/interfaces/users.interface";

//Reducers
import reducers from "@/store/users/reducers";

const initialState: IUsersState = {
  users: [],
};

export const usersReducer = createSlice({
  name: "users",
  initialState,
  reducers,
});

export default usersReducer.reducer;
