import { Button as AntdButton, type ButtonProps } from "antd";
import type { FC } from "react";

import styles from "./button.module.css";

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <AntdButton
      className={styles.button}
      style={{
        transition: "all 0.5s ease",
      }}
      {...props}
    >
      {children}
    </AntdButton>
  );
};
