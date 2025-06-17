import axios from "axios";
import type { PageRequest, ResponseBody, ResponsePage } from "@/types/api";
import type {
  PipelineCreateDto,
  PipelineDetailDto,
  PipelineExecutionTriggerDto,
  PipelineFilter,
  PipelineUpdateDto,
} from "@/features/pipeline/pipeline-types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const pipelineAxios = axios.create({
  baseURL: API_BASE_URL + "/funchive-function-service",
  headers: {
    "Content-Type": "application/json",
  },
});

export const pipelineApi = {
  createPipeline: async (
    data: PipelineCreateDto,
  ): Promise<PipelineDetailDto> => {
    const response = await pipelineAxios.post<ResponseBody<PipelineDetailDto>>(
      "/pipelines",
      data,
    );
    return response.data.data;
  },

  getPipelineDetail: async (pipelineId: string): Promise<PipelineDetailDto> => {
    const response = await pipelineAxios.get<ResponseBody<PipelineDetailDto>>(
      `/pipelines/${pipelineId}`,
    );
    return response.data.data;
  },

  getPipelinePage: async (
    filter: PipelineFilter = {},
    pageRequest: PageRequest = {},
  ): Promise<ResponsePage<PipelineDetailDto>> => {
    const params = {
      keyword: filter.keyword || "",
      createdBy: filter.createdBy || "",
      page: pageRequest.page || 0,
      size: pageRequest.size || 20,
      ...(pageRequest.sort && { sort: pageRequest.sort }),
    };

    const response = await pipelineAxios.get<
      ResponseBody<ResponsePage<PipelineDetailDto>>
    >("/pipelines", { params });
    return response.data.data;
  },

  updatePipeline: async (
    pipelineId: string,
    data: PipelineUpdateDto,
  ): Promise<PipelineDetailDto> => {
    const response = await pipelineAxios.put<ResponseBody<PipelineDetailDto>>(
      `/pipelines/${pipelineId}`,
      data,
    );
    return response.data.data;
  },

  deletePipeline: async (pipelineId: string): Promise<PipelineDetailDto> => {
    const response = await pipelineAxios.delete<
      ResponseBody<PipelineDetailDto>
    >(`/pipelines/${pipelineId}`);
    return response.data.data;
  },

  executePipeline: async (
    pipelineId: string,
    executionData: PipelineExecutionTriggerDto,
  ): Promise<void> => {
    await pipelineAxios.post<ResponseBody<null>>(
      `/pipelines/${pipelineId}/execute`,
      executionData,
    );
  },
};

// Add request interceptor for authentication
pipelineAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
pipelineAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
); 