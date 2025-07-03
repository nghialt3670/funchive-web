import type { FunctionFilter } from "@/features/function/types";
import type { PageRequest } from "@/types/api";

export const functionQueryKeys = {
  all: ["functions"] as const,
  lists: () => [...functionQueryKeys.all, "list"] as const,
  list: (filter: FunctionFilter, pageRequest: PageRequest) =>
    [...functionQueryKeys.lists(), filter, pageRequest] as const,
  details: () => [...functionQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...functionQueryKeys.details(), id] as const,
};
