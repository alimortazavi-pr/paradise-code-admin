import { AppThunk } from "@/store";

//Reducer
import { usersReducer } from ".";

//Actions from reducer
export const { setUsers, toggleDeleteUser } = usersReducer.actions;

//Types

//Tools
import api from "@/api";

//Actions from actions
export function createUser(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post("/admin/users", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editUser(form: FormData, mobile: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/users/${mobile}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteUser(mobile: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/users/${mobile}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteUser(mobile));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryUser(mobile: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/users/${mobile}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteUser(mobile));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
