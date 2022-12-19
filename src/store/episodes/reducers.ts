import { PayloadAction } from "@reduxjs/toolkit";

//Types
import {
  IEpisodesState,
  ISingleEpisode,
} from "@/ts/interfaces/episodes.interface";

const reducers = {
  setEpisodes: (
    state: IEpisodesState<{ title: string }>,
    action: PayloadAction<ISingleEpisode<{ title: string }>[]>
  ) => {
    state.episodes = action.payload;
  },
  toggleDeleteEpisode: (
    state: IEpisodesState<{ title: string }>,
    action: PayloadAction<string>
  ) => {
    state.episodes = state.episodes.map((episode) => {
      if (episode.slug !== action.payload) {
        return episode;
      }
      return { ...episode, deleted: !episode.deleted };
    });
  },
};

export default reducers;
