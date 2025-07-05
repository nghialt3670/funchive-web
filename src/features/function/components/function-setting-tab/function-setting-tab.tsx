import { DeleteFilled } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Card, Col, Divider, Row, Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;

interface FunctionSettingTabProps {
  id?: string;
  functionDetail?: any;
  deleteMutation: any;
  onDelete: () => void;
}

export const FunctionSettingTab: React.FC<FunctionSettingTabProps> = ({
  id,
  functionDetail,
  deleteMutation,
  onDelete,
}) => {
  return (
    <Card
      className="tabCard"
      style={{ border: "none", boxShadow: "none", borderRadius: 0 }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Metadata Section */}
        {id && functionDetail?.createdAt && (
          <>
            <Box marginBottom="16px">
              <Title level={4}>Metadata</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Box padding="8px 0">
                    <Text type="secondary">Created:</Text>
                    <br />
                    <Text>
                      {new Date(functionDetail.createdAt).toLocaleString()}
                    </Text>
                    <br />
                    <Text type="secondary">by {functionDetail.createdBy}</Text>
                  </Box>
                </Col>
                <Col span={12}>
                  <Box padding="8px 0">
                    <Text type="secondary">Last Updated:</Text>
                    <br />
                    <Text>
                      {new Date(functionDetail.updatedAt).toLocaleString()}
                    </Text>
                    <br />
                    <Text type="secondary">by {functionDetail.updatedBy}</Text>
                  </Box>
                </Col>
              </Row>
            </Box>
            <Divider />
          </>
        )}

        {/* Danger Zone */}
        {id && (
          <Box marginTop="16px">
            <Title level={4} type="danger">
              Danger Zone
            </Title>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="16px"
              border="2px solid #ff4d4f"
              borderRadius="6px"
              bgcolor="#fff2f0"
            >
              <Box flex={1} marginRight="16px">
                <Text strong>Delete Function</Text>
                <br />
                <Text type="secondary">
                  Once you delete a function, there is no going back. Please be
                  certain.
                </Text>
              </Box>
              <Button
                danger
                icon={<DeleteFilled />}
                onClick={onDelete}
                loading={deleteMutation.isPending}
                style={{ flexShrink: 0 }}
              >
                Delete Function
              </Button>
            </Box>
          </Box>
        )}

        {!id && (
          <Box
            textAlign="center"
            padding="40px"
            color="var(--color-text-secondary)"
          >
            <Text type="secondary">
              Settings are only available in view mode.
            </Text>
          </Box>
        )}
      </Box>
    </Card>
  );
};
