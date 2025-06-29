import type { Sort } from "@/types/api";

export interface BaseType {
  name: string;
  description?: string;
  defaultValue?: any;
}

export interface StringType extends BaseType {
  name: "STRING";
}

export interface NumberType extends BaseType {
  name: "NUMBER";
}

export interface BooleanType extends BaseType {
  name: "BOOLEAN";
}

export interface FileType extends BaseType {
  name: "FILE";
  extension?: string;
}

export interface ArrayType extends BaseType {
  name: "ARRAY";
  elementType: Type;
}

export interface ObjectType extends BaseType {
  name: "OBJECT";
  schema: Record<string, Type>;
}

export type Type =
  | StringType
  | NumberType
  | BooleanType
  | FileType
  | ArrayType
  | ObjectType;

export const TYPE_NAMES = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
  FILE: "FILE",
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
} as const;

export type TypeName = keyof typeof TYPE_NAMES;

export type CompilationStatus =
  | "OUTDATED"
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED";

export interface Definition {
  name: string;
  description: string;
  inputType: Type;
  outputType: Type;
}

export interface Implementation {
  language: Language;
  code: string;
}

export interface PythonImplementation extends Implementation {
  language: "PYTHON";
  version: string;
  imports: Array<{ source: string; target: string }>;
  packages: Array<{ name: string; version: string }>;
}

export interface FunctionCreateDto {
  definition: Definition;
  implementation: Implementation;
}

export interface FunctionUpdateDto {
  definition: Definition;
  implementation: Implementation;
}

export interface FunctionDetailDto {
  id: string;
  name: string;
  description: string;
  definition: Definition;
  implementation: Implementation;
  compilationStatus: CompilationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface FunctionFilter {
  keyword?: string;
  language?: string;
}

export interface SortOption {
  value: Sort;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: { field: "createdAt", order: "desc" }, label: "newest-first" },
  { value: { field: "createdAt", order: "asc" }, label: "oldest-first" },
  { value: { field: "updatedAt", order: "desc" }, label: "recently-updated" },
  {
    value: { field: "updatedAt", order: "asc" },
    label: "least-recently-updated",
  },
  { value: { field: "definition.name", order: "asc" }, label: "name-a-z" },
  { value: { field: "definition.name", order: "desc" }, label: "name-z-a" },
];

export interface ExecutionTriggerDto {
  inputData: any;
}

export type Language = "PYTHON" | "C#" | "JAVA" | "GO";
