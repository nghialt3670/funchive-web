import axios from 'axios';
import type { PageRequest, ResponseBody, ResponsePage } from '@/types/api';
import type {
  ExecutionTriggerDto,
  FunctionCreateDto,
  FunctionDetailDto,
  FunctionFilter,
  FunctionUpdateDto,
} from '@/features/function/function-types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const functionAxios = axios.create({
  baseURL: API_BASE_URL + '/funchive-function-service',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const functionApi = {
  createFunction: async (
    data: FunctionCreateDto,
    compile: boolean = false,
  ): Promise<FunctionDetailDto> => {
    const response = await functionAxios.post<ResponseBody<FunctionDetailDto>>(
      '/functions',
      data,
      {
        params: { compile },
      },
    );
    return response.data.data;
  },

  getFunctionDetail: async (functionId: string): Promise<FunctionDetailDto> => {
    const response = await functionAxios.get<ResponseBody<FunctionDetailDto>>(
      `/functions/${functionId}`,
    );
    return response.data.data;
  },

  getFunctionPage: async (
    filter: FunctionFilter = {},
    pageRequest: PageRequest = {},
  ): Promise<ResponsePage<FunctionDetailDto>> => {
    const params = {
      keyword: filter.keyword || '',
      language: filter.language || '',
      page: pageRequest.page || 0,
      size: pageRequest.size || 20,
      ...(pageRequest.sort && { sort: pageRequest.sort }),
    };

    const response = await functionAxios.get<
      ResponseBody<ResponsePage<FunctionDetailDto>>
    >('/functions', { params });
    return response.data.data;
  },

  updateFunction: async (
    functionId: string,
    data: FunctionUpdateDto,
    compile: boolean = false,
  ): Promise<FunctionDetailDto> => {
    const response = await functionAxios.put<ResponseBody<FunctionDetailDto>>(
      `/functions/${functionId}`,
      data,
      {
        params: { compile },
      },
    );
    return response.data.data;
  },

  deleteFunction: async (functionId: string): Promise<FunctionDetailDto> => {
    const response = await functionAxios.delete<
      ResponseBody<FunctionDetailDto>
    >(`/functions/${functionId}`);
    return response.data.data;
  },

  compileFunction: async (functionId: string): Promise<void> => {
    await functionAxios.post<ResponseBody<null>>(
      `/functions/${functionId}/compile`,
    );
  },

  executeFunction: async (
    functionId: string,
    executionData: ExecutionTriggerDto,
  ): Promise<void> => {
    await functionAxios.post<ResponseBody<null>>(
      `/functions/${functionId}/execute`,
      executionData,
    );
  },
};

functionAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

functionAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
