import { compileFunction } from "./compile-function.ts";
import { createFunction } from "./create-function";
import { createImplementation } from "./create-implementation";
import { deleteFunction } from "./delete-function";
import { deleteImplementation } from "./delete-implementation";
import { executeFunction } from "./execute-function.ts";
import { getFunctionDetail } from "./get-function-detail";
import { getFunctionPage } from "./get-function-page";
import { getImplementationDetail } from "./get-implementation-detail";
import { getImplementationPage } from "./get-implementation-page";
import { updateFunction } from "./update-function";
import { updateImplementation } from "./update-implementation";

export const functionApi = {
  createFunction,
  getFunctionDetail,
  getFunctionPage,
  updateFunction,
  deleteFunction,
  createImplementation,
  getImplementationDetail,
  getImplementationPage,
  updateImplementation,
  deleteImplementation,
  compileImplementation: compileFunction,
  executeImplementation: executeFunction,
};
