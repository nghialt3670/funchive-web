import { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Button,
  Input,
  Spin,
  Alert,
  Pagination,
  Card,
} from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  usePipelinePage,
  useCreatePipeline,
} from '@/features/pipeline/pipeline-hooks';
import type { PipelineFilter } from '@/features/pipeline/pipeline-types';
import styles from './pipelines-page.module.css';

const { Title } = Typography;
const { Search } = Input;

export const PipelinesPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filter, setFilter] = useState<PipelineFilter>({});

  const createPipeline = useCreatePipeline();

  // Fetch pipelines using the new API
  const {
    data: pipelinePage,
    isLoading,
    error,
  } = usePipelinePage(filter, {
    page: currentPage - 1, // Convert to 0-based index
    size: pageSize,
    sort: 'createdAt,desc',
  });

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
        name: 'New Pipeline',
        description: 'A new pipeline workflow',
        nodes: [],
        connections: [],
      });

      // Navigate to the new pipeline editor
      navigate(`/pipelines/${newPipeline.id}/edit`);
    } catch (error) {
      console.error('Failed to create pipeline:', error);
    }
  };

  const pipelines = pipelinePage?.items || [];
  const total = pipelinePage?.total || 0;

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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <Title level={2}>Pipelines</Title>
          <p>Create and manage visual function pipelines</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
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
                {total} pipeline{total !== 1 ? 's' : ''} found
              </span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {/* Pipelines Grid */}
      {!isLoading && (
        <Row gutter={[16, 16]} className={styles.pipelinesGrid}>
          {pipelines.map((pipeline) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={6} key={pipeline.id}>
              <Card
                className={styles.pipelineCard}
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => navigate(`/pipelines/${pipeline.id}/edit`)}
                  />,
                  <PlayCircleOutlined
                    key="run"
                    onClick={() => navigate(`/pipelines/${pipeline.id}/run`)}
                  />,
                ]}
              >
                <Card.Meta
                  title={
                    <div
                      className={styles.cardTitle}
                      onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                    >
                      {pipeline.name}
                    </div>
                  }
                  description={pipeline.description}
                />
                <div className={styles.cardMeta}>
                  <div className={styles.nodeCount}>
                    {pipeline.nodes?.length || 0} nodes
                  </div>
                  <div className={styles.connectionCount}>
                    {pipeline.connections?.length || 0} connections
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span>
                    Updated {new Date(pipeline.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
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
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} pipelines`
            }
            pageSizeOptions={['10', '20', '50', '100']}
            onChange={handlePageChange}
            size="default"
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pipelines.length === 0 && (
        <div className={styles.emptyState}>
          <Title level={3}>No pipelines found</Title>
          <p>Get started by creating your first pipeline</p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={createPipeline.isPending}
            onClick={handleCreatePipeline}
          >
            Create Pipeline
          </Button>
        </div>
      )}
    </div>
  );
};
