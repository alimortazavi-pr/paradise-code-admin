import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  IAdminsState,
  ISingleAdmin,
} from "@/ts/interfaces/admins.interface";

const reducers = {
  setAdmins: (
    state: IAdminsState,
    action: PayloadAction<ISingleAdmin[]>
  ) => {
    state.admins = action.payload;
  },
  toggleDeleteAdmin: (
    state: IAdminsState,
    action: PayloadAction<string>
  ) => {
    state.admins = state.admins.map((admin) => {
      if (admin.mobile !== action.payload) {
        return admin;
      }
      return { ...admin, deleted: !admin.deleted };
    });
  },
};

export default reducers;
