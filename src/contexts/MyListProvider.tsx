import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";

import { useBaseUrl } from "./BaseUrlContext";
import { MICROSERVICE_API } from "../lib/constants";
import { endpoints } from "../lib/endpoints";
import { useAuth } from "./AuthContext";
import type { MyList, MediaType } from "../types/app";
import { Movie } from "../types";

interface MyListContextData {
  myList: Movie[];
  isInList: (movieId: string) => boolean;
  isLoading: boolean;
}

type ListDispatchAction =
  | { type: "ADD"; payload: Movie }
  | { type: "REMOVE"; payload: { movieId: string } }
  | { type: "SET"; payload: Movie[] };

const MyListData = createContext<MyListContextData | null>(null);
const MyListDispatch = createContext<React.Dispatch<ListDispatchAction> | null>(
  null
);

export const useMyListData = () => {
  const myList = useContext(MyListData);
  if (!myList) {
    throw new Error("useMyListData must be used within MyListData Provider");
  }
  return myList;
};

export const useMyListDispatcher = () => {
  const dispatch = useContext(MyListDispatch);
  if (!dispatch) {
    throw new Error(
      "useMyListDispatcher must be used within MyListDispatch Provider"
    );
  }
  return dispatch;
};

const MyListProvider = ({ children }: PropsWithChildren) => {
  const reducer = (state: Movie[], action: ListDispatchAction): Movie[] => {
    switch (action.type) {
      case "ADD": {
        return [...state, action.payload];
      }
      case "REMOVE": {
        return state.filter(
          (movie) => movie.movieId !== action.payload.movieId
        );
      }
      case "SET": {
        return action.payload;
      }
      default:
        console.error("Unhandled action type");
        return state;
    }
  };

  const [myList, dispatch] = useReducer(reducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { baseUrl } = useBaseUrl();
  const { userId } = useAuth();

  const API_BASE_URL = `${
    baseUrl[MICROSERVICE_API.PREFERENCES] || baseUrl["monolithic"]
  }`;

  const fetchMyList = useCallback(async (): Promise<Movie[]> => {
    if (!userId) return [];
    const response = await fetch(
      `${API_BASE_URL}${endpoints.userPreferences.favorites.list(userId)}`
    );
    if (!response.ok) throw new Error("Failed to fetch favorites list");
    return response.json();
  }, [API_BASE_URL, userId]);

  const addToMyList = useCallback(
    async (movie: Movie): Promise<Movie> => {
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(
        `${API_BASE_URL}${endpoints.userPreferences.favorites.add(
          userId,
          movie.movieId
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movie),
        }
      );
      if (!response.ok) throw new Error("Failed to add item to favorites");
      return response.json();
    },
    [API_BASE_URL, userId]
  );

  const removeFromMyList = useCallback(
    async (movieId: string): Promise<void> => {
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(
        `${API_BASE_URL}${endpoints.userPreferences.favorites.remove(
          userId,
          movieId
        )}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to remove item from favorites");
    },
    [API_BASE_URL, userId]
  );

  const loadMyList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMyList();
      dispatch({ type: "SET", payload: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load favorites";
      setError(errorMessage);
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMyList]);

  useEffect(() => {
    loadMyList();
  }, [loadMyList]);

  const isInList = useCallback(
    (movieId: string) => myList.some((movie) => movie.movieId === movieId),
    [myList]
  );

  const handleDispatch = async (action: ListDispatchAction) => {
    try {
      setIsLoading(true);
      setError(null);

      switch (action.type) {
        case "ADD": {
          await addToMyList(action.payload);
          dispatch(action);
          break;
        }
        case "REMOVE": {
          await removeFromMyList(action.payload.movieId);
          dispatch(action);
          break;
        }
        default:
          dispatch(action);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update favorites";
      setError(errorMessage);
      console.error("Error updating favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MyListData.Provider value={{ myList, isInList, isLoading }}>
      <MyListDispatch.Provider value={handleDispatch}>
        {children}
      </MyListDispatch.Provider>
    </MyListData.Provider>
  );
};

export default MyListProvider;
