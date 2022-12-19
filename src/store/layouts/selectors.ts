import { RootState } from "@/store/index";

//Types
import { ISingleFile } from "@/ts/interfaces/layouts.interface";

export function getFiles(state: RootState): ISingleFile[] {
  return state.layouts.files;
}
