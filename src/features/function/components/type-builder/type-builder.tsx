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
import { RedAsterisk } from "@components/ui/red-asterisk";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Collapse, Input, Select, Tooltip, Typography } from "antd";
import React, { type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";

import { TypeTag } from "../type-tag";
import { ArrayTypeBuilder } from "./array-type-builder";
import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import { NumberTypeBuilder } from "./number-type-builder";
import { ObjectTypeBuilder } from "./object-type-builder";
import { StringTypeBuilder } from "./string-type-builder";
import { usePageMode } from "@/hooks/use-page-mode";

const { TextArea } = Input;

const { Option } = Select;
const { Paragraph, Text } = Typography;
interface TypeBuilderProps {
  value?: Type;
  defaultValue?: Type;
  onChange?: (type: Type) => void;
  removable?: boolean;
  onRemove?: (key: string) => void;
  label: string;
  labelEditable?: boolean;
  onLabelChange?: ChangeEventHandler<HTMLInputElement>;
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
  labelEditable,
  onLabelChange,
  required,
  disabled,
  readOnly,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
}) => {
  const { t } = useTranslation();
  const { pageMode } = usePageMode();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!value && defaultValue) {
    onChange?.(defaultValue);
  }

  const renderTypeSpecificBuilder = () => {
    switch (value?.name as TypeName) {
      case "STRING":
        return (
          <StringTypeBuilder
            value={value as StringType}
            defaultValue={defaultValue as StringType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "NUMBER":
        return (
          <NumberTypeBuilder
            value={value as NumberType}
            defaultValue={defaultValue as NumberType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "BOOLEAN":
        return (
          <BooleanTypeBuilder
            value={value as BooleanType}
            defaultValue={defaultValue as BooleanType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "FILE":
        return (
          <FileTypeBuilder
            value={value as FileType}
            defaultValue={defaultValue as FileType}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "ARRAY":
        return (
          <ArrayTypeBuilder
            value={value as ArrayType}
            defaultValue={defaultValue as ArrayType}
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
            defaultValue={defaultValue as ObjectType}
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

  // Helper function to create a Type object for rendering
  const createTypeForRendering = (typeName: string): Type => {
    switch (typeName) {
      case "STRING":
        return { name: "STRING" };
      case "NUMBER":
        return { name: "NUMBER" };
      case "BOOLEAN":
        return { name: "BOOLEAN" };
      case "FILE":
        return { name: "FILE", extension: "*" };
      case "ARRAY":
        return { name: "ARRAY", elementType: { name: "STRING" } };
      case "OBJECT":
        return { name: "OBJECT", schema: {} };
      default:
        return { name: "STRING" };
    }
  };

  // Render option as TypeTag
  const renderOption = (option: any) => {
    const typeName = option.value;
    return <TypeTag type={createTypeForRendering(typeName)} />;
  };

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
        size={isMobile ? "small" : "middle"}
        style={{ width: "100%", height: "fit-content" }}
        defaultActiveKey={["1"]}
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
                {readOnly || pageMode !== "create" ? (
                  <>
                    <Text strong>{label}</Text>
                    <TypeTag type={value as Type} />
                  </>
                ) : (
                  <>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                      gap={0.5}
                      width="100%"
                    >
                      {required && <RedAsterisk />}
                      <Input
                        value={label}
                        onChange={onLabelChange}
                        disabled={disabled}
                        readOnly={readOnly || !labelEditable}
                        onFocus={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        styles={{
                          input: {
                            fontWeight: "600",
                            width: "100%",
                          },
                        }}
                      />
                    </Box>
                    <div style={{ position: "relative" }}>
                      <Select
                        value={value?.name}
                        onChange={handleTypeNameChange}
                        disabled={disabled}
                        style={{ width: "7rem" }}
                        styles={{ popup: { root: { textAlign: "center" } } }}
                        onClick={(e) => e.stopPropagation()}
                        optionRender={renderOption}
                      >
                        {availableTypes.map(([key, value]) => (
                          <Option key={key} value={value}>
                            {key}
                          </Option>
                        ))}
                      </Select>
                      {value?.name && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "8px",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            zIndex: 1,
                          }}
                        >
                          <TypeTag type={value as Type} />
                        </div>
                      )}
                    </div>
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
                <Box display="flex" flexDirection="column" width="100%" gap={2}>
                  {readOnly ? (
                    hasDescription && (
                      <Paragraph>{value?.description}</Paragraph>
                    )
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="100%"
                      gap={1}
                    >
                      <Text>{t("description")}</Text>
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
                    </Box>
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
