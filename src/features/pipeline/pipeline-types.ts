// Value types for pipeline nodes (matching backend structure)
export interface Value<T = any> {
  type: string;
  data: T;
}

// Position for UI representation
export interface Position {
  x: number;
  y: number;
}

// Base Node interface
export interface Node {
  id: string;
  nodeType: "VALUE" | "FUNCTION";
  name: string;
  position: Position;
}

// Value Node - contains static data
export interface ValueNode extends Node {
  nodeType: "VALUE";
  value: Value<any>;
}

// Function Node - references an existing function
export interface FunctionNode extends Node {
  nodeType: "FUNCTION";
  functionId: string;
}

// Connection between nodes
export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort?: string; // Output parameter name
  targetPort?: string; // Input parameter name or object field path
}

// Main Pipeline interface
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// DTOs for API operations
export interface PipelineCreateDto {
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
}

export interface PipelineUpdateDto {
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
}

export interface PipelineDetailDto {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PipelineFilter {
  keyword?: string;
  createdBy?: string;
}

export interface PipelineExecutionTriggerDto {
  inputs: Record<string, Value<any>>; // Map of node IDs to their input values
}

// Sort options for pipeline listing
export interface SortOption {
  value: string;
  label: string;
}

export const PIPELINE_SORT_OPTIONS: SortOption[] = [
  { value: "createdAt,desc", label: "Newest First" },
  { value: "createdAt,asc", label: "Oldest First" },
  { value: "updatedAt,desc", label: "Recently Updated" },
  { value: "updatedAt,asc", label: "Least Recently Updated" },
  { value: "name,asc", label: "Name (A-Z)" },
  { value: "name,desc", label: "Name (Z-A)" },
];

// UI State interfaces for pipeline editor
export interface DragState {
  isDragging: boolean;
  dragType: "node" | "connection" | null;
  dragData: any;
  startPosition: Position;
  currentPosition: Position;
}

export interface ConnectionDragState {
  isConnecting: boolean;
  startPoint: ConnectionPoint | null;
  currentPosition: Position;
  previewConnection: Connection | null;
}

export interface ConnectionPoint {
  nodeId: string;
  type: "input" | "output";
  key: string; // The key in the function's input/output type schema
  dataType: string; // Type name like "STRING", "NUMBER", etc.
}

// UI Pipeline Node for visualization (extends backend Node with UI state)
export interface PipelineUINode extends Node {
  isSelected?: boolean;
  isConnecting?: boolean;
  error?: string;
}

// Execution status for pipeline runs
export type PipelineExecutionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export interface PipelineExecution {
  id: string;
  pipelineId: string;
  status: PipelineExecutionStatus;
  startedAt: string;
  completedAt?: string;
  error?: string;
  results?: Record<string, any>;
}
