import { Modal } from "antd";
import { type FC, type PropsWithChildren, useState } from "react";
import { type ReactElement, cloneElement, isValidElement } from "react";
import { useTranslation } from "react-i18next";

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

  const clonedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<any>, {
        onClick: (e: any) => {
          e.stopPropagation(); // Prevent event bubbling
          // Call original onClick if it exists
          if ((children as ReactElement<any>).props.onClick) {
            (children as ReactElement<any>).props.onClick(e);
          }
          setOpen(true);
        },
      })
    : children;

  return (
    <>
      {clonedChildren}
      <Modal
        title={t("confirm")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleConfirm}
        okText={t("confirm")}
        cancelText={t("cancel")}
        zIndex={2000}
      >
        {message}
      </Modal>
    </>
  );
};
