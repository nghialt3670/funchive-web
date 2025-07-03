import { MEDIA_QUERIES } from "@/config/constants";
import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};

// Predefined responsive hooks
export const useIsMobile = () => useMediaQuery(MEDIA_QUERIES.MOBILE);
export const useIsTablet = () => useMediaQuery(MEDIA_QUERIES.TABLET);
export const useIsDesktop = () => useMediaQuery(MEDIA_QUERIES.DESKTOP);

// Sidebar-specific responsive behavior
export const useSidebarMode = () => {
  const isTablet = useIsTablet();

  return {
    isOverlayMode: isTablet, // Below tablet breakpoint = overlay mode
    isCollapsibleMode: !isTablet, // Above tablet breakpoint = collapsible mode
  };
};
