export interface BaseValue<T> {
  typeName: string;
  data: T;
}

export interface LoadableValue<T> extends BaseValue<T> {
  id?: string;
}

export interface FileMetadata {
  filename: string;
  mimeType: string;
}

export interface StringValue extends LoadableValue<string> {
  typeName: "STRING";
  data: string;
}

export interface NumberValue extends BaseValue<number> {
  typeName: "NUMBER";
  data: number;
}

export interface BooleanValue extends BaseValue<boolean> {
  typeName: "BOOLEAN";
  data: boolean;
}

export interface FileValue extends LoadableValue<FileMetadata> {
  typeName: "FILE";
  data: FileMetadata;
  id: string;
}

export interface ArrayValue extends LoadableValue<Value[]> {
  typeName: "ARRAY";
  data: Value[];
}

export interface ObjectValue extends LoadableValue<Record<string, Value>> {
  typeName: "OBJECT";
  data: Record<string, Value>;
}

export type Value =
  | StringValue
  | NumberValue
  | BooleanValue
  | FileValue
  | ArrayValue
  | ObjectValue;
