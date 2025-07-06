import { usePageMode } from "@/hooks/use-page-mode";
import { Form, type FormItemProps, Typography } from "antd";
import { type FC } from "react";

const { Text } = Typography;

export const FormItemWithPageMode: FC<FormItemProps> = ({
  label,
  children,
  ...props
}) => {
  const { pageMode } = usePageMode();

  return pageMode === "view" ? (
    <Form.Item noStyle {...props}>
      {children}
    </Form.Item>
  ) : (
    <Form.Item
      label={<Text strong>{label}</Text>}
      {...props}
    >
      {children}
    </Form.Item>
  );
};
