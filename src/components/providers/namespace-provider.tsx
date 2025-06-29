import { NamespaceContext } from "@/contexts/namespace-context.tsx";
import { type FC, type PropsWithChildren, useContext } from "react";

export interface NamespaceProviderProps extends PropsWithChildren {
  namespace: string;
}

export const NamespaceProvider: FC<NamespaceProviderProps> = ({
  children,
  namespace,
}) => {
  const parentNamespace = useContext(NamespaceContext);
  const currentNamespace = parentNamespace
    ? `${parentNamespace}.${namespace}`
    : namespace;

  return (
    <NamespaceContext.Provider value={currentNamespace}>
      {children}
    </NamespaceContext.Provider>
  );
};
