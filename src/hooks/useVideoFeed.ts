import { useEffect, useRef } from "preact/hooks";

export const SNAP_MS = 380;
export const COMMIT_THRESHOLD = 0.15;
export const VELOCITY_THRESHOLD = 0.3;

export type SwipeDirection = "up" | "down";

interface UseVideoFeedOptions {
  containerRef: { current: HTMLDivElement | null };
  onCommit: (dir: SwipeDirection) => void;
  onDragUpdate: (offset: number) => void;
  onSnapBack: () => void;
}

export function useVideoFeed({
  containerRef,
  onCommit,
  onDragUpdate,
  onSnapBack,
}: UseVideoFeedOptions) {
  const dragging = useRef(false);
  const startY = useRef(0);
  const startTime = useRef(0);
  const animLock = useRef(false);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const pendingOffset = useRef(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateDrag = (offset: number) => {
      pendingOffset.current = offset;

      if (frame.current !== null) return;

      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        onDragUpdate(pendingOffset.current);
      });
    };

    const lockAnimation = () => {
      animLock.current = true;

      if (animationTimer.current) clearTimeout(animationTimer.current);

      animationTimer.current = setTimeout(() => {
        animLock.current = false;
        animationTimer.current = null;
      }, SNAP_MS);
    };

    const start = (y: number) => {
      if (animLock.current) return;

      dragging.current = true;
      startY.current = y;
      startTime.current = performance.now();
    };

    const move = (y: number) => {
      if (!dragging.current) return;
      updateDrag(y - startY.current);
    };

    const cancelPendingDragUpdate = () => {
      if (frame.current === null) return;

      cancelAnimationFrame(frame.current);
      frame.current = null;
    };

    const end = (y: number) => {
      if (!dragging.current) return;

      dragging.current = false;
      cancelPendingDragUpdate();

      const delta = y - startY.current;
      const velocity = Math.abs(delta) / (performance.now() - startTime.current || 1);

      const shouldCommit =
        Math.abs(delta) / window.innerHeight > COMMIT_THRESHOLD || velocity > VELOCITY_THRESHOLD;

      if (!shouldCommit) {
        lockAnimation();
        updateDrag(0);
        onSnapBack();
        return;
      }

      lockAnimation();
      onCommit(delta < 0 ? "up" : "down");
    };

    const pointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType !== "touch") return;

      start(e.clientY);
      if (dragging.current) container.setPointerCapture(e.pointerId);
    };

    const pointerMove = (e: PointerEvent) => move(e.clientY);

    const pointerUp = (e: PointerEvent) => {
      end(e.clientY);
      if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
    };

    const pointerCancel = (e: PointerEvent) => {
      if (!dragging.current) return;

      dragging.current = false;
      cancelPendingDragUpdate();
      lockAnimation();
      updateDrag(0);
      onSnapBack();

      if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
    };

    const wheel = (e: WheelEvent) => {
      if (animLock.current) return;

      if (Math.abs(e.deltaY) < 50) return;

      lockAnimation();
      onCommit(e.deltaY > 0 ? "up" : "down");
    };

    container.addEventListener("pointerdown", pointerDown);
    container.addEventListener("pointermove", pointerMove);
    container.addEventListener("pointerup", pointerUp);
    container.addEventListener("pointercancel", pointerCancel);
    container.addEventListener("wheel", wheel, { passive: true });

    return () => {
      if (animationTimer.current) clearTimeout(animationTimer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);

      container.removeEventListener("pointerdown", pointerDown);
      container.removeEventListener("pointermove", pointerMove);
      container.removeEventListener("pointerup", pointerUp);
      container.removeEventListener("pointercancel", pointerCancel);
      container.removeEventListener("wheel", wheel);
    };
  }, [containerRef, onCommit, onDragUpdate, onSnapBack]);
}
