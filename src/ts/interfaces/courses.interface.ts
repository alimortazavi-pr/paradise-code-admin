//Types
import { ISingleEpisode } from "./episodes.interface";

export interface ICoursesState<T = { title: string }> {
  courses: ISingleCourse<T>[];
}

export interface ISingleCourse<T = { title: string }> {
  _id?: string;
  title: string;
  category: T;
  slug: string;
  description: string;
  shortDescription: string;
  price: string | number;
  discount: string | number;
  status: string | number;
  imageThumb: string;
  introductionVideo: string;
  createdBy?: { name: string; nickname: string };
  time?: string;
  viewCount?: number;
  commentCount?: number;
  deleted?: boolean;
  episodes?: ISingleEpisode[];
  createdAt?: string;
  updatedAt: string;
  isCourseInPreOrder: boolean;
  isBought: boolean;
}

export interface ICreateCourse {
  title: string;
  category: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  status: string;
  imageThumb: string | File;
  introductionVideo: string | File;
}

export interface IValidationErrorsCreateCourse {
  paths: string[];
  messages: {
    title: string;
    category: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: string;
    status: string;
    imageThumb: string;
    introductionVideo: string;
  };
}

export interface IEditCourse {
  title: string;
  category: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  status: string;
  imageThumb?: string | File;
  introductionVideo?: string | File;
}

export interface IValidationErrorsEditCourse {
  paths: string[];
  messages: {
    title: string;
    category: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: string;
    status: string;
    imageThumb?: string;
    introductionVideo?: string;
  };
}

export interface ICourseLevel {
  status: number;
  title: string;
}
