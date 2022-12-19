import { RootState } from "@/store/index";

//Types
import { ISingleAdmin } from "@/ts/interfaces/admins.interface";

export function getAdmins(state: RootState): ISingleAdmin[] {
  return state.admins.admins;
}
