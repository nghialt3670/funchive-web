import { TYPE_NAMES, type Type } from "@/features/function/types";

export const parseArrayJson = (json: string, elementType: Type) => {
  let parsedData: any;

  // Parse JSON string
  try {
    parsedData = JSON.parse(json);
  } catch (error) {
    throw new Error(
      `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown parsing error"}`,
    );
  }

  // Validate that parsed data is an array
  if (!Array.isArray(parsedData)) {
    throw new Error(`Expected JSON to be an array, got ${typeof parsedData}`);
  }

  // Validate each element against the element type
  return parsedData.map((item, index) => {
    return validateValue(item, elementType, `[${index}]`);
  });
};

function validateValue(value: any, type: Type, path: string): any {
  switch (type.name) {
    case TYPE_NAMES.STRING:
      if (typeof value !== "string") {
        throw new Error(`Expected string at ${path}, got ${typeof value}`);
      }
      return value;

    case TYPE_NAMES.NUMBER:
      if (typeof value !== "number" || isNaN(value)) {
        throw new Error(`Expected number at ${path}, got ${typeof value}`);
      }
      return value;

    case TYPE_NAMES.BOOLEAN:
      if (typeof value !== "boolean") {
        throw new Error(`Expected boolean at ${path}, got ${typeof value}`);
      }
      return value;

    case TYPE_NAMES.FILE:
      if (typeof value !== "string") {
        throw new Error(
          `Expected file (string) at ${path}, got ${typeof value}`,
        );
      }

      // Validate file extension if specified
      const fileType = type as any; // FileType
      if (fileType.extension) {
        const expectedExt = fileType.extension.startsWith(".")
          ? fileType.extension
          : `.${fileType.extension}`;
        if (!value.endsWith(expectedExt)) {
          throw new Error(
            `Expected file with extension ${expectedExt} at ${path}, got file: ${value}`,
          );
        }
      }
      return value;

    case TYPE_NAMES.ARRAY:
      if (!Array.isArray(value)) {
        throw new Error(`Expected array at ${path}, got ${typeof value}`);
      }

      const arrayType = type as any; // ArrayType
      const validatedArray = value.map((item, index) => {
        return validateValue(item, arrayType.elementType, `${path}[${index}]`);
      });
      return validatedArray;

    case TYPE_NAMES.OBJECT:
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error(`Expected object at ${path}, got ${typeof value}`);
      }

      const objectType = type as any; // ObjectType
      return validateObject(value, objectType.schema, path);

    default:
      throw new Error(`Unknown type: ${(type as any).name} at ${path}`);
  }
}

function validateObject(
  obj: any,
  schema: Record<string, Type>,
  path: string,
): any {
  const result: any = {};

  // Check all schema fields
  for (const [fieldName, fieldType] of Object.entries(schema)) {
    const fieldPath = `${path}.${fieldName}`;
    const fieldValue = obj[fieldName];

    // Check if field is missing
    if (fieldValue === undefined) {
      // Use default value if available and enabled
      if (fieldType.useDefaultValue && fieldType.defaultValue !== undefined) {
        result[fieldName] = fieldType.defaultValue;
      } else {
        throw new Error(`Missing required field: ${fieldPath}`);
      }
    } else {
      // Validate field value against type
      result[fieldName] = validateValue(fieldValue, fieldType, fieldPath);
    }
  }

  // Check for unexpected fields
  for (const fieldName of Object.keys(obj)) {
    if (!(fieldName in schema)) {
      throw new Error(`Unexpected field: ${path}.${fieldName}`);
    }
  }

  return result;
}
