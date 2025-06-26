import { useTranslation } from 'react-i18next';
import { useNamespace } from './use-namespace';

export const useNamespacedTranslation = () => {
  const namespace = useNamespace();
  return useTranslation(namespace ?? '');
};
