import { EditFilled, SaveFilled } from "@ant-design/icons";
import { Button, Form, Space } from "antd";
import React, { useState } from "react";

import styles from "./editable-section.module.css";

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
    <div className={styles.editableSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
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
      </div>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};
