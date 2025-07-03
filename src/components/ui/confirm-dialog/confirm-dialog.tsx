import { tryCloneNodeWithOnClick } from "@/utils/element-utils";
import { Modal } from "antd";
import { type FC, type PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./confirm-dialog.module.css";

export interface ConfirmDialogProps extends PropsWithChildren {
  message: string;
  onConfirm: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const clonedChildren = tryCloneNodeWithOnClick(children, (e) => {
    e.stopPropagation();
    setOpen(true);
  });

  return (
    <div className={styles.confirmDialogContainer}>
      {clonedChildren}
      <Modal
        title={t("confirm")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleConfirm}
        okText={t("confirm")}
        cancelText={t("cancel")}
        zIndex={2000}
        centered
      >
        {message}
      </Modal>
    </div>
  );
};
