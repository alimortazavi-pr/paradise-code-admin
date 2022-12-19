//Types
import { ISingleAdmin } from "@/ts/interfaces/admins.interface";

export interface IArticlesState<T = { title: string }> {
  articles: ISingleArticle<T>[];
  selectedArticle: ISingleArticle<T>;
}

export interface ISingleArticle<T = { title: string }> {
  _id?: string;
  title: string;
  category: T;
  slug: string;
  content: string;
  status: string | number;
  imageThumb: string;
  introductionVideo: string;
  createdBy?: ISingleAdmin;
  createdAt?: string;
  readingTime?: string;
  viewCount?: number;
  commentCount?: number;
  likeCount: number;
  bookmarkCount?: number;
  isLiked: boolean;
  isBookmarked: boolean;
  deleted?: boolean;
}

export interface ICreateArticle {
  title: string;
  category: string;
  slug: string;
  content: string;
  status: string;
  readingTime: string;
  imageThumb: string | File;
  introductionVideo: string | File;
}

export interface IValidationErrorsCreateArticle {
  paths: string[];
  messages: {
    title: string;
    category: string;
    slug: string;
    content: string;
    status: string;
    readingTime: string;
    imageThumb: string;
    introductionVideo: string;
  };
}

export interface IEditArticle {
  title: string;
  category: string;
  slug: string;
  content: string;
  status: string;
  readingTime: string;
  imageThumb?: string | File;
  introductionVideo?: string | File;
}

export interface IValidationErrorsEditArticle {
  paths: string[];
  messages: {
    title: string;
    category: string;
    slug: string;
    content: string;
    status: string;
    readingTime: string;
    imageThumb?: string;
    introductionVideo?: string;
  };
}

export interface IArticleLevel {
  status: number;
  title: string;
}

export interface ISingleBookmark {
  user: string;
  article: ISingleArticle;
}
