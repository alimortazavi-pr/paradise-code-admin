import { AppThunk } from "@/store";

//Reducer
import { articlesReducer } from ".";

//Actions from reducer
export const {
  setArticles,
  toggleDeleteArticle,
  setSelectedArticle,
  toggleGlobalLikeArticle,
  toggleGlobalBookmarkArticle,
  toggleGlobalBookmarkArticlesList,
  toggleGlobalLikeArticlesList,
} = articlesReducer.actions;

//Types

//Tools
import api from "@/api";

//Actions from actions
export function createArticle(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post("/admin/articles", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function editArticle(form: FormData, slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(`/admin/articles/${slug}`, form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteArticle(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(toggleDeleteArticle(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function recoveryArticle(slug: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/admin/articles/${slug}/recovery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(toggleDeleteArticle(slug));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function toggleLike(
  articleId: string,
  articlesList: boolean = false
): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/profile/articles/toggle-like`,
        { article: articleId },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      if (articlesList) {
        dispatch(toggleGlobalLikeArticlesList(articleId));
      } else {
        dispatch(toggleGlobalLikeArticle());
      }
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function toggleBookmark(
  articleId: string,
  articlesList: boolean = false
): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.put(
        `/profile/articles/toggle-bookmark`,
        { article: articleId },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      if (articlesList) {
        dispatch(toggleGlobalBookmarkArticlesList(articleId));
      } else {
        dispatch(toggleGlobalBookmarkArticle());
      }
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
