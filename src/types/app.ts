export type MediaType = "movie";

export type MyList = {
  id: string;
  poster_path: string;
  media_type: MediaType;
};

export type SliderQueries = {
  title?: string;
  genre?: string;
};
