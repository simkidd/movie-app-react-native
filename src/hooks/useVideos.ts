import { IVideo } from "@/interfaces/movie.interface";
import { getVideos } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useVideos = (mediaType: "movie" | "tv", id: number) => {
  return useQuery({
    queryKey: ["getVideos", mediaType, id],
    queryFn: async () => getVideos(mediaType, id),
    enabled: !!id,
    // select: (data) => data.results,
  });
};
