import { ReloadOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Col, Row, Tooltip } from "antd";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import styles from "./resource-filters.module.css";

export interface ResourceFiltersProps extends PropsWithChildren {
  onReset: () => void;
}

export const ResourceFilters = ({
  onReset,
  children,
}: ResourceFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Box className={styles.filtersSection}>
      <Row gutter={[16, 16]}>
        <Col xs={4} sm={3} md={2} lg={1} xl={1}>
          <Tooltip title={t("reset-filters")}>
            <Button icon={<ReloadOutlined />} onClick={onReset} />
          </Tooltip>
        </Col>
        {children}
      </Row>
    </Box>
  );
};
