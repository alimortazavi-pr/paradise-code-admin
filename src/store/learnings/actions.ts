import { AppThunk } from "@/store";

//Reducer
import { learningsReducer } from ".";

//Actions from reducer
export const { setLearnings, toggleDeleteLearning } = learningsReducer.actions;

//Types
import {
  ICreateLearning,
  IEditLearning,
} from "@/ts/interfaces/learnings.interface";

//Tools
import api from "@/api";

//Actions from actions
export function createLearning(form: ICreateLearning): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post(
        "/admin/learnings",
        { user: form.user._id, course: form.course._id },
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

export function editLearning(
  form: IEditLearning,
  _id: string
): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/learnings/${_id}`,
        { user: form.user._id, course: form.course._id },
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

export function deleteLearning(_id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/learnings/${_id}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteLearning(_id));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryLearning(_id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/learnings/${_id}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteLearning(_id));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
