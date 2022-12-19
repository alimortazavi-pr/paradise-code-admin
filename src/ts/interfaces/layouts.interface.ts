import { ISingleAdmin } from "./admins.interface";

export interface IServerError {
  message: string;
  statusCode: number;
  hasError: boolean;
}

export interface ILayoutState {
  files: ISingleFile[];
}

export interface ISingleFile {
  _id: string;
  createdBy: ISingleAdmin;
  name: string;
  path: string;
  type: "image" | "video";
  deleted: boolean;
}
