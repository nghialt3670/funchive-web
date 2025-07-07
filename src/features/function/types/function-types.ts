import type {
  ImplementationBasic,
  ImplementationCreate,
} from "./implementation-types.ts";
import type { Type } from "./type-types.ts";

export interface FunctionCreate {
  name: string;
  description: string;
  inputType: Type;
  outputType: Type;
  implementations: ImplementationCreate[];
}

export interface FunctionUpdate {
  name: string;
  description: string;
}

export interface FunctionDetail {
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
  [key: string]: string | undefined;
}
