//Types
import { ISingleAdmin } from "@/ts/interfaces/admins.interface";

export interface IAdminState {
  token: string | null;
  admin: ISingleAdmin;
  didTryAutoLogin: boolean;
  isAdmin: boolean;
}

export interface IFormSendCode {
  mobile: string;
}

export interface IValidationErrorsSendCode {
  paths: string[];
  messages: {
    mobile: string;
  };
}

export interface IFormSignIn {
  mobile: string;
  code: string;
}

export interface IValidationErrorsSignIn {
  paths: string[];
  messages: {
    mobile: string;
    code: string;
  };
}