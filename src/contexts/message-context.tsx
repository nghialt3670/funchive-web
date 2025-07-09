import type { MessageInstance } from "antd/lib/message/interface";
import { createContext } from "react";

export const MessageContext = createContext<MessageInstance | null>(null);
