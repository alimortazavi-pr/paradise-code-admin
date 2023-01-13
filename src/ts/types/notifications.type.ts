//Interfaces
import { Dispatch, SetStateAction } from "react";
import {
  ICreateNotification,
  ISingleNotification,
  ISingleUserForCreateNotification,
} from "../interfaces/notifications.interface";
import { ISingleUser } from "../interfaces/users.interface";

export type createNotificationPropsType = {
  users: ISingleUser[];
};

export type selectedUsersPropsType = {
  form: ICreateNotification;
  setForm: Dispatch<SetStateAction<ICreateNotification>>;
};

export type infiniteScrollUsersPropsType = {
  users: ISingleUser[];
  form: ICreateNotification;
  setForm: Dispatch<SetStateAction<ICreateNotification>>;
};

export type theNotificationsPropsType = {
  notifications: ISingleNotification[];
  totalPages: number;
};
