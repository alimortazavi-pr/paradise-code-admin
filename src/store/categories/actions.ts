import { AppThunk } from "@/store";

//Reducer
import { categoriesReducer } from ".";

//Actions from reducer
export const { setCategories, toggleDeleteCategory } = categoriesReducer.actions;

//Types
import { IEditCategory } from '@/ts/interfaces/categories.interface';

//Tools
import api from "@/api";

//Actions from actions
export function createCategory(form: IEditCategory): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post("/admin/categories", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editCategory(form: IEditCategory, slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/categories/${slug}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteCategory(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/categories/${slug}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteCategory(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryCategory(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/categories/${slug}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteCategory(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
