import { AppThunk } from "@/store";

//Reducer
import { coursesReducer } from ".";

//Actions from reducer
export const { setCourses, toggleDeleteCourse } = coursesReducer.actions;

//Types

//Tools
import api from "@/api";

//Actions from actions
export function createCourse(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post("/admin/courses", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editCourse(form: FormData, slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/courses/${slug}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteCourse(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/courses/${slug}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteCourse(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryCourse(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/courses/${slug}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteCourse(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}