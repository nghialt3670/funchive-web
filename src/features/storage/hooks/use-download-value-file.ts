import { useMutation } from "@tanstack/react-query";

import { downloadValueFile } from "../api";

export const useDownloadValueFile = () => {
  return useMutation({
    mutationFn: (valueId: string) => downloadValueFile(valueId),
    onError: (error: Error) => {
      console.error(error);
    },
  });
};
