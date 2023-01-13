import { ISingleAdmin } from "./admins.interface";
import { ISingleUser } from "./users.interface";

export interface INotificationsState {}

export interface ISingleNotification {
  _id?: string;
  createdBy: ISingleAdmin;
  user: ISingleUser;
  subject: string;
  description: string;
  status: number;
  time: number;
}

export interface ICreateNotification {
  users: ISingleUserForCreateNotification[];
  subject: string;
  description: string;
}

export interface IValidationErrorsCreateNotification {
  paths: string[];
  messages: {
    users: string;
    subject: string;
    description: string;
  };
}

export interface ISingleUserForCreateNotification {
  _id: string;
  firstName: string;
  lastName: string;
  mobile: string;
}
