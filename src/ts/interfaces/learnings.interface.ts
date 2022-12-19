//Types
import { ISingleUser } from "@/ts/interfaces/users.interface";
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

export interface ILearningsState {
  learnings: ISingleLearning[];
}

export interface ISingleLearning {
  _id?: string;
  user: ISingleUser;
  course: ISingleCourse;
  deleted?: boolean;
  createdBy?: { name: string; nickname: string };
  createdAt: string;
}

export interface ICreateLearning {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    mobile: string;
  };
  course: {
    _id: string;
    title: string;
  };
}

export interface IValidationErrorsCreateLearning {
  paths: string[];
  messages: {
    user: string;
    course: string;
  };
}

export interface IEditLearning {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    mobile: string;
  };
  course: {
    _id: string;
    title: string;
  };
}

export interface IValidationErrorsEditLearning {
  paths: string[];
  messages: {
    user: string;
    course: string;
  };
}
