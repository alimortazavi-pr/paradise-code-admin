import { RootState } from "@/store/index";

//Types
import { IOrdersState } from "@/ts/interfaces/orders.interface";

export function getPreOrders(state: RootState): IOrdersState["preOrders"] {
  return state.orders.preOrders;
}
