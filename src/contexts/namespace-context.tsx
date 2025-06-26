import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from 'react';

export const NamespaceContext = createContext<string | null>(null);

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
