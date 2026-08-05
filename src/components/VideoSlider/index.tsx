import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SNAP_MS, useVideoFeed } from "../../hooks/useVideoFeed";
import type { IVideo } from "../../types";

const INACTIVE_TIMEOUT = 3000;
const JUMP_ANIMATION_DURATION = 1000;
const JUMP_ANIMATION_INTERVAL = 4000;

interface VideoSliderProps {
  videosList: IVideo[];
  setShowJump: (show: boolean) => void;
  showJump: boolean;
  setCurrentVideoIndex: (index: number | ((prev: number) => number)) => void;
  currentVideoIndex: number;
  onVideoViewed?: (index: number) => void;
}

const VideoSlider = ({
  videosList,
  setShowJump,
  showJump,
  setCurrentVideoIndex,
  currentVideoIndex,
}: VideoSliderProps) => {
  const total = videosList.length;

  const [snapTransition, setSnapTransition] = useState("");
  const [readyVideoIndexes, setReadyVideoIndexes] = useState<Set<number>>(() => new Set());
  const feedRef = useRef<HTMLDivElement>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDragOffset = useCallback((offset: number) => {
    feedRef.current?.style.setProperty("--feed-drag-offset", `${offset}px`);
  }, []);

  const markVideoReady = useCallback((index: number) => {
    setReadyVideoIndexes((previous) => {
      if (previous.has(index)) return previous;

      return new Set(previous).add(index);
    });
  }, []);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
  }, []);

  const handleSnapBack = useCallback(() => {
    clearTransitionTimer();
    setSnapTransition(`transform ${SNAP_MS}ms cubic-bezier(0.25,1,0.5,1)`);
    setDragOffset(0);

    transitionTimer.current = setTimeout(() => {
      setSnapTransition("");
      transitionTimer.current = null;
    }, SNAP_MS);
  }, [clearTransitionTimer, setDragOffset]);

  const handleCommit = useCallback(
    (dir: "up" | "down") => {
      const target = dir === "up" ? -window.innerHeight : window.innerHeight;

      clearTransitionTimer();
      setSnapTransition(`transform ${SNAP_MS}ms cubic-bezier(0.25,1,0.5,1)`);
      setDragOffset(target);

      transitionTimer.current = setTimeout(() => {
        setCurrentVideoIndex((prev) => {
          const next = dir === "up" ? (prev + 1) % total : (prev - 1 + total) % total;

          return next;
        });

        setDragOffset(0);
        setSnapTransition("");
        transitionTimer.current = null;
      }, SNAP_MS);
    },
    [clearTransitionTimer, total, setCurrentVideoIndex, setDragOffset],
  );

  useVideoFeed({
    containerRef: feedRef,
    onCommit: handleCommit,
    onDragUpdate: setDragOffset,
    onSnapBack: handleSnapBack,
  });

  useEffect(
    () => () => {
      clearTransitionTimer();
    },
    [clearTransitionTimer],
  );

  const [isUserInactive, setUserInactive] = useState(false);
  const inactiveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactive = useCallback(() => {
    setUserInactive(false);

    if (inactiveRef.current) {
      clearTimeout(inactiveRef.current);
    }

    inactiveRef.current = setTimeout(() => {
      setUserInactive(true);
    }, INACTIVE_TIMEOUT);
  }, []);

  useEffect(() => {
    setUserInactive(true);

    const events = ["touchstart", "mousedown", "wheel", "keydown"];

    for (const event of events) {
      window.addEventListener(event, resetInactive, {
        passive: true,
      });
    }

    return () => {
      if (inactiveRef.current) {
        clearTimeout(inactiveRef.current);
      }

      for (const event of events) {
        window.removeEventListener(event, resetInactive);
      }
    };
  }, [resetInactive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    if (isUserInactive) {
      const animate = () => {
        setShowJump(true);

        timeout = setTimeout(() => {
          setShowJump(false);
        }, JUMP_ANIMATION_DURATION);
      };

      animate();

      interval = setInterval(animate, JUMP_ANIMATION_INTERVAL);
    } else {
      setShowJump(false);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isUserInactive, setShowJump]);

  const prevIndex = (currentVideoIndex - 1 + total) % total;
  const nextIndex = (currentVideoIndex + 1) % total;

  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  useEffect(() => {
    for (const [idx, el] of videoRefs.current.entries()) {
      if (idx === currentVideoIndex) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, [currentVideoIndex]);

  useEffect(() => {
    const pauseVideos = () => {
      if (document.visibilityState === "hidden") {
        for (const el of videoRefs.current.values()) el.pause();
      } else {
        videoRefs.current
          .get(currentVideoIndex)
          ?.play()
          .catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", pauseVideos);
    return () => document.removeEventListener("visibilitychange", pauseVideos);
  }, [currentVideoIndex]);

  const slides = useMemo(
    () => [
      {
        index: prevIndex,
        video: videosList[prevIndex],
        translate: -100,
        active: false,
      },
      {
        index: currentVideoIndex,
        video: videosList[currentVideoIndex],
        translate: 0,
        active: true,
      },
      {
        index: nextIndex,
        video: videosList[nextIndex],
        translate: 100,
        active: false,
      },
    ],
    [prevIndex, currentVideoIndex, nextIndex, videosList],
  );

  return (
    <div ref={feedRef} className="relative h-full w-full touch-pan-x overflow-hidden">
      {slides.map(({ index, video, translate, active }) => (
        <div
          key={index}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(calc(${translate}vh + var(--feed-drag-offset, 0px)))`,
            transition: snapTransition,
          }}
        >
          <div className={`video-jump-container${active && showJump ? "jump-animate" : ""}`}>
            <video
              src={video.videoSrc}
              muted
              loop
              playsInline
              preload={translate === -100 ? "metadata" : "auto"}
              poster={readyVideoIndexes.has(index) ? undefined : video.poster}
              aria-label={video.name}
              onLoadedData={() => markVideoReady(index)}
              ref={(el) => {
                if (el) {
                  videoRefs.current.set(index, el);
                } else {
                  videoRefs.current.delete(index);
                }
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(VideoSlider);
