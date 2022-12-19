import { createSlice } from "@reduxjs/toolkit";

//Types
import { ICategoriesState } from "@/ts/interfaces/categories.interface";

//Reducers
import reducers from "@/store/categories/reducers";

const initialState: ICategoriesState = {
  categories: [],
};

export const categoriesReducer = createSlice({
  name: "categories",
  initialState,
  reducers,
});

export default categoriesReducer.reducer;
