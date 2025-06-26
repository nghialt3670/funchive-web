import { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Spin,
  Alert,
  Pagination,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useFunctionPageQuery } from '@/features/function/function-hooks';
import type { FunctionFilter } from '@/features/function/function-types';
import { SORT_OPTIONS } from '@/features/function/function-types';
import styles from './functions-page.module.css';
import { FunctionCard } from '@/features/function/components/function-card';
import {
  FunctionDescription,
  FunctionCardHeader,
  FunctionCardBody,
  FunctionCardFooter,
  FunctionName,
  FunctionLanguageIcon,
  FunctionInputOutputTypes,
  FunctionCompileOrExecuteButton,
  FunctionOptions,
} from '@/features/function/components/function-card/function-card';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export const FunctionsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FunctionFilter>({});
  const [sort, setSort] = useState<string>('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: functionsPage,
    isLoading,
    error,
    refetch,
  } = useFunctionPageQuery(filter, {
    page: currentPage - 1,
    size: pageSize,
    sort: sort,
  });

  const handleSearch = (keyword: string) => {
    setFilter((prev) => ({ ...prev, keyword }));
    setCurrentPage(1);
  };

  const handleLanguageFilter = (language: string) => {
    setFilter((prev) => ({ ...prev, language: language || undefined }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  if (error) {
    return (
      <div>
        <Alert
          message="Error loading functions"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <Title level={2}>Functions</Title>
            <p>Manage and deploy your serverless functions</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/functions/new')}
          >
            Create Function
          </Button>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <Row gutter={16}>
            <Col span={8}>
              <Search
                placeholder="Search functions..."
                onSearch={handleSearch}
                className={styles.filterSelect}
                allowClear
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="Filter by language"
                className={styles.filterSelect}
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
                placeholder="Sort by"
                className={styles.filterSelect}
                value={sort}
                onChange={handleSortChange}
              >
                {SORT_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <div className={styles.filterCount}>
                {functionsPage && (
                  <span>
                    {functionsPage.total} function
                    {functionsPage.total > 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* Functions Grid */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
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
                    `${range[0]}-${range[1]} of ${total} functions`
                  }
                  pageSizeOptions={['10', '20', '50', '100']}
                  onChange={handlePageChange}
                  size="default"
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && functionsPage?.items.length === 0 && (
          <div className={styles.emptyState}>
            <Title level={3}>No functions found</Title>
            <p>Get started by creating your first function</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/functions/new')}
            >
              Create Function
            </Button>
          </div>
        )}
      </div>
  );
};
