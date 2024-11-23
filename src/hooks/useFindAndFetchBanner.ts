import { useState, useEffect } from "react";
import { endpoints } from "../lib/endpoints";
import { GetMovieResponse, ListMoviesResponse } from "../types";
import { useBaseUrl } from "../contexts/BaseUrlContext";

interface SequentialFetchState {
  firstData: ListMoviesResponse | null;
  secondData: GetMovieResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useFindAndFetchBanner = (userId: string, genre: string) => {
  const [state, setState] = useState<SequentialFetchState>({
    firstData: null,
    secondData: null,
    isLoading: false,
    error: null,
  });

  const { baseUrl } = useBaseUrl();
  const serviceBaseUrl = baseUrl["movies"] || baseUrl["monolithic"];

  const fetchFirstData = async (): Promise<ListMoviesResponse | null> => {
    try {
      const response = await fetch(
        `${serviceBaseUrl}${
          genre
            ? endpoints.movies.byGenre(userId, genre)
            : endpoints.movies.list(userId)
        }`
      );
      if (!response.ok) {
        throw new Error("First API list call failed");
      }
      const data: ListMoviesResponse = await response.json();
      setState((prev) => ({ ...prev, firstData: data }));
      return data;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred",
      }));
      return null;
    }
  };

  const fetchSecondData = async (
    firstApiData: ListMoviesResponse
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${serviceBaseUrl}${endpoints.movies.byId(
          userId,
          firstApiData[Math.floor(Math.random() * firstApiData.length)].movieId
        )}`
      );
      if (!response.ok) {
        throw new Error("Second API movie call failed");
      }
      const data: GetMovieResponse = await response.json();
      setState((prev) => ({ ...prev, secondData: data }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred",
      }));
    }
  };

  const fetchSequentialData = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const firstApiResult = await fetchFirstData();

    if (firstApiResult) {
      await fetchSecondData(firstApiResult);
    }

    setState((prev) => ({ ...prev, isLoading: false }));
  };

  useEffect(() => {
    fetchSequentialData();
  }, []);

  return state;
};
