//Types
import { ISingleUser } from "@/ts/interfaces/users.interface";
import { ISingleCourse } from "@/ts/interfaces/courses.interface";
import { ISingleEpisode } from "@/ts/interfaces/episodes.interface";
import { ISingleArticle } from "@/ts/interfaces/articles.interface";

export interface ICommentsState {
  comments: ISingleComment[];
}

export interface ISingleComment<
  C = ISingleCourse,
  E = ISingleEpisode,
  A = ISingleArticle
> {
  _id?: string;
  user: ISingleUser | null;
  course: C | null;
  episode: E | null;
  article: A | null;
  grandParent: ISingleComment | null;
  parent: ISingleComment | null;
  type: string;
  approved: boolean;
  description: string;
  createdBy?: { name: string;nickname:string };
  createdAt?: string;
  deleted?: boolean;
  comments?: ISingleComment<C, E, A>[];
}

export interface ICreateComment {
  user: string;
  course?: string;
  episode?: string;
  article?: string;
  grandParent?: string;
  parent?: string;
  approved?: boolean;
  description: string;
}

export interface IValidationErrorsCreateComment {
  paths: string[];
  messages: {
    user: string;
    course?: string;
    episode?: string;
    article?: string;
    grandParent?: string;
    parent?: string;
    approved?: boolean;
    description: string;
  };
}

export interface IEditComment {
  user: string;
  course?: string;
  episode?: string;
  article?: string;
  grandParent?: string;
  parent?: string;
  approved?: boolean;
  description: string;
}

export interface IValidationErrorsEditComment {
  paths: string[];
  messages: {
    user: string;
    course?: string;
    episode?: string;
    article?: string;
    grandParent?: string;
    parent?: string;
    approved?: boolean;
    description: string;
  };
}
