export interface IAdminsState {
  admins: ISingleAdmin[];
}

export interface ISingleAdmin {
  _id?: string;
  name: string;
  nickname: string;
  mobile: string;
  profileImage: string;
  createdBy?: { name: string; nickname: string };
  deleted?: boolean;
}

export interface ICreateAdmin {
  name: string;
  nickname: string;
  mobile: string;
  profileImage: string;
}

export interface IValidationErrorsCreateAdmin {
  paths: string[];
  messages: {
    name: string;
    nickname: string;
    mobile: string;
    profileImage: string;
  };
}

export interface IEditAdmin {
  name: string;
  nickname: string;
  mobile: string;
  profileImage: string;
}

export interface IValidationErrorsEditAdmin {
  paths: string[];
  messages: {
    name: string;
    nickname: string;
    mobile: string;
    profileImage: string;
  };
}

export interface IEditProfile {
  name: string;
  nickname: string;
  mobile: string;
  profileImage: string;
}
