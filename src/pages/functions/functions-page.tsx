import { FunctionCard } from "@/features/function/components/function-card";
import { FunctionPopup } from "@/features/function/components/function-popup/function-popup";
import { useGetFunctionPageQuery } from "@/features/function/hooks";
import type { FunctionFilter } from "@/features/function/types";
import { SORT_OPTIONS } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { usePageSearchParams } from "@/hooks/use-page-search-params.ts";
import { searchParamToSort, sortToSearchParam } from "@/utils/api-utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Loading } from "@components/ui/loading";
import { ResourceEmpty } from "@components/ui/resource-empty";
import { ResourceFilters } from "@components/ui/resource-filters";
import { ResourcePagination } from "@components/ui/resource-pagination";
import { Retry } from "@components/ui/retry";
import { Col, Input, Row, Select, Typography } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./functions-page.module.css";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export const FunctionsPage = () => {
  const navigate = useNavigate();
  const { t: tCommon } = useTranslation();
  const { t } = useNamespacedTranslation();
  const [searchParams] = useSearchParams();

  const { sorts, setPage, setSorts } = usePageSearchParams();

  const filterConfigs = [{ key: "keyword" }, { key: "language" }];

  const filter = useMemo<FunctionFilter>(() => {
    const keyword = searchParams.get("keyword") || undefined;
    const language = searchParams.get("language") || undefined;
    return { keyword, language };
  }, [searchParams]);

  const isFiltering = !!filter.keyword || !!filter.language;

  const {
    data: functionsPage,
    isLoading,
    error,
    refetch,
  } = useGetFunctionPageQuery(filter);

  const handleSortChange = (newSort: string) => {
    setSorts([searchParamToSort(newSort)]);
    setPage(1);
  };

  if (error) {
    return <Retry error={error} onRetry={refetch} />;
  }

  return (
    <div className={styles.functionsPageContainer}>
      {/* Header */}
      <div className={styles.functionsPageHeader}>
        <div className={styles.headerInfo}>
          <Title className={styles.headerTitle} level={2}>
            {t("functions")}
          </Title>
          <p>{t("manage-and-deploy-your-serverless-functions")}</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/functions/new")}
        >
          {t("create-function")}
        </Button>
      </div>

      {/* Filters using the ResourceFilters component */}
      <ResourceFilters
        filters={filterConfigs}
        onPageReset={() => setPage(1)}
        resetButtonTooltip={tCommon("reset-filters")}
      >
        {(filterState, { updateFilter }) => (
          <>
            <Col xs={20} sm={21} md={10} lg={10} xl={9}>
              <Search
                placeholder={t("search-functions-placeholder")}
                defaultValue={filterState.keyword}
                onSearch={(value) => updateFilter("keyword", value)}
                className={styles.filterSelect}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={5} xl={5}>
              <Select
                placeholder={t("filter-by-language-placeholder")}
                className={styles.filterSelect}
                value={filterState.language}
                allowClear
                onChange={(value) => updateFilter("language", value)}
              >
                <Option value="python">Python</Option>
                <Option value="javascript">JavaScript</Option>
                <Option value="java">Java</Option>
                <Option value="go">Go</Option>
              </Select>
            </Col>
            <Col xs={12} sm={12} md={6} lg={5} xl={5}>
              <Select
                placeholder={t("sort-by-placeholder")}
                className={styles.filterSelect}
                value={sorts?.[0] ? sortToSearchParam(sorts[0]) : undefined}
                onChange={handleSortChange}
              >
                {SORT_OPTIONS.map((option) => (
                  <Option
                    key={sortToSearchParam(option.value)}
                    value={sortToSearchParam(option.value)}
                  >
                    {tCommon(option.label)}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={24} lg={3} xl={4}>
              <div className={styles.filterCount}>
                {functionsPage && (
                  <span>
                    {t("found") +
                      " " +
                      functionsPage.total +
                      " " +
                      (functionsPage.total > 1
                        ? t("functions").toLowerCase()
                        : t("function").toLowerCase())}
                  </span>
                )}
              </div>
            </Col>
          </>
        )}
      </ResourceFilters>

      {/* Functions Grid */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row gutter={[16, 16]} className={styles.functionsGrid}>
            {functionsPage?.items.map((functionDetail) => (
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={6}
                key={functionDetail.id}
              >
                {/* <FunctionPopup functionDetail={functionDetail}> */}
                <FunctionCard functionDetail={functionDetail} />
                {/* </FunctionPopup> */}
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {functionsPage && <ResourcePagination page={functionsPage} />}
        </>
      )}

      {/* Empty State */}
      {!isLoading && functionsPage?.items.length === 0 && (
        <ResourceEmpty
          title={t("function-empty-title")}
          redirectOptions={
            isFiltering
              ? undefined
              : {
                  path: "/functions/new",
                  description: t("function-empty-description"),
                  buttonLabel: t("create-function"),
                }
          }
        />
      )}
    </div>
  );
};
