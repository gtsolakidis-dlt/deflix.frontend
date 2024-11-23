import useFetch from "../hooks/useFetch";
import { endpoints } from "./endpoints";
import {
  ListSubscriptionsResponse,
  SubscribeUserResponse,
  GetUserSubscriptionsResponse,
} from "../types";
import { MICROSERVICE_API } from "./constants";

export const useSubscriptionsAPI = () => {
  const subscribe = (userId: string, subscriptionCode: number) => {
    return useFetch<ListSubscriptionsResponse>(
      endpoints.subscriptions.subscribe(userId, subscriptionCode),
      {
        method: "PUT",
      },
      MICROSERVICE_API.SUBSCRIPTIONS
    );
  };

  const userSubscriptions = (userId: string) => {
    return useFetch<SubscribeUserResponse>(
      endpoints.subscriptions.userSubscriptions(userId),
      {
        method: "GET",
      },
      MICROSERVICE_API.SUBSCRIPTIONS
    );
  };

  const list = () => {
    return useFetch<GetUserSubscriptionsResponse>(
      endpoints.subscriptions.list(),
      {
        method: "GET",
      },
      MICROSERVICE_API.SUBSCRIPTIONS
    );
  };

  return { subscribe, userSubscriptions, list };
};
