import { createSlice } from "@reduxjs/toolkit";

//Types
import { IArticlesState } from "@/ts/interfaces/articles.interface";

//Reducers
import reducers from "@/store/articles/reducers";

const initialState: IArticlesState = {
  articles: [],
  selectedArticle: {
    _id: "",
    title: "",
    category: { title: "" },
    slug: "",
    content: "",
    status: 0,
    imageThumb: "",
    introductionVideo: "",
    createdBy: {
      name: "",
      nickname: "",
      mobile: "",
      profileImage: "",
    },
    createdAt: "",
    readingTime: "",
    viewCount: 0,
    commentCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    isLiked: false,
    isBookmarked: false,
    deleted: false,
  },
};

export const articlesReducer = createSlice({
  name: "articles",
  initialState,
  reducers,
});

export default articlesReducer.reducer;
