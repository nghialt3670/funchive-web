export interface BaseValue<T> {
  type: string;
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
  type: "STRING";
  data: string;
}

export interface NumberValue extends BaseValue<number> {
  type: "NUMBER";
  data: number;
}

export interface BooleanValue extends BaseValue<boolean> {
  type: "BOOLEAN";
  data: boolean;
}

export interface FileValue extends LoadableValue<FileMetadata> {
  type: "FILE";
  data: FileMetadata;
  id: string;
}

export interface ArrayValue extends LoadableValue<Value[]> {
  type: "ARRAY";
  data: Value[];
}

export interface ObjectValue extends LoadableValue<Record<string, Value>> {
  type: "OBJECT";
  data: Record<string, Value>;
}

export type Value =
  | StringValue
  | NumberValue
  | BooleanValue
  | FileValue
  | ArrayValue
  | ObjectValue;
