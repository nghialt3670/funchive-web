import type { Sort } from "@/types/api";

export interface SortOption {
  value: Sort;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: { field: "createdAt", order: "desc" }, label: "newest-first" },
  { value: { field: "createdAt", order: "asc" }, label: "oldest-first" },
  { value: { field: "updatedAt", order: "desc" }, label: "recently-updated" },
  {
    value: { field: "updatedAt", order: "asc" },
    label: "least-recently-updated",
  },
  { value: { field: "name", order: "asc" }, label: "name-a-z" },
  { value: { field: "name", order: "desc" }, label: "name-z-a" },
];
