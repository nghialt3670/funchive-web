import type { Sort } from "@/types/api";

export const API_BASE_URL = "http://localhost:8080/api/v1";

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_SORTS: Sort[] = [{ field: "createdAt", order: "desc" }];

// Responsive breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1280,
} as const;

// Media queries
export const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.MOBILE}px)`,
  TABLET: `(max-width: ${BREAKPOINTS.TABLET}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.TABLET + 1}px)`,
} as const;
