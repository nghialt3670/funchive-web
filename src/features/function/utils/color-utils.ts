import {
  type CompilationStatus,
  type Type,
} from "@/features/function/function-types";

export const getTypeColor = (type: Type) => {
  switch (type.name) {
    case "STRING":
      return "geekblue";
    case "NUMBER":
      return "green";
    case "BOOLEAN":
      return "red";
    case "FILE":
      return "purple";
    case "ARRAY":
      return "orange";
    case "OBJECT":
      return "blue";
    default:
      return "gray";
  }
};

export const getCompilationStatusColor = (status: CompilationStatus) => {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "FAILED":
      return "error";
    case "IN_PROGRESS":
      return "processing";
    case "OUTDATED":
      return "warning";
    case "NOT_STARTED":
      return "default";
    default:
      return "default";
  }
};
