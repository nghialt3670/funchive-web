import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTS,
} from "@/config/constants";
import type { Sort } from "@/types/api";
import { searchParamToSort, sortToSearchParam } from "@/utils/api-utils";
import { useSearchParams } from "react-router-dom";

export interface PageSearchParamsOptions {
  defaultPage?: number;
  defaultSize?: number;
  defaultSorts?: Sort[];
}

export type PageSearchParams = {
  page: number;
  size: number;
  sorts: Sort[];
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSorts: (sorts: Sort[]) => void;
};

export const usePageSearchParams = (
  options: PageSearchParamsOptions = {},
): PageSearchParams => {
  const {
    defaultPage = DEFAULT_PAGE_NUMBER,
    defaultSize = DEFAULT_PAGE_SIZE,
    defaultSorts = DEFAULT_SORTS,
  } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || defaultPage.toString(), 10);
  const size = parseInt(searchParams.get("size") || defaultSize.toString(), 10);

  const sortSearchParams = searchParams.getAll("sort");
  const sorts =
    sortSearchParams.length > 0
      ? sortSearchParams.map(searchParamToSort)
      : defaultSorts;

  const setPage = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  const setSize = (size: number) => {
    searchParams.set("size", size.toString());
    setSearchParams(searchParams);
  };

  const setSorts = (sorts: Sort[]) => {
    searchParams.delete("sort");
    sorts.forEach((sort) => {
      searchParams.append("sort", sortToSearchParam(sort));
    });
    setSearchParams(searchParams);
  };

  return { page, size, sorts, setPage, setSize, setSorts };
};
