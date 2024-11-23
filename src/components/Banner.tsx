import { InfoEmpty, Pause, Play, SoundHigh, SoundOff } from "iconoir-react";
import { FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModalDispatcher } from "../contexts/ModalContext";
import useMediaQuery from "../hooks/useMediaQuery";
import { api } from "../lib/api";
import styles from "../styles/banner.module.scss";
import { j } from "../utils";
import YouTubeIFrame from "./YouTubeIFrame";
import { useMoviesAPI } from "../lib/useMoviesAPI";
import { data_movie } from "../types/myApi";
import { useFindAndFetchBanner } from "../hooks/useFindAndFetchBanner";
import { useAuth } from "../contexts/AuthContext";

const BannerShimmer = () => {
  return (
    <div className={j(styles["banner-shimmer"])}>
      <div className="shimmer"></div>
      <div className="shimmer"></div>
    </div>
  );
};

type BannerProps = {
  genre?: string;
};

const Banner: FC<BannerProps> = ({ genre = "" }) => {
  const setModalState = useModalDispatcher();
  const navigate = useNavigate();
  const tabletUp = useMediaQuery("tablet-up");
  const desktopUp = useMediaQuery("desktop-up");

  const { userId } = useAuth();

  // const { getMovieById, listMovies, listMoviesByGenre } = useMoviesAPI();
  // const { data: movie, error, isLoading } = getMovieById("0"); // static id
  const {
    firstData,
    secondData: movie,
    isLoading,
    error,
  } = useFindAndFetchBanner(userId, genre); // from many movies get the first one
  // const movie = data_movie;

  // storing the videoKey makes sure we don't load a new video on every state
  // change via mute/play toggle
  const videoKey = useRef("");
  const [{ playing, muted, showPlayer }, setPlayerState] = useState({
    playing: false,
    muted: true,
    showPlayer: tabletUp,
  });

  if (error) {
    console.error(error);
    return null;
  }

  if (!movie || isLoading) return <BannerShimmer />;

  const logoSize = desktopUp ? "w500" : tabletUp ? "w300" : "w185";
  // const backdropSize: BackdropSizes = tabletUp ? "w1280" : "w780";
  videoKey.current = movie.youtubeKey!;

  const handlePlayerReady = () => {
    // start player after a slight delay only if the player is visible
    // and we aren't already playing it
    setTimeout(() => {
      if (!playing) {
        setPlayerState((p) => ({ ...p, playing: p.showPlayer }));
      }
    }, 6000);
  };

  const handlePlayerError = () => {
    // revert back to showing banner if failed to play the video
    console.error("error playing video");
    setPlayerState((p) => ({
      ...p,
      playing: false,
      showPlayer: false,
    }));
  };

  const handlePlayButtonClick = () => {
    if (showPlayer) {
      setPlayerState((p) => ({ ...p, playing: !p.playing }));
    } else if (!tabletUp) {
      navigate(`/movie/${movie.movieId}`);
    }
  };

  const handleInfoClick = () => {
    setPlayerState((p) => ({ ...p, playing: false }));
    setModalState({
      visible: true,
      id: movie.movieId!,
      category: "movie",
      expanded: true,
    });
  };

  return (
    <div className={styles["banner-container"]}>
      {videoKey.current && showPlayer && (
        <div
          className={styles["player"]}
          style={{ opacity: playing ? "1" : "0" }}>
          <YouTubeIFrame
            videoKey={videoKey.current}
            playing={playing}
            loop={true}
            muted={muted}
            onReady={handlePlayerReady}
            onError={handlePlayerError}
          />
          <div
            className={styles["player-control"]}
            onClick={() => setPlayerState((p) => ({ ...p, muted: !p.muted }))}>
            {muted ? <SoundOff /> : <SoundHigh />}
          </div>
        </div>
      )}
      <div
        className={j(styles["banner-img"])}
        style={{ zIndex: playing ? "-1" : "0" }}>
        <img
          src={api.getBackdropURL(movie.backdrop, "original")}
          alt={movie.title}
          onLoad={(e) => (e.currentTarget.style.opacity = "1")}
        />
      </div>
      <div className={styles["banner-info"]}>
        {movie.logo ? (
          <img
            className={styles["banner-info__logo"]}
            src={api.getLogoURL(movie.logo, logoSize)}
            alt=""
            onLoad={(e) => (e.currentTarget.style.opacity = "1")}
          />
        ) : (
          <h1>{movie.title}</h1>
        )}
        {tabletUp ? <p>{movie.description}</p> : <p></p>}
        <ul className={styles["banner-menu"]}>
          <li>
            <button
              className={styles["play-btn"]}
              onClick={handlePlayButtonClick}>
              {playing ? <Pause /> : <Play />}
              <span>{playing ? "Pause" : "Play"}</span>
            </button>
          </li>
          <li>
            <button onClick={handleInfoClick}>
              <InfoEmpty />
              <span>{tabletUp ? "More Info" : "Info"}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Banner;
