import { PythonImplementationBuilder } from "@/features/function/components/python-implementation-builder";
import type { FunctionDetail } from "@/features/function/types";
import React from "react";

interface FunctionImplementationTabProps {
  id?: string;
  form: any;
  functionBody: string;
  setFunctionBody: (body: string) => void;
  functionName: string;
  functionDetail?: FunctionDetail;
}

export const FunctionImplementationTab: React.FC<
  FunctionImplementationTabProps
> = ({
  id,
  form,
  functionBody,
  setFunctionBody,
  functionName,
  functionDetail,
}) => {
  return (
    <PythonImplementationBuilder
      form={form}
      functionBody={functionBody}
      setFunctionBody={setFunctionBody}
      functionName={functionName}
      mode={id ? "view" : "create"}
      functionDetail={functionDetail}
    />
  );
};
