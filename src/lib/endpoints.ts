export const endpoints = {
  movies: {
    list: (userId: string) => `api/Movies/user/${userId}/list`,
    byGenre: (userId: string, genreId: string) =>
      `api/Movies/user/${userId}/list/genre/${genreId}`,
    byId: (userId: string, movieId: string) =>
      `api/Movies/user/${userId}/movie/${movieId}`,
  },
  recommendations: {
    forUser: (userId: string) => `api/Recommendations/user/${userId}`,
  },
  subscriptions: {
    list: () => `api/Subscriptions/list`,
    userSubscriptions: (userId: string) => `api/Subscriptions/user/${userId}`,
    subscribe: (userId: string, subscriptionCode: number) =>
      `api/Subscriptions/user/${userId}/subscribe/${subscriptionCode}`,
  },
  userPreferences: {
    favorites: {
      add: (userId: string, movieId: string) =>
        `api/UserPreferences/favorites/user/${userId}/add/${movieId}`,
      remove: (userId: string, movieId: string) =>
        `api/UserPreferences/favorites/user/${userId}/remove/${movieId}`,
      list: (userId: string) => `api/UserPreferences/favorites/user/${userId}`,
    },
    watchlists: {
      add: (userId: string, movieId: string) =>
        `api/UserPreferences/watchlists/user/${userId}/add/${movieId}`,
      remove: (userId: string, movieId: string) =>
        `api/UserPreferences/watchlists/user/${userId}/remove/${movieId}`,
      list: (userId: string) => `api/UserPreferences/watchlists/user/${userId}`,
    },
    comments: {
      add: (userId: string, movieId: string) =>
        `api/UserPreferences/comment/user/${userId}/add/${movieId}`,
    },
  },
  users: {
    signUp: () => `api/Users/signup`,
    signIn: () => `api/Users/signin`,
    profile: (userId: string) => `api/Users/profile/${userId}`,
    updateProfile: (userId: string) => `api/Users/profile/${userId}`,
  },
};
