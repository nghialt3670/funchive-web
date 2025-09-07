import { EditableSection } from "@/components/ui/editable-section/editable-section";
import { FormItemWithPageMode } from "@/components/ui/form-item-with-page-mode";
import { TypeBuilder } from "@/features/function/components/type-builder";
import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { usePageMode } from "@/hooks/use-page-mode";
import { Box, useMediaQuery } from "@mui/material";
import { Form, Input } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { useFormInstance } = Form;

const DEFAULT_TYPE: Type = {
  name: "STRING" as const,
  description: "",
  defaultValue: undefined,
};

export const FunctionDefinitionTab = () => {
  const { t } = useTranslation();
  const { t: nt } = useNamespacedTranslation();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { pageMode } = usePageMode();
  const form = useFormInstance();

  useEffect(() => {
    form.setFieldsValue({
      inputType: DEFAULT_TYPE,
      outputType: DEFAULT_TYPE,
    });
  }, []);

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormItemWithPageMode
          name="description"
          label={t("description")}
          rules={[
            { required: true, message: nt("function-description-is-required") },
          ]}
        >
          <EditableSection>
            <TextArea
              autoSize={{ minRows: pageMode === "view" ? 1 : 3, maxRows: 10 }}
              placeholder={t("enter-description-placeholder")}
            />
          </EditableSection>
        </FormItemWithPageMode>
        <Box display="flex" flexDirection={isTablet ? "column" : "row"} gap={2}>
          <FormItemWithPageMode
            name="inputType"
            style={{ width: "100%", margin: 0 }}
          >
            <EditableSection>
              <TypeBuilder label={nt("input-type")} required />
            </EditableSection>
          </FormItemWithPageMode>
          <FormItemWithPageMode
            name="outputType"
            style={{ width: "100%", margin: 0 }}
          >
            <EditableSection>
              <TypeBuilder label={nt("output-type")} required />
            </EditableSection>
          </FormItemWithPageMode>
        </Box>
      </Box>
    </Box>
  );
};
