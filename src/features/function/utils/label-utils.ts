import { type CompilationStatus, type Type } from '@/features/function/function-types';

export const getCompilationStatusLabel = (status: CompilationStatus) => {
  switch (status) {
    case 'SUCCESS':
      return 'SUCCESS';
    case 'FAILED':
      return 'FAILED';
    case 'IN_PROGRESS':
      return 'IN PROGRESS';
    case 'OUTDATED':
      return 'OUTDATED';
    case 'NOT_STARTED':
      return 'NOT STARTED';
    default:
      return status;
  }
};

export const getTypeRepresentation = (type: Type): object | string => {
  switch (type.name) {
    case 'OBJECT':
      return Object.fromEntries(
          Object.entries(type.schema).map(([key, value]) => [
            key,
            getTypeRepresentation(value),
          ]),
        );
    default:
      return type.name;
  }
};