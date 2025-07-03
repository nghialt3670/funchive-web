import type { Value } from "./value-types.ts";

export interface BaseType {
  name: string;
  description?: string;
  defaultValue?: Value;
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
