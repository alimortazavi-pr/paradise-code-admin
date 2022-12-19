import { RootState } from "@/store/index";

//Types
import { ISingleEpisode } from "@/ts/interfaces/episodes.interface";

export function getEpisodes(state: RootState): ISingleEpisode<{
  title: string;
}>[] {
  return state.episodes.episodes;
}
