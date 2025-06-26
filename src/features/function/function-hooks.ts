import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { functionApi } from './function-api';
import type { PageRequest } from '@/types/api';
import type {
  ExecutionTriggerDto,
  FunctionCreateDto,
  FunctionFilter,
  FunctionUpdateDto,
} from '@/features/function/function-types';

export const functionQueryKeys = {
  all: ['functions'] as const,
  lists: () => [...functionQueryKeys.all, 'list'] as const,
  list: (filter: FunctionFilter, pageRequest: PageRequest) =>
    [...functionQueryKeys.lists(), filter, pageRequest] as const,
  details: () => [...functionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...functionQueryKeys.details(), id] as const,
};

export const useFunctionDetailQuery = (
  functionId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: functionQueryKeys.detail(functionId),
    queryFn: () => functionApi.getFunctionDetail(functionId),
    enabled: enabled && !!functionId,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useFunctionPageQuery = (
  filter: FunctionFilter = {},
  pageRequest: PageRequest = {},
) => {
  return useQuery({
    queryKey: functionQueryKeys.list(filter, pageRequest),
    queryFn: () => functionApi.getFunctionPage(filter, pageRequest),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateFunctionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      compile = false,
    }: {
      data: FunctionCreateDto;
      compile?: boolean;
    }) => functionApi.createFunction(data, compile),
    onSuccess: (newFunction) => {
      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      queryClient.setQueryData(
        functionQueryKeys.detail(newFunction.id),
        newFunction,
      );

      message.success('Function created successfully!');
    },
    onError: (error: any) => {
      message.error(
        `Failed to create function: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useUpdateFunctionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      functionId,
      data,
      compile = false,
    }: {
      functionId: string;
      data: FunctionUpdateDto;
      compile?: boolean;
    }) => functionApi.updateFunction(functionId, data, compile),
    onSuccess: (updatedFunction, variables) => {
      queryClient.setQueryData(
        functionQueryKeys.detail(variables.functionId),
        updatedFunction,
      );

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      message.success('Function updated successfully!');
    },
    onError: (error: any) => {
      message.error(
        `Failed to update function: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useDeleteFunctionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (functionId: string) => functionApi.deleteFunction(functionId),
    onSuccess: (_, functionId) => {
      queryClient.removeQueries({
        queryKey: functionQueryKeys.detail(functionId),
      });

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      message.success('Function deleted successfully!');
    },
    onError: (error: any) => {
      message.error(
        `Failed to delete function: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useCompileFunctionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (functionId: string) => functionApi.compileFunction(functionId),
    onSuccess: (_, functionId) => {
      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.detail(functionId),
      });

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      message.success('Function compilation started successfully!');
    },
    onError: (error: any) => {
      message.error(
        `Failed to compile function: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useExecuteFunctionMutation = () => {
  return useMutation({
    mutationFn: ({
      functionId,
      executionData,
    }: {
      functionId: string;
      executionData: ExecutionTriggerDto;
    }) => functionApi.executeFunction(functionId, executionData),
    onSuccess: () => {
      message.success('Function executed successfully!');
    },
    onError: (error: any) => {
      message.error(
        `Failed to execute function: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useFunctionOperations = () => {
  const updateMutation = useUpdateFunctionMutation();
  const deleteMutation = useDeleteFunctionMutation();
  const compileMutation = useCompileFunctionMutation();
  const executeMutation = useExecuteFunctionMutation();

  return {
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    compile: compileMutation.mutate,
    execute: executeMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCompiling: compileMutation.isPending,
    isExecuting: executeMutation.isPending,
  };
};

export const useFunctionOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  const updateCompilationStatus = (
    functionId: string,
    status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED',
  ) => {
    queryClient.setQueryData(
      functionQueryKeys.detail(functionId),
      (old: any) => (old ? { ...old, compilationStatus: status } : old),
    );
  };

  return { updateCompilationStatus };
};
