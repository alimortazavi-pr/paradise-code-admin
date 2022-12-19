import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  IArticlesState,
  ISingleArticle,
} from "@/ts/interfaces/articles.interface";

const reducers = {
  setArticles: (
    state: IArticlesState<{ title: string }>,
    action: PayloadAction<ISingleArticle<{ title: string }>[]>
  ) => {
    state.articles = action.payload;
  },
  toggleDeleteArticle: (
    state: IArticlesState<{ title: string }>,
    action: PayloadAction<string>
  ) => {
    state.articles = state.articles.map((article) => {
      if (article.slug !== action.payload) {
        return article;
      }
      return { ...article, deleted: !article.deleted };
    });
  },
  setSelectedArticle: (
    state: IArticlesState<{ title: string }>,
    action: PayloadAction<ISingleArticle>
  ) => {
    state.selectedArticle = action.payload;
  },
  toggleGlobalLikeArticle: (
    state: IArticlesState<{ title: string }>
  ) => {
    if (state.selectedArticle.isLiked) {
      state.selectedArticle.isLiked = false;
      state.selectedArticle.likeCount -= 1;
    } else {
      state.selectedArticle.isLiked = true;
      state.selectedArticle.likeCount += 1;
    }
  },
  toggleGlobalBookmarkArticle: (
    state: IArticlesState<{ title: string }>
  ) => {
    state.selectedArticle.isBookmarked = !state.selectedArticle.isBookmarked;
  },
  toggleGlobalLikeArticlesList: (
    state: IArticlesState<{ title: string }>,
    action: PayloadAction<string>
  ) => {
    state.articles = state.articles.map((article) => {
      if (article._id === action.payload) {
        return {
          ...article,
          isLiked: !article.isLiked,
          likeCount: article.isLiked
            ? article.likeCount - 1
            : article.likeCount + 1,
        };
      }
      return article;
    });
  },
  toggleGlobalBookmarkArticlesList: (
    state: IArticlesState<{ title: string }>,
    action: PayloadAction<string>
  ) => {
    state.articles = state.articles.map((article) => {
      if (article._id === action.payload) {
        return {
          ...article,
          isBookmarked: !article.isBookmarked,
        };
      }
      return article;
    });
  },
};

export default reducers;
