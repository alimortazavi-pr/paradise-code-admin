import { PayloadAction } from "@reduxjs/toolkit";

//Types
import { IAdminState } from "@/ts/interfaces/auth.interface";
import Cookies from 'js-cookie'

const reducers = {
  authenticate: (state: IAdminState, action: PayloadAction<any>) => {
    return {
      ...state,
      token: action.payload.token,
      user: { ...action.payload.user, token: action.payload.token },
      didTryAutoLogin: true,
      isAdmin: true,
    };
  },
  setDidTryAutoLogin: (state: IAdminState) => {
    return {
      ...state,
      didTryAutoLogin: true,
    };
  },
  logOut: (state: IAdminState) => {
    Cookies.remove('adminAuthorization')
    return {
      ...state,
      didTryAutoLogin: true,
      isAdmin: false,
    };
  },
};

export default reducers;
