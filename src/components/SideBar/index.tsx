import type { JSX } from "preact";
import { memo } from "preact/compat";
import { useState } from "preact/hooks";

import mute from "../../assets/images/mute.svg";
import share from "../../assets/images/share.svg";
import type { IVideo } from "../../types";
import Like from "../Like";

interface ISideBar {
  currentVideoIndex: number;
  videosList: IVideo[];
}

const SideBar = ({ currentVideoIndex, videosList }: ISideBar) => {
  const [likesArr, setLikesArr] = useState(videosList.map((element) => element.likes));
  const [isLikedArr, setIsLikedArr] = useState(videosList.map(() => false));

  const likeNumber = likesArr[currentVideoIndex];
  const isLiked = isLikedArr[currentVideoIndex];

  const poster = videosList[currentVideoIndex].poster;

  const handleLike = (e: JSX.TargetedMouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsLikedArr((arr) => arr.map((l, i) => (i === currentVideoIndex ? !l : l)));
    setLikesArr((arr) =>
      arr.map((count, i) =>
        i === currentVideoIndex ? (isLikedArr[i] ? count - 1 : count + 1) : count,
      ),
    );
  };

  return (
    <div className="absolute right-4 bottom-[10rem] z-[93] flex flex-col items-center md:right-auto md:bottom-16 md:left-[calc(100%+16px)]">
      <div className="relative mb-3 h-[60px] w-[60px] shrink-0">
        <img
          src={poster}
          alt="poster"
          className="aspect-square h-[60px] w-[60px] shrink-0 animate-poster rounded-full border-[3px] border-red-500 object-cover shadow-[0_0_10px_red]"
        />
        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 rounded-[5px] bg-[red] px-2 py-[3px] font-bold text-[10px] text-white uppercase">
          Live
        </div>
      </div>
      <Like likeNumber={likeNumber} isLiked={isLiked} handleLike={handleLike} />
      <img
        src={share}
        alt="share"
        className="mb-2 aspect-square h-[35px] w-[35px] shrink-0 cursor-pointer object-contain"
      />
      <img
        src={mute}
        alt="mute"
        className="aspect-square h-[35px] w-[35px] shrink-0 cursor-pointer object-contain"
      />
    </div>
  );
};

export default memo(SideBar);
