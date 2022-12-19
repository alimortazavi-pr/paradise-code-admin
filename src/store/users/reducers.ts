import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  IUsersState,
  ISingleUser,
} from "@/ts/interfaces/users.interface";

const reducers = {
  setUsers: (
    state: IUsersState,
    action: PayloadAction<ISingleUser[]>
  ) => {
    state.users = action.payload;
  },
  toggleDeleteUser: (
    state: IUsersState,
    action: PayloadAction<string>
  ) => {
    state.users = state.users.map((user) => {
      if (user.mobile !== action.payload) {
        return user;
      }
      return { ...user, deleted: !user.deleted };
    });
  },
};

export default reducers;
