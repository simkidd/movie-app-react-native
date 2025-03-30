import { getSimilar } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useSimilar = (mediaType: "movie" | "tv", id: number) => {
  return useQuery({
    queryKey: ["getSimilar", mediaType, id],
    queryFn: async () => getSimilar(mediaType, id),
    enabled: !!id,
  });
};
