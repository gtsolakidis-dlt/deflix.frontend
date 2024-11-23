import useFetch from "../hooks/useFetch";
import { endpoints } from "./endpoints";
import {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../types";
import { MICROSERVICE_API } from "./constants";

export const useUsersAPI = () => {
  const signUp = (signUpData: SignUpRequest) => {
    if (signUpData.username && signUpData.password && signUpData.email) {
      return useFetch<SignUpResponse>(
        endpoints.users.signUp(),
        {
          method: "POST",
          body: signUpData,
          headers: { "Content-Type": "application/json" },
        },
        MICROSERVICE_API.USERS
      );
    }
    return { data: null, error: null, isLoading: false };
  };

  const signIn = (signInData: SignInRequest) => {
    return useFetch<SignInResponse>(
      endpoints.users.signIn(),
      {
        method: "POST",
        body: signInData,
        headers: { "Content-Type": "application/json" },
      },
      MICROSERVICE_API.USERS
    );
  };

  const getProfile = (userId: string) => {
    return useFetch<GetProfileResponse>(
      endpoints.users.profile(userId),
      {
        method: "GET",
      },
      MICROSERVICE_API.USERS
    );
  };

  const updateProfile = (userId: string, updateData: UpdateProfileRequest) => {
    return useFetch<UpdateProfileResponse>(
      endpoints.users.updateProfile(userId),
      {
        method: "POST",
        body: updateData,
        headers: { "Content-Type": "application/json" },
      },
      MICROSERVICE_API.USERS
    );
  };

  return { signUp, signIn, getProfile, updateProfile };
};
