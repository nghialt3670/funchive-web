import React, {
  type PropsWithChildren,
  createContext,
  useContext,
} from "react";

import type { FunctionDetailDto } from "../function-types";

export const FunctionDetailContext = createContext<FunctionDetailDto | null>(
  null,
);

export interface FunctionDetailContextProviderProps extends PropsWithChildren {
  functionDetail: FunctionDetailDto;
}

export const FunctionDetailContextProvider: React.FC<
  FunctionDetailContextProviderProps
> = ({ functionDetail, children }) => {
  return (
    <FunctionDetailContext.Provider value={functionDetail}>
      {children}
    </FunctionDetailContext.Provider>
  );
};

export const useFunctionDetailContext = () => {
  const functionDetail = useContext(FunctionDetailContext);

  if (functionDetail === undefined) {
    throw new Error(
      "useFunctionDetailContext must be used within a FunctionDetailContextProvider",
    );
  }

  if (functionDetail === null) {
    throw new Error("FunctionDetail not found");
  }

  return functionDetail;
};
