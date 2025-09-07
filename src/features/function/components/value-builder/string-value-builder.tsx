import { useUploadValueFile } from "@/features/storage/hooks";
import { useMessage } from "@/hooks/use-message";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { UploadOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Input, Tooltip } from "antd";
import { Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import { to } from "await-to-js";
import { type FC, useEffect } from "react";

import { type StringValue, TYPE_NAMES } from "../../types";
import { readFileAsText } from "../../utils/read-file-as-text";

const { TextArea } = Input;

export interface StringValueBuilderProps {
  value?: StringValue;
  onChange?: (value: StringValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const StringValueBuilder: FC<StringValueBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const message = useMessage();
  const { t: nt } = useNamespacedTranslation();
  const {
    mutate: uploadValueFile,
    isPending,
    isSuccess,
    data: metadata,
  } = useUploadValueFile();

  useEffect(() => {
    if (isSuccess) {
      onChange?.({
        typeName: TYPE_NAMES.STRING,
        id: metadata?.id,
      } as StringValue);
    }
  }, [isSuccess]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.({ typeName: TYPE_NAMES.STRING, data: e.target.value });
  };

  const handleBeforeUpload = async (file: RcFile) => {
    if (file.size > 1024 * 1024 * 10) {
      uploadValueFile({ file });
    } else {
      const [error, text] = await to(readFileAsText(file));

      if (error) {
        console.error(error);
        message.error(nt("failed-to-read-file"));
      } else {
        onChange?.({ typeName: TYPE_NAMES.STRING, data: text } as StringValue);
      }
    }

    return false;
  };

  return (
    <Stack direction="row" gap={1}>
      <TextArea
        value={value?.data}
        onChange={handleTextAreaChange}
        autoSize={{ minRows: 1, maxRows: 5 }}
        disabled={disabled}
        readOnly={readOnly}
      />
      {!readOnly && (
        <Upload
          showUploadList={false}
          disabled={disabled}
          accept=".txt"
          maxCount={1}
          multiple={false}
          beforeUpload={handleBeforeUpload}
        >
          <Tooltip title={nt("upload-text-file")}>
            <Button icon={<UploadOutlined />} loading={isPending} />
          </Tooltip>
        </Upload>
      )}
    </Stack>
  );
};
