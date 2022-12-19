import { AppThunk } from "@/store";

//Reducer
import { adminsReducer } from ".";

//Actions from reducer
export const { setAdmins, toggleDeleteAdmin } = adminsReducer.actions;

//Types

//Tools
import api from "@/api";

//Actions from actions
export function createAdmin(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post("/admin/admins", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editAdmin(form: FormData, mobile: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/admins/${mobile}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteAdmin(mobile: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/admins/${mobile}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteAdmin(mobile));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryAdmin(mobile: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/admins/${mobile}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteAdmin(mobile));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
