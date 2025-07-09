import { MessageContext } from "@/contexts/message-context";
import { message } from "antd";
import type { FC, PropsWithChildren } from "react";

export const MessageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
