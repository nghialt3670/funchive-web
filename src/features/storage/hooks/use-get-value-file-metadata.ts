import { useQuery } from "@tanstack/react-query";

import { getValueFileMetadata } from "../api";

export const useGetValueFileMetadata = (valueId: string) => {
  return useQuery({
    queryKey: ["valueFileMetadata", valueId],
    queryFn: () => getValueFileMetadata(valueId),
    enabled: !!valueId,
  });
};
