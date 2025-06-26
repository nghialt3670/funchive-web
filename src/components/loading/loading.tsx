import { Spin } from "antd";
import type { FC } from "react";

import styles from "./loading.module.css";

export const Loading: FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <Spin size="large" />
    </div>
  );
};
