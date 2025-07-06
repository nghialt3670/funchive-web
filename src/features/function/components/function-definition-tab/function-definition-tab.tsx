import { EditableSection } from "@/components/ui/editable-section/editable-section";
import { FormItemWithPageMode } from "@/components/ui/form-item-with-page-mode";
import { usePageMode } from "@/hooks/use-page-mode";
import { TypeBuilder } from "@/features/function/components/type-builder";
import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { Box, useMediaQuery } from "@mui/material";
import { Input } from "antd";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

const DEFAULT_TYPE = {
  name: "STRING" as const,
  description: "",
  defaultValue: undefined,
};

export const FunctionDefinitionTab = () => {
  const { t } = useTranslation();
  const { t: nt } = useNamespacedTranslation();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { pageMode } = usePageMode();

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormItemWithPageMode
          name="description"
          label={t("description")}
          rules={[{ required: true, message: nt("function-description-is-required") }]}
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
              <TypeBuilder
                label={nt("input-type")}
                defaultValue={DEFAULT_TYPE as Type}
                required
              />
            </EditableSection>
          </FormItemWithPageMode>
          <FormItemWithPageMode
            name="outputType"
            style={{ width: "100%", margin: 0 }}
          >
            <EditableSection>
              <TypeBuilder
                label={nt("output-type")}
                defaultValue={DEFAULT_TYPE as Type}
                required
              />
            </EditableSection>
          </FormItemWithPageMode>
        </Box>
      </Box>
    </Box>
  );
};
