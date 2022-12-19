export interface IUsersState {
  users: ISingleUser[];
}

export interface ISingleUser {
  _id?: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  profileImage: string;
  createdBy?: { name: string; nickname: string };
  password: string;
  mobileActive?: boolean | string;
  deleted?: boolean;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  profileImage: string;
  password: string;
  mobileActive: boolean | string;
}

export interface IValidationErrorsCreateUser {
  paths: string[];
  messages: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    profileImage: string;
    password: string;
  };
}

export interface IEditUser {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  profileImage: string | File;
  password: string;
  mobileActive: boolean | string;
}

export interface IValidationErrorsEditUser {
  paths: string[];
  messages: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    profileImage: string;
    password: string;
  };
}

export interface IEditProfile {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  profileImage: string | File;
  password: string | null;
}
