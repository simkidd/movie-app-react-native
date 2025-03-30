import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { moviesApi } from "../services/api";

export type IMovieCategory =
  | "popular"
  | "trending"
  | "nowPlaying"
  | "topRated"
  | "upcoming";

// Helper function for infinite queries
const createInfiniteQuery = (category: string) => {
  return useInfiniteQuery({
    queryKey: ["movies", category],
    queryFn: ({ pageParam = 1 }) =>
      moviesApi.getMovies(category, pageParam).then((res) => res.data),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useMovies = {
  // Home Screen Categories
  popular: () => createInfiniteQuery("popular"),
  trending: () => createInfiniteQuery("trending"),
  nowPlaying: () => createInfiniteQuery("now_playing"),
  topRated: () => createInfiniteQuery("top_rated"),
  upcoming: () => createInfiniteQuery("upcoming"),

  // Browse Screen
  discover: (params?: Record<string, any>) => {
    return useInfiniteQuery({
      queryKey: ["movies", "discover", params],
      queryFn: ({ pageParam = 1 }) =>
        moviesApi
          .discover({ page: pageParam, ...params })
          .then((res) => res.data),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
    });
  },

  // Movie Details
  details: (id: number) => {
    return useQuery({
      queryKey: ["movie", "details", id],
      queryFn: () => moviesApi.details(id).then((res) => res.data),
    });
  },

  // Search
  search: (query: string) => {
    return useInfiniteQuery({
      queryKey: ["movies", "search", query],
      queryFn: ({ pageParam = 1 }) =>
        moviesApi.search(query, pageParam).then((res) => res.data),
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: !!query,
    });
  },
};
