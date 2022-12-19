import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  ICategoriesState,
  ISingleCategory,
} from "@/ts/interfaces/categories.interface";

const reducers = {
  setCategories: (
    state: ICategoriesState<{ title: string }>,
    action: PayloadAction<ISingleCategory<{ title: string }>[]>
  ) => {
    state.categories = action.payload;
  },
  toggleDeleteCategory: (
    state: ICategoriesState<{ title: string }>,
    action: PayloadAction<string>
  ) => {
    state.categories = state.categories.map((category) => {
      if (category.slug !== action.payload) {
        return category;
      }
      return { ...category, deleted: !category.deleted };
    });
  },
};

export default reducers;
