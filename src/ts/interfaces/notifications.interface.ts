import { ISingleAdmin } from "./admins.interface";
import { ISingleUser } from "./users.interface";

export interface ISingleNotification {
  createdBy: ISingleAdmin;
  user: ISingleUser;
  subject: string;
  description: string;
  status: number; // {0:"sent",1:"read",2:"deleted"},
}
