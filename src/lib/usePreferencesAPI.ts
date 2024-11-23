// src/api/usePreferencesAPI.ts

import useFetch from "../hooks/useFetch";
import { MICROSERVICE_API } from "./constants";
import { endpoints } from "./endpoints";
import {
  AddFavoriteResponse,
  RemoveFavoriteResponse,
  GetUserFavoritesResponse,
  AddWatchlistResponse,
  RemoveWatchlistResponse,
  GetWatchlistResponse,
  AddCommentResponse,
} from "../types";

export const usePreferencesAPI = () => {
  const addFavorite = (userId: string, movieId: string) =>
    useFetch<AddFavoriteResponse>(
      endpoints.userPreferences.addFavorite(userId, movieId),
      { method: "POST" },
      MICROSERVICE_API.PREFERENCES
    );

  const removeFavorite = (userId: string, movieId: string) =>
    useFetch<RemoveFavoriteResponse>(
      endpoints.userPreferences.removeFavorite(userId, movieId),
      { method: "DELETE" },
      MICROSERVICE_API.PREFERENCES
    );

  const getUserFavorites = (userId: string) =>
    useFetch<GetUserFavoritesResponse>(
      endpoints.userPreferences.getUserFavorites(userId),
      { method: "GET" },
      MICROSERVICE_API.PREFERENCES
    );

  const addWatchlist = (userId: string, movieId: string) =>
    useFetch<AddWatchlistResponse>(
      endpoints.userPreferences.addWatchlist(userId, movieId),
      { method: "POST" },
      MICROSERVICE_API.PREFERENCES
    );

  const removeWatchlist = (userId: string, movieId: string) =>
    useFetch<RemoveWatchlistResponse>(
      endpoints.userPreferences.removeWatchlist(userId, movieId),
      { method: "DELETE" },
      MICROSERVICE_API.PREFERENCES
    );

  const getUserWatchlist = (userId: string) =>
    useFetch<GetWatchlistResponse>(
      endpoints.userPreferences.getUserWatchlist(userId),
      { method: "GET" },
      MICROSERVICE_API.PREFERENCES
    );

  const addComment = (userId: string, movieId: string, comment: string) =>
    useFetch<AddCommentResponse>(
      endpoints.userPreferences.addComment(userId, movieId),
      {
        method: "POST",
        body: { comment },
        headers: { "Content-Type": "application/json" },
      },
      MICROSERVICE_API.PREFERENCES
    );

  return {
    addFavorite,
    removeFavorite,
    getUserFavorites,
    addWatchlist,
    removeWatchlist,
    getUserWatchlist,
    addComment,
  };
};
