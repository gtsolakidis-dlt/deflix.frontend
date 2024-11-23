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
import { Movie } from "../types";

interface WishlistContextData {
  wishlist: Movie[];
  isInWishlist: (movieId: string) => boolean;
  isLoading: boolean;
}

type WishlistDispatchAction =
  | { type: "ADD"; payload: Movie }
  | { type: "REMOVE"; payload: { movieId: string } }
  | { type: "SET"; payload: Movie[] };

const WishlistData = createContext<WishlistContextData | null>(null);
const WishlistDispatch =
  createContext<React.Dispatch<WishlistDispatchAction> | null>(null);

export const useWishlistData = () => {
  const wishlist = useContext(WishlistData);
  if (!wishlist) {
    throw new Error(
      "useWishlistData must be used within WishlistData Provider"
    );
  }
  return wishlist;
};

export const useWishlistDispatch = () => {
  const dispatch = useContext(WishlistDispatch);
  if (!dispatch) {
    throw new Error(
      "useWishlistDispatch must be used within WishlistDispatch Provider"
    );
  }
  return dispatch;
};

const WishlistProvider = ({ children }: PropsWithChildren) => {
  const reducer = (state: Movie[], action: WishlistDispatchAction): Movie[] => {
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

  const [wishlist, dispatch] = useReducer(reducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { baseUrl } = useBaseUrl();
  const { userId } = useAuth();

  const API_BASE_URL = `${
    baseUrl[MICROSERVICE_API.PREFERENCES] || baseUrl["monolithic"]
  }`;

  const fetchWishlist = useCallback(async (): Promise<Movie[]> => {
    if (!userId) return [];
    const response = await fetch(
      `${API_BASE_URL}${endpoints.userPreferences.watchlists.list(userId)}`
    );
    if (!response.ok) throw new Error("Failed to fetch wishlist");
    return response.json();
  }, [API_BASE_URL, userId]);

  const addToWishlist = useCallback(
    async (movie: Movie): Promise<Movie> => {
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(
        `${API_BASE_URL}${endpoints.userPreferences.watchlists.add(
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
      if (!response.ok) throw new Error("Failed to add movie to wishlist");
      return response.json();
    },
    [API_BASE_URL, userId]
  );

  const removeFromWishlist = useCallback(
    async (movieId: string): Promise<void> => {
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(
        `${API_BASE_URL}${endpoints.userPreferences.watchlists.remove(
          userId,
          movieId
        )}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to remove movie from wishlist");
    },
    [API_BASE_URL, userId]
  );

  const loadWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchWishlist();
      dispatch({ type: "SET", payload: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load wishlist";
      setError(errorMessage);
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWishlist]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = useCallback(
    (movieId: string) => wishlist.some((movie) => movie.movieId === movieId),
    [wishlist]
  );

  const handleDispatch = async (action: WishlistDispatchAction) => {
    try {
      setIsLoading(true);
      setError(null);

      switch (action.type) {
        case "ADD": {
          await addToWishlist(action.payload);
          dispatch(action);
          break;
        }
        case "REMOVE": {
          await removeFromWishlist(action.payload.movieId);
          dispatch(action);
          break;
        }
        default:
          dispatch(action);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update wishlist";
      setError(errorMessage);
      console.error("Error updating wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistData.Provider value={{ wishlist, isInWishlist, isLoading }}>
      <WishlistDispatch.Provider value={handleDispatch}>
        {children}
      </WishlistDispatch.Provider>
    </WishlistData.Provider>
  );
};

export default WishlistProvider;
