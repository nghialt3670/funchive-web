import { useContext } from 'react';
import { NamespaceContext } from '@/contexts/namespace-context';

export const useNamespace = () => {
  return useContext(NamespaceContext);
};
