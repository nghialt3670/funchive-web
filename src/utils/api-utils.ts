import type { Sort } from "@/types/api";

export const sortToSearchParam = (sort: Sort): string => {
  return `${sort.field},${sort.order}`;
};

export const searchParamToSort = (param: string): Sort => {
  const [field, order] = param.split(",");
  return { field, order: order as "asc" | "desc" };
};
