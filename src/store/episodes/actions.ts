import { AppThunk } from "@/store";

//Reducer
import { episodesReducer } from ".";

//Actions from reducer
export const { setEpisodes, toggleDeleteEpisode } = episodesReducer.actions;

//Types

//Tools
import api from "@/api";

//Actions from actions
export function createEpisode(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post("/admin/episodes", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editEpisode(form: FormData, slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/episodes/${slug}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteEpisode(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/episodes/${slug}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteEpisode(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryEpisode(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/episodes/${slug}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteEpisode(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
