import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { pipelineApi } from "./pipeline-api";
import type { PageRequest } from "@/types/api";
import type {
  PipelineCreateDto,
  PipelineExecutionTriggerDto,
  PipelineFilter,
  PipelineUpdateDto,
} from "@/features/pipeline/pipeline-types";

export const pipelineQueryKeys = {
  all: ["pipelines"] as const,
  lists: () => [...pipelineQueryKeys.all, "list"] as const,
  list: (filter: PipelineFilter, pageRequest: PageRequest) =>
    [...pipelineQueryKeys.lists(), filter, pageRequest] as const,
  details: () => [...pipelineQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...pipelineQueryKeys.details(), id] as const,
};

export const usePipelineDetail = (
  pipelineId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: pipelineQueryKeys.detail(pipelineId),
    queryFn: () => pipelineApi.getPipelineDetail(pipelineId),
    enabled: enabled && !!pipelineId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePipelinePage = (
  filter: PipelineFilter = {},
  pageRequest: PageRequest = {},
) => {
  return useQuery({
    queryKey: pipelineQueryKeys.list(filter, pageRequest),
    queryFn: () => pipelineApi.getPipelinePage(filter, pageRequest),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PipelineCreateDto) =>
      pipelineApi.createPipeline(data),
    onSuccess: (newPipeline) => {
      // Invalidate list queries to refresh the pipeline list
      queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.lists() });

      // Cache the new pipeline detail
      queryClient.setQueryData(
        pipelineQueryKeys.detail(newPipeline.id),
        newPipeline,
      );

      message.success("Pipeline created successfully!");
    },
    onError: (error: any) => {
      message.error(
        `Failed to create pipeline: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useUpdatePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pipelineId,
      data,
    }: {
      pipelineId: string;
      data: PipelineUpdateDto;
    }) => pipelineApi.updatePipeline(pipelineId, data),
    onSuccess: (updatedPipeline, variables) => {
      // Update the cached pipeline detail
      queryClient.setQueryData(
        pipelineQueryKeys.detail(variables.pipelineId),
        updatedPipeline,
      );

      // Invalidate list queries to refresh the pipeline list
      queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.lists() });

      message.success("Pipeline updated successfully!");
    },
    onError: (error: any) => {
      message.error(
        `Failed to update pipeline: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useDeletePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pipelineId: string) =>
      pipelineApi.deletePipeline(pipelineId),
    onSuccess: (_, pipelineId) => {
      // Remove the cached pipeline detail
      queryClient.removeQueries({
        queryKey: pipelineQueryKeys.detail(pipelineId),
      });

      // Invalidate list queries to refresh the pipeline list
      queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.lists() });

      message.success("Pipeline deleted successfully!");
    },
    onError: (error: any) => {
      message.error(
        `Failed to delete pipeline: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useExecutePipeline = () => {
  return useMutation({
    mutationFn: ({
      pipelineId,
      executionData,
    }: {
      pipelineId: string;
      executionData: PipelineExecutionTriggerDto;
    }) => pipelineApi.executePipeline(pipelineId, executionData),
    onSuccess: () => {
      message.success("Pipeline execution started successfully!");
    },
    onError: (error: any) => {
      message.error(
        `Failed to execute pipeline: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

// Composite hook for pipeline operations
export const usePipelineOperations = () => {
  const updateMutation = useUpdatePipeline();
  const deleteMutation = useDeletePipeline();
  const executeMutation = useExecutePipeline();

  return {
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    execute: executeMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExecuting: executeMutation.isPending,
  };
};

// Hook for pipeline optimistic updates
export const usePipelineOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  const updatePipelineCache = (
    pipelineId: string,
    updater: (oldData: any) => any,
  ) => {
    queryClient.setQueryData(
      pipelineQueryKeys.detail(pipelineId),
      (old: any) => (old ? updater(old) : old),
    );
  };

  const addNodeToCache = (pipelineId: string, node: any) => {
    updatePipelineCache(pipelineId, (old) => ({
      ...old,
      nodes: [...old.nodes, node],
    }));
  };

  const removeNodeFromCache = (pipelineId: string, nodeId: string) => {
    updatePipelineCache(pipelineId, (old) => ({
      ...old,
      nodes: old.nodes.filter((node: any) => node.id !== nodeId),
      connections: old.connections.filter(
        (conn: any) =>
          conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId,
      ),
    }));
  };

  const updateNodeInCache = (pipelineId: string, nodeId: string, updates: any) => {
    updatePipelineCache(pipelineId, (old) => ({
      ...old,
      nodes: old.nodes.map((node: any) =>
        node.id === nodeId ? { ...node, ...updates } : node,
      ),
    }));
  };

  const addConnectionToCache = (pipelineId: string, connection: any) => {
    updatePipelineCache(pipelineId, (old) => ({
      ...old,
      connections: [...old.connections, connection],
    }));
  };

  const removeConnectionFromCache = (pipelineId: string, connectionId: string) => {
    updatePipelineCache(pipelineId, (old) => ({
      ...old,
      connections: old.connections.filter((conn: any) => conn.id !== connectionId),
    }));
  };

  return {
    updatePipelineCache,
    addNodeToCache,
    removeNodeFromCache,
    updateNodeInCache,
    addConnectionToCache,
    removeConnectionFromCache,
  };
};

// Hook for pipeline validation
export const usePipelineValidation = () => {
  const validatePipeline = (nodes: any[], connections: any[]) => {
    const errors: string[] = [];

    // Check for circular dependencies
    const hasCircularDependency = (
      nodeId: string,
      visited: Set<string>,
      recursionStack: Set<string>,
    ): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const dependentConnections = connections.filter(
        (conn) => conn.sourceNodeId === nodeId,
      );

      for (const conn of dependentConnections) {
        if (hasCircularDependency(conn.targetNodeId, visited, recursionStack)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const node of nodes) {
      if (hasCircularDependency(node.id, visited, recursionStack)) {
        errors.push("Circular dependency detected in pipeline");
        break;
      }
    }

    // Check for invalid connections
    for (const connection of connections) {
      const sourceNode = nodes.find((n) => n.id === connection.sourceNodeId);
      const targetNode = nodes.find((n) => n.id === connection.targetNodeId);

      if (!sourceNode) {
        errors.push(`Connection references non-existent source node: ${connection.sourceNodeId}`);
      }

      if (!targetNode) {
        errors.push(`Connection references non-existent target node: ${connection.targetNodeId}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return { validatePipeline };
}; 