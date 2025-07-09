import { MessageContext } from "@/contexts/message-context";
import { useContext } from "react";

export const useMessage = () => {
  const message = useContext(MessageContext);
  if (!message) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return message;
};
