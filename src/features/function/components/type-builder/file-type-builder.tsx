import React from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FileType } from '@/features/function/function-types';
import styles from './file-type-builder.module.css';

interface FileTypeBuilderProps {
  value?: FileType;
  onChange?: (type: FileType) => void;
  disabled?: boolean;
}

export const FileTypeBuilder: React.FC<FileTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const description = value?.description || '';
  const extension = value?.extension || '';
  const defaultValue = value?.defaultValue;

  const handleDescriptionChange = (newDescription: string) => {
    onChange?.({
      name: 'FILE',
      description: newDescription || undefined,
      extension: value?.extension,
      defaultValue: value?.defaultValue,
    });
  };

  const handleExtensionChange = (newExtension: string) => {
    onChange?.({
      name: 'FILE',
      description: value?.description,
      extension: newExtension || undefined,
      defaultValue: value?.defaultValue,
    });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        onChange?.({
          name: 'FILE',
          description: value?.description,
          extension: value?.extension,
          defaultValue: content,
        });
        message.success('File uploaded successfully');
      } catch (error) {
        message.error('Failed to read file');
      }
    };
    reader.readAsText(file);
    return false; // Prevent default upload behavior
  };

  return (
    <div className={styles.fileTypeBuilder}>
      <Form.Item label="Description" className={styles.formItem}>
        <Input
          placeholder="Type description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item label="File Extension" className={styles.formItem}>
        <Input
          placeholder="e.g., .pdf, .jpg, .txt"
          value={extension}
          onChange={(e) => handleExtensionChange(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item label="Default Value" className={styles.formItem}>
        <div className={styles.defaultValueContainer}>
          <Upload
            beforeUpload={handleFileUpload}
            disabled={disabled}
            showUploadList={false}
            accept="*"
          >
            <Button icon={<UploadOutlined />} disabled={disabled}>
              Upload Default File
            </Button>
          </Upload>
          {defaultValue && (
            <div className={styles.filePreview}>
              <span>File content uploaded</span>
            </div>
          )}
        </div>
      </Form.Item>
    </div>
  );
};
