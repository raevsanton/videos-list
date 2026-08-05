import { useState } from "preact/hooks";
import poster1 from "./assets/images/posters/girl-1.webp";
import poster2 from "./assets/images/posters/girl-2.webp";
import poster3 from "./assets/images/posters/girl-3.webp";
import poster4 from "./assets/images/posters/girl-4.webp";
import poster5 from "./assets/images/posters/girl-5.webp";
import poster6 from "./assets/images/posters/girl-6.webp";
import poster7 from "./assets/images/posters/girl-7.webp";
import poster8 from "./assets/images/posters/girl-8.webp";
import poster9 from "./assets/images/posters/girl-9.webp";
import video1 from "./assets/video/1.mp4";
import video2 from "./assets/video/2.mp4";
import video3 from "./assets/video/3.mp4";
import video4 from "./assets/video/4.mp4";
import video5 from "./assets/video/5.mp4";
import video6 from "./assets/video/6.mp4";
import video7 from "./assets/video/7.mp4";
import video8 from "./assets/video/8.mp4";
import video9 from "./assets/video/9.mp4";
import SideBar from "./components/SideBar";
import VideoSlider from "./components/VideoSlider";
import type { IVideo } from "./types";

const videosList: IVideo[] = [
  {
    name: "LunaVibe",
    title: "Late Night Secrets & Whispers 💋",
    poster: poster1,
    videoSrc: video1,
    likes: 956,
  },
  {
    name: "MiaSparkle",
    title: "Private VIP Lounge Stream 🔥",
    poster: poster2,
    videoSrc: video2,
    likes: 756,
  },
  {
    name: "SofiDream",
    title: "Midnight Temptation & Flirt 😈",
    poster: poster3,
    videoSrc: video3,
    likes: 643,
  },
  {
    name: "BellaMuse",
    title: "Naughty Mood On Live 💕",
    poster: poster4,
    videoSrc: video4,
    likes: 720,
  },
  {
    name: "VikiShine",
    title: "Seductive Vibes Only ✨",
    poster: poster5,
    videoSrc: video5,
    likes: 980,
  },
  {
    name: "EvaBliss",
    title: "Exclusive After Dark Chat 🌙",
    poster: poster6,
    videoSrc: video6,
    likes: 444,
  },
  {
    name: "NikaGlow",
    title: "Wild & Uncensored Thoughts ⚡",
    poster: poster7,
    videoSrc: video7,
    likes: 577,
  },
  {
    name: "DianaWave",
    title: "Hot Summer Night Stream 🔥",
    poster: poster8,
    videoSrc: video8,
    likes: 2503,
  },
  {
    name: "AlinaRay",
    title: "Sweet & Spicy Confessions 💖",
    poster: poster9,
    videoSrc: video9,
    likes: 3201,
  },
];

const App = () => {
  const [showJump, setShowJump] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const currentVideo = videosList[currentVideoIndex];

  return (
    <div className="relative flex h-screen h-dvh w-screen items-center justify-center overflow-hidden bg-bg-gray">
      <div className="relative h-full w-full md:max-w-[430px]">
        <div className="relative h-full w-full overflow-hidden">
          <VideoSlider
            videosList={videosList}
            setShowJump={setShowJump}
            showJump={showJump}
            setCurrentVideoIndex={setCurrentVideoIndex}
            currentVideoIndex={currentVideoIndex}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-20 text-white">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-wide drop-shadow-md">
                @{currentVideo.name}
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-bold text-[10px] text-white">
                ✓
              </span>
            </div>
            <p className="line-clamp-2 font-medium text-gray-200 text-sm leading-snug drop-shadow-sm">
              {currentVideo.title}
            </p>
          </div>
        </div>

        <SideBar currentVideoIndex={currentVideoIndex} videosList={videosList} />
      </div>
    </div>
  );
};

export default App;
