import { useEffect, useReducer } from "react";
import { useBaseUrl } from "../contexts/BaseUrlContext";
import { BaseUrls } from "../types";

type FetchReturn<Data, Error> = {
  data: Data;
  error: Error;
  isLoading: boolean;
};

type ReducerState = { data: any; error: any; isLoading: boolean };
type ReducerDispatchAction = {
  type: "FETCH_INIT" | "FETCH_SUCCESS" | "FETCH_ERROR";
  payload?: any;
};

const reducer = (state: ReducerState, action: ReducerDispatchAction) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, error: null, isLoading: true };
    case "FETCH_SUCCESS":
      return { error: null, isLoading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

type FetchOptions = {
  method?: "GET" | "POST" | "DELETE" | "PUT";
  body?: any;
  headers?: HeadersInit;
};

// Adding `service` parameter to specify the API base for a microservice
const useFetch = <Data = any, Error = any>(
  endpoint: string,
  options: FetchOptions = { method: "GET" },
  service: keyof BaseUrls = "monolithic"
): FetchReturn<Data, Error> => {
  const { baseUrl } = useBaseUrl();
  const serviceBaseUrl = baseUrl[service] || baseUrl["monolithic"];

  const fetcher = async (options: RequestInit) => {
    const response = await fetch(`${serviceBaseUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  };

  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!serviceBaseUrl) {
      console.log(
        `Set API base URL for ${service} from the configuration panel`
      );
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const res = await fetcher({
          method: options.method || "GET",
          headers: options.headers,
          body:
            options.method !== "GET" && options.body
              ? JSON.stringify(options.body)
              : null,
          signal: controller.signal,
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error });
      }
    };

    fetchData();

    return () => controller.abort();
  }, [serviceBaseUrl, endpoint, options.method, options.body, options.headers]);

  return state;
};

export default useFetch;
