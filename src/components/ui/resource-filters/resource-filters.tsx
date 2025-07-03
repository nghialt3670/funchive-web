import { ReloadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tooltip } from "antd";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import styles from "./resource-filters.module.css";

export interface FilterConfig {
  key: string;
  defaultValue?: string;
}

export interface FilterState {
  [key: string]: string | undefined;
}

export interface FilterHandlers {
  updateFilter: (key: string, value: string | undefined) => void;
  resetFilters: () => void;
  getFilterValue: (key: string) => string | undefined;
}

export interface ResourceFiltersProps {
  filters: FilterConfig[];
  onPageReset?: () => void;
  showResetButton?: boolean;
  resetButtonTooltip?: string;
  className?: string;
  children: (filterState: FilterState, handlers: FilterHandlers) => ReactNode;
}

export const ResourceFilters = ({
  filters,
  onPageReset,
  showResetButton = true,
  resetButtonTooltip,
  className,
  children,
}: ResourceFiltersProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterState = useMemo<FilterState>(() => {
    const state: FilterState = {};
    filters.forEach(({ key, defaultValue }) => {
      state[key] = searchParams.get(key) || defaultValue;
    });
    return state;
  }, [searchParams, filters]);

  const updateUrlParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const handlers: FilterHandlers = {
    updateFilter: (key: string, value: string | undefined) => {
      updateUrlParams({ [key]: value });
      onPageReset?.();
    },

    resetFilters: () => {
      const resetParams = new URLSearchParams();
      // Keep non-filter params if needed (like page, size, etc.)
      const preservedParams = ["page", "size"];
      preservedParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          resetParams.set(param, value);
        }
      });
      setSearchParams(resetParams);
      onPageReset?.();
    },

    getFilterValue: (key: string) => filterState[key],
  };

  return (
    <div className={`${styles.filtersSection} ${className || ""}`}>
      <Row gutter={[16, 16]}>
        {showResetButton && (
          <Col xs={4} sm={3} md={2} lg={1} xl={1}>
            <Tooltip title={resetButtonTooltip || t("reset-filters")}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handlers.resetFilters}
                className={styles.filterButton}
              />
            </Tooltip>
          </Col>
        )}
        {children(filterState, handlers)}
      </Row>
    </div>
  );
};
