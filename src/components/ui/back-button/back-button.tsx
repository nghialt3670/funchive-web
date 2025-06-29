import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, type ButtonProps } from "antd";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";

export const BackButton: FC<ButtonProps> = ({ ...props }) => {
  const navigate = useNavigate();

  return (
    <Button
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
      {...props}
    />
  );
};
