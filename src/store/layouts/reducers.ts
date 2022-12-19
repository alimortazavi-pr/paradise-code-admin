import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  ILayoutState,
  ISingleFile,
} from "@/ts/interfaces/layouts.interface";

const reducers = {
  setFiles: (
    state: ILayoutState,
    action: PayloadAction<ISingleFile[]>
  ) => {
    state.files = action.payload;
  },
  addFile: (
    state: ILayoutState,
    action: PayloadAction<ISingleFile>
  ) => {
    state.files.unshift(action.payload);
  },
  destroyFile: (
    state: ILayoutState,
    action: PayloadAction<string>
  ) => {
    state.files = state.files.filter((file) => file._id !== action.payload);
  },
};

export default reducers;
