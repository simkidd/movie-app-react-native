import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { moviesApi, tvApi } from "../services/api";
import {
  ITVShow,
  ITVShowDetails,
  ITVShowListResponse,
} from "@/interfaces/tv.interface";

export type ITVCategory =
  | "popular"
  | "topRated"
  | "onTheAir"
  | "airingToday"
  | "trending";

const createTVInfiniteQuery = (category: string) => {
  return useInfiniteQuery<ITVShowListResponse>({
    queryKey: ["tv", category],
    queryFn: ({ pageParam = 1 }) =>
      tvApi.getTV(category, pageParam as number).then((res) => res.data),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useTvShows = {
  popular: () => createTVInfiniteQuery("popular"),
  topRated: () => createTVInfiniteQuery("top_rated"),
  onTheAir: () => createTVInfiniteQuery("on_the_air"),
  airingToday: () => createTVInfiniteQuery("airing_today"),
  trending: () => createTVInfiniteQuery("trending"),

  details: (id: number) => {
    return useQuery({
      queryKey: ["tv", "details", id],
      queryFn: () => tvApi.tvDetails(id).then((res) => res.data),
    });
  },

  search: (query: string) => {
    return useInfiniteQuery<ITVShowListResponse>({
      queryKey: ["tv", "search", query],
      queryFn: ({ pageParam = 1 }) =>
        tvApi.searchTV(query, pageParam as number).then((res) => res.data),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
      enabled: !!query,
    });
  },
};
