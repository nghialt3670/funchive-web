import type {
  ImplementationBasic,
  ImplementationCreate,
} from "./implementation-types.ts";
import type { Type } from "./type-types.ts";

export interface FunctionCreateDto {
  name: string;
  description: string;
  inputType: Type;
  outputType: Type;
  implementations: ImplementationCreate[];
}

export interface FunctionUpdateDto {
  name: string;
  description: string;
}

export interface FunctionDetailDto {
  id: string;
  name: string;
  description: string;
  inputType: Type;
  outputType: Type;
  implementations: ImplementationBasic[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface FunctionFilter {
  keyword?: string;
  language?: string;
}

export interface ExecutionTriggerDto {
  inputData: any;
}
