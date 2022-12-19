import { AppThunk } from "@/store";

//Reducer
import { commentsReducer } from ".";

//Actions from reducer
export const { setComments, toggleDeleteComment, toggleApproveComment } =
  commentsReducer.actions;

//Types
import {
  ICreateComment,
  IEditComment,
} from "@/ts/interfaces/comments.interface";

//Tools
import api from "@/api";

//Actions from actions
export function createComment(form: ICreateComment): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post(
        "/comments",
        { ...form, user: getState().auth.user._id as string },
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

export function editComment(form: IEditComment, _id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/comments/${_id}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function approveComment(_id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/comments/${_id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleApproveComment(_id));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function disapproveComment(_id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/comments/${_id}/disapprove`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleApproveComment(_id));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteComment(_id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/comments/${_id}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteComment(_id));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryComment(_id: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/comments/${_id}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteComment(_id));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function getCommentsOfCourse(courseId: string, page: number): AppThunk {
  return async (dispatch, getState) => {
    try {
      const comments = await api.get(
        `/comments/courses/${courseId}?page=${page}`
      );
      return comments.data;
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function getCommentsOfEpisode(episodeId: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      const comments = await api.get(`/comments/episodes/${episodeId}`);
      return comments.data;
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function getCommentsOfArticle(articleId: string, page: number): AppThunk {
  return async (dispatch, getState) => {
    try {
      const comments = await api.get(
        `/comments/articles/${articleId}?page=${page}`
      );
      return comments.data;
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}