import { PageModeCondition } from "@/components/ui/page-mode-condition/page-mode-condition";
import type {
  ArrayType,
  ObjectType,
  Type,
  TypeName,
  Value,
} from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { usePageMode } from "@/hooks/use-page-mode";
import { DeleteFilled } from "@ant-design/icons";
import { RedAsterisk } from "@components/ui/red-asterisk";
import { Stack, useMediaQuery } from "@mui/material";
import {
  Button,
  Collapse,
  Form,
  Input,
  type InputRef,
  Select,
  Tooltip,
  Typography,
} from "antd";
import React, {
  type ChangeEvent,
  type ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { TypeTag } from "../type-tag";
import { ValueBuilder } from "../value-builder";
import { ArrayElementTypeField } from "./array-element-type-field";
import { ObjectSchemaField } from "./object-schema-field";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const DEFAULT_TYPE: Type = { name: "STRING" };
const TYPE_OPTIONS = Object.entries(TYPE_NAMES).map(([key, value]) => ({
  label: key,
  value,
}));

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
  const { pageMode } = usePageMode();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const type = value || defaultValue || DEFAULT_TYPE;
  const labelRef = useRef<InputRef>(null);
  const [labelMessage, setLabelMessage] = useState<string>("");

  useEffect(() => {
    labelRef.current?.focus();
  }, []);

  const hasDefaultValue =
    type.name === "STRING" ||
    type.name === "NUMBER" ||
    type.name === "BOOLEAN" ||
    type.name === "FILE";

  const availableTypeOptions =
    depth >= maxDepth
      ? TYPE_OPTIONS.filter(
          ({ value }) =>
            value !== TYPE_NAMES.ARRAY && value !== TYPE_NAMES.OBJECT,
        )
      : TYPE_OPTIONS;

  const handleLabelBlur = () => {
    if (label === "") {
      setLabelMessage(t("label-required"));
      labelRef.current?.focus();
    }
  };

  const handleTypeNameChange = (typeName: TypeName) => {
    onChange?.({ ...type, name: typeName } as Type);
  };

  const handleTypeDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.({ ...type, description: e.target.value } as Type);
  };

  const handleArrayElementTypeChange = (elementType: Type) => {
    onChange?.({ ...type, elementType } as Type);
  };

  const handleObjectSchemaChange = (schema: Record<string, Type>) => {
    onChange?.({ ...type, schema } as Type);
  };

  const handleDefaultValueChange = (defaultValue?: Value) => {
    onChange?.({ ...type, defaultValue } as Type);
  };

  const handleUseDefaultValueChange = (useDefaultValue: boolean) => {
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

  const renderRemoveButton = () => {
    return readOnly || !removable ? null : (
      <Tooltip title={t("remove-field")}>
        <Button
          onClick={() => onRemove?.(label)}
          icon={<DeleteFilled />}
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
        alignItems="flex-start"
        gap={2}
      >
        <Stack direction="row" alignItems="center" gap={0.5} width="100%">
          <PageModeCondition modes={["create", "edit"]}>
            {required && <RedAsterisk />}
          </PageModeCondition>
          <PageModeCondition modes={["create"]}>
            {labelEditable ? (
              <Stack direction="column" gap={1}>
                <Form.Item
                  required
                  rules={[{ required: true, message: t("label-required") }]}
                >
                  <Input
                    value={label}
                    onChange={onLabelChange}
                    onBlur={handleLabelBlur}
                    disabled={disabled}
                    readOnly={readOnly}
                    onClick={(e) => e.stopPropagation()}
                    ref={labelRef}
                    style={{
                      fontWeight: "600",
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Stack>
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
            options={availableTypeOptions}
            value={type?.name}
            onChange={handleTypeNameChange}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "130px" }}
            optionRender={(option) => (
              <TypeTag typeName={option.label as TypeName} />
            )}
            labelRender={(label) => (
              <TypeTag typeName={label.label as TypeName} />
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
        {hasDefaultValue && (
          <ValueBuilder
            type={type}
            label={t("default-value")}
            value={type?.defaultValue}
            onChange={handleDefaultValueChange}
            showEnabled={pageMode === "create"}
            enabled={type?.useDefaultValue}
            onEnabledChange={handleUseDefaultValueChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
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
