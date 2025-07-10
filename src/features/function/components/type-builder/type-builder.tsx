import { PageModeCondition } from "@/components/ui/page-mode-condition/page-mode-condition";
import type {
  ArrayType,
  FileType,
  ObjectType,
  Type,
  TypeName,
  Value,
} from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { DeleteOutlined } from "@ant-design/icons";
import { RedAsterisk } from "@components/ui/red-asterisk";
import { Stack, useMediaQuery } from "@mui/material";
import { Button, Collapse, Input, Select, Tooltip, Typography } from "antd";
import React, {
  type ChangeEvent,
  type ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { TypeTag } from "../type-tag";
import { ValueBuilder } from "../value-builder";
import { ArrayElementTypeField } from "./array-type-fields";
import { FileExtensionField } from "./file-type-fields";
import { ObjectSchemaField } from "./object-type-fields";

const { TextArea } = Input;

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [type, setType] = useState<Type>(
    value || defaultValue || { name: "STRING" },
  );

  useEffect(() => {
    if (value) {
      setType(value);
    }
  }, [value]);

  const handleTypeNameChange = (typeName: TypeName) => {
    setType({ ...type, name: typeName } as Type);
    onChange?.({ ...type, name: typeName } as Type);
  };

  const handleTypeDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setType({ ...type, description: e.target.value } as Type);
    onChange?.({ ...type, description: e.target.value } as Type);
  };

  const handleArrayElementTypeChange = (elementType: Type) => {
    setType({ ...type, elementType } as Type);
    onChange?.({ ...type, elementType } as Type);
  };

  const handleFileExtensionChange = (extension: string) => {
    setType({ ...type, extension } as Type);
    onChange?.({ ...type, extension } as Type);
  };

  const handleObjectSchemaChange = (schema: Record<string, Type>) => {
    setType({ ...type, schema } as Type);
    onChange?.({ ...type, schema } as Type);
  };

  const handleDefaultValueChange = (defaultValue?: Value) => {
    setType({ ...type, defaultValue } as Type);
    onChange?.({ ...type, defaultValue } as Type);
  };

  const handleUseDefaultValueChange = (useDefaultValue: boolean) => {
    setType({ ...type, useDefaultValue } as Type);
    onChange?.({ ...type, useDefaultValue } as Type);
  };

  const renderTypeSpecificFields = () => {
    switch (type?.name as TypeName) {
      case "ARRAY":
        return (
          <ArrayElementTypeField
            value={(type as ArrayType)?.elementType}
            onChange={handleArrayElementTypeChange}
            disabled={disabled}
            depth={depth + 1}
            maxDepth={maxDepth}
            onDepthChange={onDepthChange}
            readOnly={readOnly}
          />
        );
      case "FILE":
        return (
          <FileExtensionField
            value={(type as FileType)?.extension}
            onChange={handleFileExtensionChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "OBJECT":
        return (
          <ObjectSchemaField
            value={(type as ObjectType)?.schema}
            onChange={handleObjectSchemaChange}
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

  const availableTypes =
    depth >= maxDepth
      ? Object.entries(TYPE_NAMES)
          .filter(([_, value]) => value !== "ARRAY" && value !== "OBJECT")
          .map(([key, value]) => ({
            label: key,
            value,
          }))
      : Object.entries(TYPE_NAMES).map(([key, value]) => ({
          label: key,
          value,
        }));

  const renderRemoveButton = () => {
    return readOnly || !removable ? null : (
      <Tooltip title={t("remove-field")}>
        <Button
          onClick={() => onRemove?.(label)}
          icon={<DeleteOutlined />}
          size="small"
        />
      </Tooltip>
    );
  };

  const renderCollapseLabel = () => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Stack direction="row" alignItems="center" gap={0.5} width="100%">
          <PageModeCondition modes={["create", "edit"]}>
            {required && <RedAsterisk />}
          </PageModeCondition>
          <PageModeCondition modes={["create"]}>
            {labelEditable ? (
              <Input
                value={label}
                onChange={onLabelChange}
                disabled={disabled}
                readOnly={readOnly}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontWeight: "600",
                  width: "100%",
                  marginLeft: -12,
                }}
              />
            ) : (
              <Text strong>{label}</Text>
            )}
          </PageModeCondition>
          <PageModeCondition modes={["view", "edit"]}>
            <Text strong>{label}</Text>
          </PageModeCondition>
        </Stack>
        <PageModeCondition modes={["view", "edit"]}>
          <TypeTag typeName={type?.name as TypeName} />
        </PageModeCondition>
        <PageModeCondition modes={["create"]}>
          <Select
            options={availableTypes}
            value={type?.name}
            onChange={handleTypeNameChange}
            disabled={disabled}
            style={{ width: "7rem" }}
            onClick={(e) => e.stopPropagation()}
            optionRender={(option) => (
              <TypeTag typeName={option.value as TypeName} />
            )}
            labelRender={(label) => (
              <TypeTag typeName={label.value as TypeName} />
            )}
          />
          {renderRemoveButton()}
        </PageModeCondition>
      </Stack>
    );
  };

  const renderCollapseChildren = () => {
    return (
      <Stack gap={2}>
        {readOnly ? (
          <Paragraph ellipsis={{ rows: 5, expandable: true }}>
            {type?.description || t("no-description")}
          </Paragraph>
        ) : (
          <TextArea
            placeholder={t("description-placeholder")}
            value={type?.description}
            onChange={handleTypeDescriptionChange}
            disabled={disabled}
            readOnly={readOnly}
            autoSize={{ minRows: 1, maxRows: 5 }}
          />
        )}
        {renderTypeSpecificFields()}
        <ValueBuilder
          type={type}
          label={t("default-value")}
          value={type?.defaultValue}
          onChange={handleDefaultValueChange}
          showEnabled={true}
          enabled={type?.useDefaultValue}
          onEnabledChange={handleUseDefaultValueChange}
          disabled={disabled}
          readOnly={readOnly}
        />
      </Stack>
    );
  };

  return (
    <Collapse
      size={isMobile ? "small" : "middle"}
      style={{ width: "100%", height: "fit-content" }}
      defaultActiveKey={["1"]}
      items={[
        {
          key: "1",
          label: renderCollapseLabel(),
          children: renderCollapseChildren(),
        },
      ]}
    />
  );
};
