import { RootState } from "@/store/index";

//Types
import { ISingleCategory } from "@/ts/interfaces/categories.interface";

export function getCategories(state: RootState): ISingleCategory[] {
  return state.categories.categories;
}
