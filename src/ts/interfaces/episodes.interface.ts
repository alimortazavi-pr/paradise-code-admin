//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

export interface IEpisodesState<T = { title: string }> {
  episodes: ISingleEpisode<T>[];
}

export interface ISingleEpisode<T = ISingleCourse> {
  _id?: string;
  title: string;
  course: T;
  slug: string;
  description: string;
  status: string | number;
  videoUrl: string;
  row: string | number;
  createdBy?: { name: string; nickname: string };
  time?: string;
  viewCount?: number;
  commentCount?: number;
  free: boolean;
  hasFiles?: boolean;
  deleted?: boolean;
}

export interface ICreateEpisode {
  title: string;
  course: { _id: string; title: string };
  slug: string;
  description: string;
  status: string;
  videoUrl: string | File;
  row: string | number;
  free: boolean;
}

export interface IValidationErrorsCreateEpisode {
  paths: string[];
  messages: {
    title: string;
    course: string;
    slug: string;
    description: string;
    status: string;
    videoUrl: string;
    row: string;
  };
}

export interface IEditEpisode {
  title: string;
  course: { _id: string; title: string };
  slug: string;
  description: string;
  status: string;
  videoUrl?: string | File;
  row: string | number;
  free: boolean;
}

export interface IValidationErrorsEditEpisode {
  paths: string[];
  messages: {
    title: string;
    course: string;
    slug: string;
    description: string;
    status: string;
    videoUrl?: string;
    row: string;
  };
}

export interface IEpisodeLevel {
  status: number;
  title: string;
}
