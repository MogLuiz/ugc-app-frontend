import { useEffect, useState } from "react";

/** Alinhado ao `lg:hidden` / `lg:block` da agenda (1024px). */
const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

export function useCalendarLayoutIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

export const CALENDAR_VISIBLE_DAYS_MOBILE = 15;
export const CALENDAR_VISIBLE_DAYS_DESKTOP = 7;
