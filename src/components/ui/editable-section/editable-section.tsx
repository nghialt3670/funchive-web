import { EditFilled, SaveFilled } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Space } from "antd";
import React, { useState } from "react";

interface EditableSectionProps {
  title: string;
  children: React.ReactNode;
  onSave?: () => Promise<void> | void;
  onCancel?: () => void;
  isEditing?: boolean;
  onEdit?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  children,
  onSave,
  onCancel,
  isEditing = false,
  onEdit,
  disabled = false,
  loading = false,
}) => {
  const [internalEditing, setInternalEditing] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const editing = isEditing ?? internalEditing;
  const isLoading = loading || internalLoading;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalEditing(true);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      setInternalLoading(true);
      try {
        await onSave();
        if (!onEdit) {
          setInternalEditing(false);
        }
      } catch (error) {
        // If save fails (e.g., validation error), don't close editing
        console.error("Save failed:", error);
      } finally {
        setInternalLoading(false);
      }
    } else {
      setInternalEditing(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalEditing(false);
    }
  };

  return (
    <Box
      border="1px solid #d9d9d9"
      borderRadius="6px"
      padding="16px"
      marginBottom="16px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="16px"
        paddingBottom="8px"
        borderBottom="1px solid #f0f0f0"
      >
        <Box
          component="h3"
          margin={0}
          fontSize="16px"
          fontWeight={600}
          color="#262626"
        >
          {title}
        </Box>
        <Space>
          {!editing && !disabled && (
            <Button
              type="text"
              icon={<EditFilled />}
              onClick={handleEdit}
              size="small"
            >
              Edit
            </Button>
          )}
          {editing && (
            <>
              <Button
                type="text"
                onClick={handleCancel}
                size="small"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<SaveFilled />}
                onClick={handleSave}
                loading={isLoading}
                size="small"
              >
                Save
              </Button>
            </>
          )}
        </Space>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};
