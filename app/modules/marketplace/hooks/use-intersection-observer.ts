import { type RefObject, useEffect, useRef } from "react";

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  callback: () => void,
  options: { enabled?: boolean; rootMargin?: string } = {},
) {
  const { enabled = true, rootMargin = "200px" } = options;

  // Always hold latest callback without making it a dep that re-creates the observer
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) callbackRef.current();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);
}
