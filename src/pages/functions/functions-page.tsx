import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { Retry } from "@/components/retry";
import {
  FunctionCard,
  FunctionCardBody,
  FunctionCardFooter,
  FunctionCardHeader,
  FunctionCompilationStatus,
  FunctionCompileOrExecuteButton,
  FunctionDescription,
  FunctionInputOutputTypes,
  FunctionLanguageIcon,
  FunctionName,
  FunctionOptions,
} from "@/features/function/components/function-card";
import { useFunctionPageQuery } from "@/features/function/function-hooks";
import type { FunctionFilter } from "@/features/function/function-types";
import { SORT_OPTIONS } from "@/features/function/function-types";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Col, Input, Pagination, Row, Select, Tooltip, Typography } from "antd";
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
  const { t } = useTranslation("function");
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract state from URL parameters
  const filter = useMemo<FunctionFilter>(() => {
    const keyword = searchParams.get("keyword") || undefined;
    const language = searchParams.get("language") || undefined;
    return { keyword, language };
  }, [searchParams]);

  const sort = searchParams.get("sort") || "createdAt,desc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("size") || "20", 10);

  const {
    data: functionsPage,
    isLoading,
    isFetching,
    isPending,
    error,
    refetch,
  } = useFunctionPageQuery(filter, {
    page: currentPage - 1,
    size: pageSize,
    sort: sort,
  });

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

  const handleSearch = (keyword: string) => {
    updateUrlParams({
      keyword: keyword || undefined,
      page: "1",
    });
  };

  const handleLanguageFilter = (language: string) => {
    updateUrlParams({
      language: language || undefined,
      page: "1",
    });
  };

  const handleSortChange = (newSort: string) => {
    updateUrlParams({
      sort: newSort,
      page: "1",
    });
  };

  const handlePageChange = (page: number, size?: number) => {
    const updates: Record<string, string | undefined> = {
      page: page.toString(),
    };

    if (size && size !== pageSize) {
      updates.size = size.toString();
    }

    updateUrlParams(updates);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  if (error) {
    return <Retry error={error} onRetry={refetch} />;
  }

  return (
    <div className={styles.functionsPageContainer}>
      {/* Header */}
      <div className={styles.functionsPageHeader}>
        <div className={styles.headerInfo}>
          <Title level={2}>{t("functions")}</Title>
          <p>{t("manage-and-deploy-your-serverless-functions")}</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate("/functions/new")}
        >
          {t("create-function")}
        </Button>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <Row gutter={16}>
          <Col span={1}>
            <Tooltip title={tCommon("reset-filters")}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetFilters}
                className={styles.filterSelect}
              />
            </Tooltip>
          </Col>
          <Col span={8}>
            <Search
              placeholder={t("search-functions-placeholder")}
              defaultValue={filter.keyword}
              onSearch={handleSearch}
              className={styles.filterSelect}
              allowClear
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder={t("filter-by-language-placeholder")}
              className={styles.filterSelect}
              value={filter.language}
              allowClear
              onChange={handleLanguageFilter}
            >
              <Option value="python">Python</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="java">Java</Option>
              <Option value="go">Go</Option>
            </Select>
          </Col>
          <Col span={5}>
            <Select
              placeholder={t("sort-by-placeholder")}
              className={styles.filterSelect}
              value={sort}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {tCommon(option.label)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={2}>
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
        </Row>
      </div>

      {/* Functions Grid */}
      {isLoading || isFetching || isPending ? (
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
                <FunctionCard functionDetail={functionDetail}>
                  <FunctionCardHeader>
                    <FunctionLanguageIcon />
                    <FunctionName />
                  </FunctionCardHeader>
                  <FunctionCardBody>
                    <FunctionDescription />
                    <FunctionInputOutputTypes />
                    <FunctionCompilationStatus />
                  </FunctionCardBody>
                  <FunctionCardFooter>
                    <FunctionCompileOrExecuteButton />
                    <FunctionOptions />
                  </FunctionCardFooter>
                </FunctionCard>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {functionsPage && functionsPage.total > 0 && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={currentPage}
                total={functionsPage.total}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} ${t("of").toLowerCase()} ${total} ${
                    total > 1
                      ? t("functions").toLowerCase()
                      : t("function").toLowerCase()
                  }`
                }
                pageSizeOptions={["10", "20", "50", "100"]}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
