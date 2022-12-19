export interface ICategoriesState<T = { title: string }> {
  categories: ISingleCategory<T>[];
}

export interface ISingleCategory<T = { title: string }> {
  _id?: string;
  title: string;
  grandParent: T;
  slug: string;
  createdBy?: { name: string;nickname:string };
  deleted?: boolean;
  type: string;
}

export interface ICreateCategory {
  title: string;
  type: string;
  grandParent?: string | null;
}

export interface IValidationErrorsCreateCategory {
  paths: string[];
  messages: {
    title: string;
    type: string;
    grandParent?: string | null;
  };
}

export interface IEditCategory {
  title: string;
  type: string;
  grandParent?: string | null;
}

export interface IValidationErrorsEditCategory {
  paths: string[];
  messages: {
    title: string;
    type: string;
    grandParent?: string | null;
  };
}
