import { Alert, Button } from "antd";
import type { FC } from "react";

import styles from "./retry.module.css";

export type RetryProps = {
  error: Error;
  onRetry: () => void;
};

export const Retry: FC<RetryProps> = ({ error, onRetry }) => {
  return (
    <div className={styles.retryContainer}>
      <Alert
        message="Error loading functions"
        description={error.message}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      />
    </div>
  );
};
