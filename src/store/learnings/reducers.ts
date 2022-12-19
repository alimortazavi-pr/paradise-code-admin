import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  ILearningsState,
  ISingleLearning,
} from "@/ts/interfaces/learnings.interface";

const reducers = {
  setLearnings: (
    state: ILearningsState,
    action: PayloadAction<ISingleLearning[]>
  ) => {
    state.learnings = action.payload;
  },
  toggleDeleteLearning: (
    state: ILearningsState,
    action: PayloadAction<string>
  ) => {
    state.learnings = state.learnings.map((learning) => {
      if (learning._id !== action.payload) {
        return learning;
      }
      return { ...learning, deleted: !learning.deleted };
    });
  },
};

export default reducers;
