import {
  useCreatePipeline,
  usePipelinePage,
} from "@/features/pipeline/pipeline-hooks";
import type { PipelineFilter } from "@/features/pipeline/pipeline-types";
import { usePageSearchParams } from "@/hooks/use-page-search-params.ts";
import { PlusOutlined } from "@ant-design/icons";
import { NamespaceProvider } from "@components/providers/namespace-provider.tsx";
import { ResourceEmpty } from "@components/ui/resource-empty";
import {
  Alert,
  Button,
  Col,
  Input,
  Pagination,
  Row,
  Spin,
  Typography,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { PipelineCard } from "../../features/pipeline/components/pipeline-card";
import styles from "./pipelines-page.module.css";

const { Title } = Typography;
const { Search } = Input;

export const PipelinesPage = () => {
  const { t } = useTranslation("pipeline");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filter, setFilter] = useState<PipelineFilter>({});

  const createPipeline = useCreatePipeline();

  const pageRequest = usePageSearchParams();

  // Fetch pipelines using the new API
  const {
    data: pipelinePage,
    isLoading,
    error,
  } = usePipelinePage(filter, pageRequest);

  const handleSearch = (keyword: string) => {
    setFilter({ ...filter, keyword });
    setCurrentPage(1);
  };

  const handleCreatedByFilter = (createdBy: string) => {
    setFilter({ ...filter, createdBy: createdBy || undefined });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleCreatePipeline = async () => {
    try {
      const newPipeline = await createPipeline.mutateAsync({
        name: "New Pipeline",
        description: "A new pipeline workflow",
        nodes: [],
        connections: [],
      });

      // Navigate to the new pipeline editor
      navigate(`/pipelines/${newPipeline.id}/edit`);
    } catch (error) {
      console.error("Failed to create pipeline:", error);
    }
  };

  const pipelines = pipelinePage?.items || [];
  const total = pipelinePage?.total || 0;
  const isFiltering = !!filter.keyword || !!filter.createdBy;

  if (error) {
    return (
      <Alert
        message="Error loading pipelines"
        description="Unable to load pipelines. Please try again later."
        type="error"
        showIcon
      />
    );
  }

  return (
    <NamespaceProvider namespace="pipeline">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <Title level={2}>Pipelines</Title>
            <p>Create and manage visual function pipelines</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={createPipeline.isPending}
            onClick={handleCreatePipeline}
          >
            Create Pipeline
          </Button>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <Row gutter={16}>
            <Col span={8}>
              <Search
                placeholder="Search pipelines..."
                onSearch={handleSearch}
                className={styles.filterSelect}
                allowClear
              />
            </Col>
            <Col span={5}>
              <Input
                placeholder="Filter by creator..."
                className={styles.filterSelect}
                allowClear
                onChange={(e) => handleCreatedByFilter(e.target.value)}
              />
            </Col>
            <Col span={11}>
              <div className={styles.filterCount}>
                <span>
                  {total} pipeline{total !== 1 ? "s" : ""} found
                </span>
              </div>
            </Col>
          </Row>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        )}

        {/* Pipelines Grid */}
        {!isLoading && (
          <Row gutter={[16, 16]} className={styles.pipelinesGrid}>
            {pipelines.map((pipeline) => (
              <Col xs={24} sm={24} md={12} lg={8} xl={6} key={pipeline.id}>
                <PipelineCard pipeline={pipeline} />
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        {!isLoading && total > pageSize && (
          <div className={styles.paginationContainer}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              // showSizeChanger
              // showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} pipelines`
              }
              pageSizeOptions={["10", "20", "50", "100"]}
              onChange={handlePageChange}
              size="default"
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && pipelines.length === 0 && (
          <ResourceEmpty
            title={t("pipeline-empty-title")}
            redirectOptions={
              isFiltering
                ? undefined
                : {
                    path: "/pipelines/create",
                    description: t("pipeline-empty-description"),
                    buttonLabel: t("create-new-pipeline"),
                  }
            }
          />
        )}
      </div>
    </NamespaceProvider>
  );
};
