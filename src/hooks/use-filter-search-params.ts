import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface FilterSearchParamsOptions<
  T extends Record<string, string | undefined>,
> {
  keys: (keyof T)[];
}

export interface FilterSearchParamsResult<
  T extends Record<string, string | undefined>,
> {
  filter: Partial<T>;
  updateFilter: (key: keyof T, value: string) => void;
  clearFilter: () => void;
}

export const useFilterSearchParams = <
  T extends Record<string, string | undefined>,
>(
  options: FilterSearchParamsOptions<T>,
): FilterSearchParamsResult<T> => {
  const { keys } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Partial<T>>({});

  useEffect(() => {
    const newFilter: Partial<T> = {};
    keys.forEach((key) => {
      const value = searchParams.get(key as string);
      if (value !== null) {
        newFilter[key as keyof T] = value as T[keyof T];
      }
    });
    setFilter(newFilter);
  }, [searchParams, keys]);

  const updateFilter = (key: keyof T, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(key as string, value);
    setSearchParams(newSearchParams);
  };

  const clearFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    keys.forEach((key) => newSearchParams.delete(key as string));
    setSearchParams(newSearchParams);
  };

  return { filter, updateFilter, clearFilter };
};
