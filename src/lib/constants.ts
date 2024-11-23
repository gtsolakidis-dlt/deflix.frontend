/* Genre list entries */
const splitJoin = (str: string) => {
  // doing lowercase since we'll properly capitalize them using css
  return str.split("_").join(" ").toLowerCase();
};

export const PRODUCT_PLANS = [
  {
    id: "Free",
    name: "Free",
    description: "For small teams",
    users: "4 users",
    price: 10,
    selected: true,
  },
  {
    id: "Basic",
    name: "Basic",
    description: "For medium sized teams",
    users: "20 users",
    price: 25,
    selected: false,
  },
  {
    id: "Premium",
    name: "Premium",
    description: "For large teams",
    users: "100+ users",
    price: 50,
    selected: false,
  },
];

export enum MICROSERVICE_API {
  MOVIES = "movies",
  USERS = "users",
  SUBSCRIPTIONS = "subscriptions",
  RECOMMENDATIONS = "recommendations",
  PREFERENCES = "preferences",
}

export enum M_GENRE {
  Adventure = "57a6dd52-04fc-4d23-b7b0-ee3a54b7c346",
  Fantasy = "2b6ddfcc-6e12-42a8-b8df-9c5286f6f17e",
  Animation = "f06287a4-e145-4421-a216-90ae15d52d77",
  Drama = "64d4af6a-bf26-4615-8d88-cb19ae5798b2",
  Horror = "05a25418-6489-4296-aaec-fd63902f3e3b",
  Action = "516c66ec-c08a-4c39-a370-c4b6b3bd7ec7",
  Comedy = "dd3fee93-7ba9-44a2-bd7c-34042beee050",
  History = "1c0f359f-1a92-4cb6-a661-03ce966371f7",
  Western = "c9a4f4f7-a510-4f5b-9257-72acadff678a",
  Thriller = "99fbbe16-1e14-4c6d-8902-8a61456a7b3e",
  Crime = "5d0dd214-a9e7-4a76-bb61-4f2109da1ed0",
  Documentary = "81984c23-a9b0-4bf9-b4e3-fbe3af5df3b1",
  ScienceFiction = "5e1c4593-0302-4841-b3a9-fd4033329d6d",
  Mystery = "a5a0563a-7951-4c81-8e15-59f9d5222662",
  Music = "aac28b48-463d-405c-a4c2-f0fa7eb7a1c2",
  Romance = "8dc958a8-73bd-41f4-8fe5-78caa881069e",
  Family = "7435e2b1-69d8-401c-80eb-dfd573c3dd7f",
  War = "f4e2d157-f797-4332-b551-b19b28573560",
  TvMovie = "1028bf0e-8617-4a93-b606-d56f1b49e941",
  RECOMMENDATIONS = "recommendations",
}

export const movieGenreList = {
  title: "MOVIES",
  list: Object.entries(M_GENRE).map((genre) => {
    return {
      text: splitJoin(genre[0]),
      link: `/genres/movie/${genre[1]}`,
    };
  }),
};
