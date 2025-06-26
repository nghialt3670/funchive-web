import { NamespaceContext } from "@/contexts/namespace-context";
import { useContext } from "react";

export const useNamespace = () => {
  return useContext(NamespaceContext);
};
