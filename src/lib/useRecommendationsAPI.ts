// src/api/useRecommendationsAPI.ts
import useFetch from "../hooks/useFetch";
import { endpoints } from "./endpoints";
import { GetRecommendationsResponse } from "../types";
import { MICROSERVICE_API } from "./constants";

export const useRecommendationsAPI = () => {
  const getUserRecommendations = (userId: string) => {
    return useFetch<GetRecommendationsResponse>(
      endpoints.recommendations.forUser(userId),
      { method: "GET" },
      MICROSERVICE_API.RECOMMENDATIONS
    );
  };

  return { getUserRecommendations };
};
