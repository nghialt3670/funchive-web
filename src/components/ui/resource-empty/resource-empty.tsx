import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./resource-empty.module.css";

export interface RedirectOptions {
  path: string;
  description: string;
  buttonLabel: string;
}

export interface ResourceEmptyProps {
  title: string;
  redirectOptions?: RedirectOptions;
}

export const ResourceEmpty: FC<ResourceEmptyProps> = ({
  title,
  redirectOptions,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.resourceEmpty}>
      <Title level={4}>{title}</Title>
      {redirectOptions && (
        <>
          <p>{redirectOptions.description}</p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(redirectOptions.path)}
          >
            {redirectOptions.buttonLabel}
          </Button>
        </>
      )}
    </div>
  );
};
