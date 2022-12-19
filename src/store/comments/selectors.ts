import { RootState } from "@/store/index";

//Types
import { ISingleComment } from "@/ts/interfaces/comments.interface";

export function getComments(state: RootState): ISingleComment[] {
  return state.comments.comments;
}
