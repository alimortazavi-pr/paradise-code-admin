import { RootState } from "@/store/index";

//Types
import { ISingleUser } from "@/ts/interfaces/users.interface";

export function getUsers(state: RootState): ISingleUser[] {
  return state.users.users;
}
