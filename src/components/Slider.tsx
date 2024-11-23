import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { useRef, useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import styles from "../styles/slider.module.scss";
import type { SliderQueries } from "../types/app";
import { j } from "../utils";
import Card from "./Card";
import { useMoviesAPI } from "../lib/useMoviesAPI";
import { data_movie_list } from "../types/myApi";
import { useAuth } from "../contexts/AuthContext";
import { M_GENRE } from "../lib/constants";
import { useRecommendationsAPI } from "../lib/useRecommendationsAPI";

type SliderProps = {
  flow?: "row" | "column";
} & SliderQueries;

const Slider = ({ title, genre, flow }: SliderProps) => {
  const tabletUp = useMediaQuery("tablet-up");
  const carouselRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();

  const { getUserRecommendations } = useRecommendationsAPI();
  const { listMovies, listMoviesByGenre } = useMoviesAPI();
  const {
    data: movies,
    error,
    isLoading,
  } = genre
    ? genre == M_GENRE.RECOMMENDATIONS
      ? getUserRecommendations(userId)
      : listMoviesByGenre(userId, genre)
    : listMovies(userId);
  // const movies = data_movie_list;

  // whether slider carousel buttons should be enabled or not
  const [carouselBtnState, setCarouselBtnState] = useState({
    left: false,
    right: true,
  });

  if (error) {
    console.error(error);
    return null;
  }

  // Result might be empty due to invalid endpoint or params being passed
  if (!movies) return null;

  const handleCarouselScroll = () => {
    const ref = carouselRef.current;
    if (!ref) return;

    const carouselAtStart = ref.scrollLeft === 0;
    const carouselAtEnd =
      ref.scrollWidth - ref.clientWidth === Math.floor(ref.scrollLeft);
    const carouselAtMiddle = !carouselAtStart && !carouselAtEnd;

    // if the carousel is at start and the left button isn't already disabled
    if (carouselAtStart && carouselBtnState.left) {
      setCarouselBtnState({ left: false, right: true });
    }
    // if the carousel is at middle enable both buttons
    else if (
      carouselAtMiddle &&
      (!carouselBtnState.left || !carouselBtnState.right)
    ) {
      setCarouselBtnState({ left: true, right: true });
    }
    // if the carousel is at end and the right button isn't already disabled
    else if (carouselAtEnd && carouselBtnState.right) {
      setCarouselBtnState({ left: true, right: false });
    }
  };

  const handleCarouselButtonClick = (direction: "left" | "right") => {
    const ref = carouselRef.current;
    if (!ref) return;

    if (ref && direction === "left") {
      ref.scrollTo({
        left: ref.scrollLeft - ref.clientWidth + 50,
        behavior: "smooth",
      });
    } else if (ref && direction === "right") {
      ref.scrollTo({
        left: ref.scrollLeft + ref.clientWidth - 50,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles["slider-container"]}>
      {title && <h2>{title}</h2>}
      <div className={styles["slider-carousel-wrapper"]}>
        {tabletUp && flow !== "column" && (
          <button
            className={j(styles["slider-nav-btn"], styles.left)}
            disabled={!carouselBtnState.left}
            onClick={() => handleCarouselButtonClick("left")}>
            <NavArrowLeft />
          </button>
        )}
        <div
          ref={carouselRef}
          className={j(
            styles["slider-carousel"],
            flow === "column" ? styles["slider-carousel__column"] : ""
          )}
          onScroll={handleCarouselScroll}>
          {movies &&
            movies.map((item) => {
              const imgSrc = item.poster || "";
              const altText = item.title || "";

              return (
                <Card
                  key={item.movieId!}
                  cardId={item.movieId!}
                  mediaType={"movie"}
                  posterImg={imgSrc}
                  alt={altText}
                />
              );
            })}
        </div>
        {tabletUp && flow !== "column" && (
          <button
            className={j(styles["slider-nav-btn"], styles.right)}
            disabled={!carouselBtnState.right}
            onClick={() => handleCarouselButtonClick("right")}>
            <NavArrowRight />
          </button>
        )}
      </div>
    </section>
  );
};

export default Slider;
