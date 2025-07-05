import type {
  ArrayType,
  BooleanType,
  FileType,
  NumberType,
  ObjectType,
  StringType,
  Type,
  TypeName,
} from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import {
  Button,
  Collapse,
  Form,
  Input,
  Select,
  Tooltip,
  Typography,
} from "antd";
import React, { type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";

import { TypeTag } from "../type-tag";
import { ArrayTypeBuilder } from "./array-type-builder";
import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import { NumberTypeBuilder } from "./number-type-builder";
import { ObjectTypeBuilder } from "./object-type-builder";
import { StringTypeBuilder } from "./string-type-builder";

const { TextArea } = Input;

const { Option } = Select;
const { Paragraph } = Typography;
interface TypeBuilderProps {
  value?: Type;
  defaultValue?: Type;
  onChange?: (type: Type) => void;
  removable?: boolean;
  onRemove?: (key: string) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
}

export const TypeBuilder: React.FC<TypeBuilderProps> = ({
  value,
  defaultValue,
  onChange,
  removable,
  onRemove,
  label,
  disabled,
  readOnly,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
}) => {
  const { t } = useTranslation();

  if (!value && defaultValue) {
    onChange?.(defaultValue);
  }

  const renderTypeSpecificBuilder = () => {
    switch (value?.name as TypeName) {
      case "STRING":
        return (
          <StringTypeBuilder
            value={value as StringType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "NUMBER":
        return (
          <NumberTypeBuilder
            value={value as NumberType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "BOOLEAN":
        return (
          <BooleanTypeBuilder
            value={value as BooleanType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "FILE":
        return (
          <FileTypeBuilder
            value={value as FileType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "ARRAY":
        return (
          <ArrayTypeBuilder
            value={value as ArrayType}
            onChange={onChange}
            disabled={disabled}
            depth={depth + 1}
            maxDepth={maxDepth}
            onDepthChange={onDepthChange}
            readOnly={readOnly}
          />
        );
      case "OBJECT":
        return (
          <ObjectTypeBuilder
            value={value as ObjectType}
            onChange={onChange}
            disabled={disabled}
            depth={depth + 1}
            maxDepth={maxDepth}
            onDepthChange={onDepthChange}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  const handleTypeNameChange = (newTypeName: TypeName) => {
    onChange?.({ ...value, name: newTypeName } as Type);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    onChange?.({ ...value, description: e.target.value } as Type);
  };

  const handleRemoveClick = () => {
    onRemove?.(label);
  };

  // Filter out ARRAY and OBJECT types if at max depth
  const availableTypes =
    depth >= maxDepth
      ? Object.entries(TYPE_NAMES).filter(
          ([_, value]) => value !== "ARRAY" && value !== "OBJECT",
        )
      : Object.entries(TYPE_NAMES);

  const hasDescription = value?.description && value?.description.trim() !== "";

  return (
    <>
      {removable && !readOnly && (
        <Tooltip title={t("remove-field")}>
          <Button
            onClick={handleRemoveClick}
            icon={<DeleteOutlined />}
            size="small"
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </Tooltip>
      )}
      <Collapse
        style={{ width: "100%", height: "fit-content" }}
        items={[
          {
            key: "1",
            label: (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
              >
                {readOnly ? (
                  <>
                    <Paragraph style={{ margin: 0 }}>{label}</Paragraph>
                    <TypeTag type={value as Type} />
                  </>
                ) : (
                  <>
                    <Select
                      value={value?.name}
                      onChange={handleTypeNameChange}
                      disabled={disabled}
                      style={{ width: "100px" }}
                    >
                      {availableTypes.map(([key, value]) => (
                        <Option key={key} value={value}>
                          {value}
                        </Option>
                      ))}
                    </Select>
                    <Paragraph>{label}</Paragraph>
                  </>
                )}
              </Box>
            ),
            children: (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-start"
                width="100%"
                gap={2}
              >
                <Box display="flex" flexDirection="column" width="100%">
                  {readOnly ? (
                    hasDescription && (
                      <Paragraph>{value?.description}</Paragraph>
                    )
                  ) : (
                    <Form.Item
                      label={t("description")}
                      style={{
                        width: "100%",
                        marginBottom: "1rem",
                      }}
                    >
                      <TextArea
                        placeholder={
                          readOnly ? undefined : t("description-placeholder")
                        }
                        value={value?.description}
                        onChange={handleDescriptionChange}
                        disabled={disabled}
                        readOnly={readOnly}
                        autoSize={{ minRows: 1, maxRows: 5 }}
                        className={disabled ? "disabled-input-placeholder" : ""}
                      />
                    </Form.Item>
                  )}
                  {renderTypeSpecificBuilder()}
                </Box>
              </Box>
            ),
          },
        ]}
      />
    </>
  );
};
