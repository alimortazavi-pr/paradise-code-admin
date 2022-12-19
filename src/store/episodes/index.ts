import { createSlice } from "@reduxjs/toolkit";

//Types
import { IEpisodesState } from "@/ts/interfaces/episodes.interface";

//Reducers
import reducers from "@/store/episodes/reducers";

const initialState: IEpisodesState = {
  episodes: [],
};

export const episodesReducer = createSlice({
  name: "episodes",
  initialState,
  reducers,
});

export default episodesReducer.reducer;
