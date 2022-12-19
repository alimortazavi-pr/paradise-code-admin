//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";
import { ISingleUser } from "@/ts/interfaces/users.interface";

export interface IOrdersState {
  orders: ISinglePreOrder[];
  preOrders: ISinglePreOrder[];
}

export interface ISinglePreOrder {
  _id: string;
  user: ISingleUser;
  course: ISingleCourse;
  paymentStatus: boolean;
  deleted: boolean;
}
