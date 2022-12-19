import Plyr from "plyr-react";

export default function MyPlyrVideo({ videoSrc }: { videoSrc: string }) {
  return (
    <Plyr
      source={{
        type: "video",
        sources: [
          {
            src: videoSrc,
          },
        ],
      }}
    />
  );
}
