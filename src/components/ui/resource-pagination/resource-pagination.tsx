import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { usePageSearchParams } from "@/hooks/use-page-search-params";
import { type ResponsePage } from "@/types/api";
import { Pagination } from "antd";
import { type FC } from "react";

import styles from "./resource-pagination.module.css";

export interface ResourcePaginationProps {
  page: ResponsePage<any>;
}

export const ResourcePagination: FC<ResourcePaginationProps> = ({ page }) => {
  const { t } = useNamespacedTranslation();
  const { setPage, setSize } = usePageSearchParams();

  const handlePageChange = (page: number, size: number) => {
    setPage(page);
    setSize(size);
  };

  const showTotal = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} ${t("of").toLowerCase()} ${total} ${
      total > 1 ? t("functions").toLowerCase() : t("function").toLowerCase()
    }`;
  };

  if (page.total === 0) {
    return null;
  }

  return (
    <div className={styles.resourcePagination}>
      <Pagination
        current={page.page}
        total={page.total}
        pageSize={page.size}
        showSizeChanger
        showQuickJumper
        showTotal={showTotal}
        pageSizeOptions={["10", "20", "50", "100"]}
        onChange={handlePageChange}
      />
    </div>
  );
};
