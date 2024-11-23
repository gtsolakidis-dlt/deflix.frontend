import { MICROSERVICE_API } from "../lib/constants";

export interface MicroserviceUrls {
  [MICROSERVICE_API.USERS]: string;
  [MICROSERVICE_API.PREFERENCES]: string;
  [MICROSERVICE_API.MOVIES]: string;
  [MICROSERVICE_API.RECOMMENDATIONS]: string;
  [MICROSERVICE_API.SUBSCRIPTIONS]: string;
}
export interface BaseUrls extends MicroserviceUrls {
  monolithic: string;
}

// User Entity
export interface User {
  userId: number;
  username: string;
  email: string;
  subscriptionType?: string;
  paymentMethod: string;
  expirationDate: string;
}

// Movie Entity
export interface Movie {
  movieId: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  logo: string;
  genre: string;
  youtubeKey: string;
  usersRating: number;
  usersComment: string;
  criticsRating: number;
  planType: string;
}

// Subscription Entity
export interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
}

// Recommendation Entity (assuming recommendations are associated with user and movie IDs)
export interface Recommendation {
  userId: number;
  recommendedMovies: Movie[];
}

// API Request Payloads

// SignUp Request
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

// SignIn Request
export interface SignInRequest {
  username: string;
  password: string;
}

// Update Profile Request
export interface UpdateProfileRequest {
  password: string;
}

// API Response Types
// Preferences API Response
export type AddFavoriteResponse = void;
export type RemoveFavoriteResponse = void;
export type GetUserFavoritesResponse = Movie[];
export type AddWatchlistResponse = void;
export type RemoveWatchlistResponse = void;
export type GetWatchlistResponse = Movie[];
export type AddCommentResponse = void;
// Movies API Response
export type ListMoviesResponse = Movie[];
export type GetMovieResponse = Movie;
// Recommendations API Response
export type GetRecommendationsResponse = Movie[];
// Subscriptions API Response
export type ListSubscriptionsResponse = Subscription[];
export type SubscribeUserResponse = void;
export type GetUserSubscriptionsResponse = Subscription[];
// User API Response
export type SignUpResponse = User;
export type SignInResponse = { userId: string };
export type GetProfileResponse = User;
export type UpdateProfileResponse = User;
