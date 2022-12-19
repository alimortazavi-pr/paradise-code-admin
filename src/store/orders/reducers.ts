import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  IOrdersState,
  ISinglePreOrder,
} from "@/ts/interfaces/orders.interface";

const reducers = {
  setPreOrdersOnStates: (
    state: IOrdersState,
    action: PayloadAction<IOrdersState["preOrders"]>
  ) => {
    state.preOrders = action.payload;
  },
  addCourseToGlobalCart: (
    state: IOrdersState,
    action: PayloadAction<ISinglePreOrder>
  ) => {
    state.preOrders.push(action.payload);
  },
  deleteGlobalPreOrder: (
    state: IOrdersState,
    action: PayloadAction<string>
  ) => {
    state.preOrders = state.preOrders.filter(
      (preOrder) => preOrder._id !== action.payload
    );
  },
};

export default reducers;
