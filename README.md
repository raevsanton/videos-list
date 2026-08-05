## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run dev server:
   ```bash
   bun run dev
   ```

## Implementation Description

Tech stack:

- Core: Preact or Next.js, TypeScript, Vite, Bun, Tailwind CSS, Biome.
- Storage: Zustand or Redux Toolkit.
- Video processing and transcoding: FFmpeg.
- Caching, security, and low latency: Cloudflare CDN.
- Player: HTML5 video + hls.js.

Schema: Video -> FFmpeg -> HLS segments + poster -> CDN -> API -> Frontend

Scroll:

- Three-slide window: previous, current, and next video.
- Snap: switch video after 15% of screen height or a fast swipe.
- Protection: animation lock prevents multiple transitions during a fast scroll.
- Playback: active video plays automatically, inactive videos are paused.

Preloading:

- Current video: `preload="auto"`.
- Previous video: `preload="metadata"`.
- Next video: `preload="auto"`.
- Production strategy: preload the next video and first segment of 1–2 videos ahead.
- Slow connection or Save-Data: keep only current and next video.
- Cancel obsolete requests after fast scrolling and limit simultaneous downloads.

State management:

- Store: video list, pagination cursor, loading/error states, current video ID, mute setting, viewing history.
- Component state: drag offset, animation state, timers, video element refs.
- Cleanup: unmount videos outside the active window to release memory and buffer.

Performance:

- Virtualization: render only active video and 1–2 neighbouring videos. Possible to use react-virtuoso or other virtualization libraries.
- Drag updates: CSS variable + `requestAnimationFrame`, without component rerender on every movement.
- Fast scrolling: animation lock and cancellation of irrelevant preload tasks.
- Background tab: pause all videos on `visibilitychange`; resume only active video.

Improvements over TikTok, Reels, Shorts:

- Improved performance in mobile browsers.
- Search by tags or keywords based on video metadata.
- Save the video viewing history so you can go back to videos you've watched before.
- Display the first frame of the video as a preview so that the first parts of the video are displayed correctly.
- Built-in parental control feature to restrict children's video viewing.
