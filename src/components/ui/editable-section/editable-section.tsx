import { usePageMode } from "@/hooks/use-page-mode";
import { CloseCircleFilled, EditFilled, SaveFilled } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Tooltip } from "antd";
import {
  type ReactElement,
  cloneElement,
  isValidElement,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

type ChildProps<T> = {
  value: T;
  onChange: (value: T) => void;
  readOnly?: boolean;
};

interface EditableSectionProps<T> {
  children: ReactElement<ChildProps<T>>;
  value?: T;
  onChange?: (value: T) => void;
  showEditButton?: boolean;
  onEdit?: () => void;
  onSave?: () => Promise<void> | void;
  onCancel?: () => void;
}

export const EditableSection = <T,>({
  children,
  value,
  onChange,
  showEditButton = false,
  onEdit,
  onSave,
  onCancel,
}: EditableSectionProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const { pageMode } = usePageMode();
  const { t } = useTranslation();
  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setIsEditing(false);
  };

  if (pageMode === "view") {
    return isValidElement(children)
      ? cloneElement(children, {
          value,
          onChange,
          readOnly: true,
        } as any)
      : children;
  }

  const clonedChildren = isValidElement(children)
    ? cloneElement(children, {
        value,
        onChange,
        readOnly: !isEditing && showEditButton,
      } as any)
    : children;

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" flexDirection="row" gap={1} marginLeft="auto">
        {showEditButton && (
          <>
            {isEditing ? (
              <>
                <Tooltip title={t("save")}>
                  <Button
                    icon={<SaveFilled />}
                    size="small"
                    onClick={handleSave}
                  />
                </Tooltip>
                <Tooltip title={t("cancel")}>
                  <Button
                    icon={<CloseCircleFilled />}
                    size="small"
                    onClick={handleCancel}
                  />
                </Tooltip>
              </>
            ) : (
              <Tooltip title={t("edit")}>
                <Button
                  icon={<EditFilled />}
                  size="small"
                  onClick={handleEditClick}
                />
              </Tooltip>
            )}
          </>
        )}
      </Box>
      {clonedChildren}
    </Box>
  );
};
