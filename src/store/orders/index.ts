import { createSlice } from "@reduxjs/toolkit";

//Types
import { IOrdersState } from "@/ts/interfaces/orders.interface";

//Reducers
import reducers from "@/store/orders/reducers";

const initialState: IOrdersState = {
  orders: [],
  preOrders: [],
};

export const ordersReducer = createSlice({
  name: "orders",
  initialState,
  reducers,
});

export default ordersReducer.reducer;
