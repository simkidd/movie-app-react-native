import { IVideo } from "@/interfaces/movie.interface";
import axios from "axios";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  // headers: {
  //   accept: "application/json",
  //   Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  // },
};

const api = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  // headers: TMDB_CONFIG.headers,
  params: {
    api_key: TMDB_CONFIG.API_KEY,
  },
});

export const moviesApi = {
  // Category endpoints
  getMovies: (category: string, page: number = 1) => {
    const endpoint =
      category === "trending" ? "/trending/movie/day" : `/movie/${category}`;
    return api.get(endpoint, { params: { page } });
  },
  // Discover with filters
  discover: (params: Record<string, any>) =>
    api.get("/discover/movie", { params }),

  // Movie details
  details: (id: number) =>
    api.get(`/movie/${id}`, {
      params: { append_to_response: "videos,credits" },
    }),

  // Similar
  similar: (id: number) => api.get(`/movie/${id}/similar`),

  // Search
  search: (query: string, page: number = 1) =>
    api.get("/search/movie", { params: { query, page } }),
};

export const tvApi = {
  // TV Show endpoints
  getTV: (category: string, page: number = 1) => {
    const endpoint =
      category === "trending" ? "/trending/tv/day" : `/tv/${category}`;
    return api.get(endpoint, { params: { page } });
  },

  tvDetails: (id: number) =>
    api.get(`/tv/${id}`, { params: { append_to_response: "videos,credits" } }),

  searchTV: (query: string, page: number = 1) =>
    api.get("/search/tv", { params: { query, page } }),
};

export const imageUri = (path: string, size: string = "w500") => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getSimilar = async (mediaType: "movie" | "tv", id: number) => {
  const response = await api.get(`/${mediaType}/${id}/similar`);
  return response.data;
};

export const getVideos = async (mediaType: "movie" | "tv", id: number) => {
  const response = await api.get<{ results: IVideo[] }>(
    `/${mediaType}/${id}/videos`
  );
  return response.data;
};

export const getCastDetails = async (castId: string) => {
  const response = await api.get(`/person/${castId}`, {
    params: { append_to_response: "combined_credits" },
  });
  return response.data;
};
