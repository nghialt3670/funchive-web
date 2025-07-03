export interface PythonImplementationCreate {
  type: "PYTHON";
  name: string;
  description: string;
  version: string;
  imports: Array<{ source: string; target: string }>;
  packages: Array<{ name: string; version: string }>;
  functionBody: string;
}

export interface PythonImplementationBasic {
  id: string;
  type: "PYTHON";
  name: string;
}

export interface PythonImplementationDetail {
  id: string;
  type: "PYTHON";
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: string;
  imports: Array<{ source: string; target: string }>;
  packages: Array<{ name: string; version: string }>;
  functionBody: string;
  compilationStatus: string;
}

export interface PythonImplementationUpdate {
  type: "PYTHON";
  name: string;
  description: string;
  version: string;
  imports: Array<{ source: string; target: string }>;
  packages: Array<{ name: string; version: string }>;
  functionBody: string;
}

export interface JavaImplementationCreate {
  type: "JAVA";
  name: string;
  description: string;
  version: string;
  imports: string[];
  dependencies: Array<{ groupId: string; artifactId: string; version: string }>;
  functionBody: string;
}

export interface JavaImplementationBasic {
  id: string;
  type: "JAVA";
  name: string;
}

export interface JavaImplementationDetail {
  id: string;
  type: "JAVA";
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: string;
  imports: string[];
  dependencies: Array<{ groupId: string; artifactId: string; version: string }>;
  functionBody: string;
  compilationStatus: string;
}

export interface JavaImplementationUpdate {
  type: "JAVA";
  name: string;
  description: string;
  version: string;
  imports: string[];
  dependencies: Array<{ groupId: string; artifactId: string; version: string }>;
  functionBody: string;
}

export interface HttpImplementationCreate {
  type: "HTTP";
  name: string;
  description: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  accessPath: string;
}

export interface HttpImplementationBasic {
  id: string;
  type: "HTTP";
  name: string;
}

export interface HttpImplementationDetail {
  id: string;
  type: "HTTP";
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  accessPath: string;
}

export interface HttpImplementationUpdate {
  type: "HTTP";
  name: string;
  description: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  accessPath: string;
}

export type ImplementationCreate =
  | PythonImplementationCreate
  | JavaImplementationCreate
  | HttpImplementationCreate;

export type ImplementationBasic =
  | PythonImplementationBasic
  | JavaImplementationBasic
  | HttpImplementationBasic;

export type ImplementationDetail =
  | PythonImplementationDetail
  | JavaImplementationDetail
  | HttpImplementationDetail;

export type ImplementationUpdate =
  | PythonImplementationUpdate
  | JavaImplementationUpdate
  | HttpImplementationUpdate;

export interface ImplementationFilter {
  keyword?: string;
}
