import { AppThunk } from "@/store";

//Reducer
import { notificationsReducer } from ".";

//Actions from reducer
export const {} = notificationsReducer.actions;

//Types
import { ICreateNotification } from "@/ts/interfaces/notifications.interface";

//Tools
import api from "@/api";

//Actions from actions
export function createNotification(form: ICreateNotification): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post(
        "/admin/notifications",
        { ...form, users: form.users.map((user) => user._id) },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
