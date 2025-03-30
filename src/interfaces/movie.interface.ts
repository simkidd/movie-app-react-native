// Basic movie interface
export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  genre_ids?: number[];
  original_language: string;
  original_title: string;
}

// Detailed movie interface (extends basic movie)
export interface IMovieDetails extends IMovie {
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  genres: IGenre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  spoken_languages: ISpokenLanguage[];
  belongs_to_collection: ICollection | null;
}

// Movie credits
export interface IMovieCredits {
  id: number;
  cast: ICastMember[];
  crew: ICrewMember[];
}

// Movie with credits (for API response)
export interface IMovieWithCredits extends IMovieDetails {
  credits: IMovieCredits;
}

// Movie with videos (for API response)
export interface IMovieWithVideos extends IMovieDetails {
  videos: {
    results: IVideo[];
  };
}

// Movie list API response
export interface IMovieListResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// Supporting interfaces
export interface IGenre {
  id: number;
  name: string;
}

export interface IProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ICollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface ICastMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface ICrewMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface IVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

// For API responses that include both details and credits/videos
export interface IMovieFullDetails extends IMovieDetails {
  credits: IMovieCredits;
  videos: {
    results: IVideo[];
  };
}

// Type for similar movies response
export interface ISimilarMoviesResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
