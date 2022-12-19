import { AppThunk } from "@/store";

//Reducer
import { ordersReducer } from ".";

//Actions from reducer
export const {
  setPreOrdersOnStates,
  deleteGlobalPreOrder,
  addCourseToGlobalCart,
} = ordersReducer.actions;

//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

//Tools
import api from "@/api";

//Actions from actions
export function setPreOrders(page: number = 1): AppThunk {
  return async (dispatch, getState) => {
    try {
      const preOrders = await api.get(`/profile/pre-orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(setPreOrdersOnStates(preOrders.data.preOrders));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function addToCart(course: ISingleCourse): AppThunk {
  return async (dispatch, getState) => {
    try {
      const preOrder = await api.post(
        "/profile/pre-orders",
        { course: course._id },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      dispatch(addCourseToGlobalCart(preOrder.data.preOrder));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deletePreOrder(preOrderId: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/profile/pre-orders/${preOrderId}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(deleteGlobalPreOrder(preOrderId));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function createFreeOrder(courseId: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.post(
        "/profile/orders/free-course",
        { course: courseId },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
