// src/api/useMoviesAPI.ts
import useFetch from "../hooks/useFetch";
import { GetMovieResponse, ListMoviesResponse } from "../types";
import { MICROSERVICE_API } from "./constants";
import { endpoints } from "./endpoints";

export const useMoviesAPI = () => {
  const listMovies = (userId: string) =>
    useFetch<ListMoviesResponse>(
      endpoints.movies.list(userId),
      { method: "GET" },
      MICROSERVICE_API.MOVIES
    );

  const listMoviesByGenre = (userId: string, genre: string) =>
    useFetch<ListMoviesResponse>(
      endpoints.movies.byGenre(userId, genre),
      {
        method: "GET",
      },
      MICROSERVICE_API.MOVIES
    );

  const getMovieById = (userId: string, movieId: string) =>
    useFetch<GetMovieResponse>(
      endpoints.movies.byId(userId, movieId),
      { method: "GET" },
      MICROSERVICE_API.MOVIES
    );

  return { listMovies, listMoviesByGenre, getMovieById };
};
