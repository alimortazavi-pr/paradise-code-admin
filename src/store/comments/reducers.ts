import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  ICommentsState,
  ISingleComment,
} from "@/ts/interfaces/comments.interface";

const reducers = {
  setComments: (
    state: ICommentsState,
    action: PayloadAction<ISingleComment[]>
  ) => {
    state.comments = action.payload;
  },
  toggleApproveComment: (
    state: ICommentsState,
    action: PayloadAction<string>
  ) => {
    state.comments = state.comments.map((comment) => {
      if (comment._id !== action.payload) {
        return comment;
      }
      return { ...comment, approved: !comment.approved };
    });
  },
  toggleDeleteComment: (
    state: ICommentsState,
    action: PayloadAction<string>
  ) => {
    state.comments = state.comments.map((comment) => {
      if (comment._id !== action.payload) {
        return comment;
      }
      return { ...comment, deleted: !comment.deleted };
    });
  },
};

export default reducers;
