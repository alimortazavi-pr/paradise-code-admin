import { RootState } from "@/store/index";

//Types
import { ISingleArticle } from "@/ts/interfaces/articles.interface";

export function getArticles(state: RootState): ISingleArticle[] {
  return state.articles.articles;
}

export function getArticle(state: RootState): ISingleArticle {
  return state.articles.selectedArticle;
}
