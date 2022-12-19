import { RootState } from "@/store/index";

//Types
import { ISingleLearning } from "@/ts/interfaces/learnings.interface";

export function getLearnings(state: RootState): ISingleLearning[] {
  return state.learnings.learnings;
}
