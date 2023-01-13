import { createSlice } from "@reduxjs/toolkit";

//Types
import { INotificationsState } from "@/ts/interfaces/notifications.interface";

//Reducers
import reducers from "@/store/notifications/reducers";

const initialState: INotificationsState = {};

export const notificationsReducer = createSlice({
  name: "notifications",
  initialState,
  reducers,
});

export default notificationsReducer.reducer;
