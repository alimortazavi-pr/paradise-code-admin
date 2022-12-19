import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

//Reducers
import layoutsReducer from "@/store/layouts";
import authReducer from "@/store/auth";
import categoriesReducer from "@/store/categories";
import coursesReducer from "@/store/courses";
import episodesReducer from "@/store/episodes";
import usersReducer from "@/store/users";
import adminsReducer from "@/store/admins";
import learningsReducer from "@/store/learnings";
import articlesReducer from "@/store/articles";
import commentsReducer from "@/store/comments";
import ordersReducer from "@/store/orders";

export function makeStore() {
  return configureStore({
    reducer: {
      layouts: layoutsReducer,
      auth: authReducer,
      categories: categoriesReducer,
      courses: coursesReducer,
      episodes: episodesReducer,
      users: usersReducer,
      learnings: learningsReducer,
      articles: articlesReducer,
      comments: commentsReducer,
      orders: ordersReducer,
      admins: adminsReducer,
    },
  });
}

const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
