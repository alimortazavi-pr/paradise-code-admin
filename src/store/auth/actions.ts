import { AppThunk } from "@/store";

//Reducer
import { adminReducer } from "@/store/auth";

//Actions from reducer
export const { authenticate, setDidTryAutoLogin, logOut } =
  adminReducer.actions;

//Tools
import api from "@/api";
import Cookies from "js-cookie";

//Actions from actions
export function autoLogin(): AppThunk {
  return async (dispatch) => {
    try {
      const adminAuthorization = Cookies.get("adminAuthorization");
      if (adminAuthorization) {
        const transformedData = JSON.parse(adminAuthorization);
        const res = await api.get("/auth/admin/check", {
          headers: {
            Authorization: `Bearer ${transformedData.token}`,
          },
        });
        dispatch(
          authenticate({
            user: res.data.admin,
            token: transformedData.token,
          })
        );
      } else {
        dispatch(logOut());
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        dispatch(logOut());
      } else {
        console.log(err);
      }
    }
  };
}

export function sendCode(form: { mobile: string }): AppThunk {
  return async () => {
    try {
      await api.post("/auth/admin/send-code", form);
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function signIn(form: { mobile: string; code: string }): AppThunk {
  return async (dispatch) => {
    try {
      const res = await api.post("/auth/admin/login", form);
      dispatch(
        authenticate({
          user: res.data.admin,
          token: res.data.token,
        })
      );
      saveDataToLocal(res.data.token, res.data.admin);
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editProfile(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      const res = await api.put(`/admin/profile`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(
        authenticate({
          user: res.data.profile,
          token: getState().auth.token,
        })
      );
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

function saveDataToLocal(token: string, user: object) {
  console.log(token, user);

  Cookies.set(
    "adminAuthorization",
    JSON.stringify({
      token: token,
      user: user,
    })
  );
}
