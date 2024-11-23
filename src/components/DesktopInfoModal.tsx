import {
  NavArrowDown,
  Pause,
  Play,
  SoundHigh,
  SoundOff,
  Check,
  Plus,
  Heart,
} from "iconoir-react";
import { useState } from "react";
import { useModalDispatcher } from "../contexts/ModalContext";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import { api } from "../lib/api";
import styles from "../styles/desktop-info-modal.module.scss";
import Backdrop from "./Backdrop";
import YouTubeIFrame from "./YouTubeIFrame";
import { useMoviesAPI } from "../lib/useMoviesAPI";
import { data_movie } from "../types/myApi";
import {
  useWishlistData,
  useWishlistDispatch,
} from "../contexts/WishlistProvider";
import { useAuth } from "../contexts/AuthContext";
import MovieCommentForm from "./MovieCommentForm";

type DesktopInfoModalProps = {
  id: string;
  x: number;
  y: number;
  expanded?: boolean;
};

const DesktopInfoModal = ({
  id,
  x,
  y,
  expanded = false,
}: DesktopInfoModalProps) => {
  const setModalState = useModalDispatcher();
  const [isExpanded, setIsExpanded] = useState(expanded);

  const { isInWishlist, isLoading: isWishlistLoading } = useWishlistData();
  const dispatch = useWishlistDispatch();

  const { isInList, isLoading: ismylistLoading } = useMyListData();
  const dispatchList = useMyListDispatcher();

  const { userId } = useAuth();

  const handleToggleWishlist = (movieId: string) => {
    if (isInWishlist(movieId)) {
      dispatch({ type: "REMOVE", payload: { movieId: movieId } });
    } else {
      dispatch({ type: "ADD", payload: movie });
    }
  };
  const addToList = (movieId: string) => {
    if (isInList(movieId)) {
      dispatchList({ type: "REMOVE", payload: { movieId: movieId } });
    } else {
      dispatchList({ type: "ADD", payload: movie });
    }
  };

  const { getMovieById } = useMoviesAPI();
  const { data: movie, isLoading } = getMovieById(userId, id);

  // console.log(movie);

  // const movie = data_movie;

  const [{ playing, muted }, setPlayerState] = useState({
    playing: true,
    muted: true,
  });

  if (!movie || isLoading) return null;

  const title = movie.title!;
  const logoPath = movie.logo!;

  const details = (
    <div
      className={
        isExpanded
          ? styles["big-modal-info-details__left"]
          : styles["mini-modal-info-details"]
      }>
      <h2>{title}</h2>
      <span className={styles["span-match"]}>
        Critics:{" "}
        <span className={styles["span-critics"]}>{movie.criticsRating}</span>
      </span>
      <span className={styles["span-match"]}>
        Users:{" "}
        <span className={styles["span-critics"]}>{movie.usersRating}</span>
      </span>
      {isExpanded && movie.description && <p>{movie.description}</p>}
      {isExpanded && movie.usersComment && (
        <span className={styles["span-match"]}>
          Comment:{" "}
          <span className={styles["span-critics"]}>{movie.usersComment}</span>
        </span>
      )}
    </div>
  );

  const buttons = (
    <div
      className={
        isExpanded ? styles["big-player-menu"] : styles["mini-player-menu"]
      }>
      <button
        className={styles["play-btn"]}
        onClick={() => {
          if (movie.youtubeKey) {
            setPlayerState((p) => ({ ...p, playing: !playing }));
          }
        }}>
        {movie.youtubeKey && playing ? <Pause /> : <Play />}
        {isExpanded && <span>{playing ? "Pause" : "Play"}</span>}
      </button>
      <button
        onClick={() => addToList(movie.movieId)}
        className={styles["list-btn"]}>
        {isInList(movie.movieId!) ? <Check /> : <Plus />}
      </button>
      <button
        onClick={() => handleToggleWishlist(movie.movieId)}
        className={styles["wishlist-btn"]}>
        {isInWishlist(movie.movieId!) ? (
          <Heart
            style={{
              stroke: "none",
              fill: "#86bc25",
            }}
          />
        ) : (
          <Heart />
        )}
      </button>
      {!isExpanded && (
        <button onClick={() => setIsExpanded(true)}>
          <NavArrowDown />
        </button>
      )}
    </div>
  );

  return (
    <Backdrop
      layout
      initial={{ opacity: 0.5, scale: 0.7, backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        opacity: 1,
        scale: 1,
        ...(isExpanded
          ? { backgroundColor: "rgba(0,0,0,0.7)", transition: { delay: 0.3 } }
          : {}),
      }}
      exit={{ opacity: 0 }}
      style={!isExpanded ? { top: y, left: x } : {}}
      preventScroll={isExpanded}
      onClick={(e) => {
        if (e.currentTarget === e.target && isExpanded) {
          setModalState({ visible: false });
        }
      }}
      onPointerLeave={() => {
        if (!isExpanded) {
          setModalState({ visible: false });
        }
      }}
      className={
        !isExpanded ? styles["mini-motion-modal"] : styles["big-motion-modal"]
      }>
      <div
        className={
          isExpanded
            ? styles["big-modal-container"]
            : styles["mini-modal-container"]
        }>
        {isExpanded && (
          <button
            className={styles["close-btn"]}
            onClick={() => setModalState({ visible: false })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
              />
            </svg>
          </button>
        )}
        {movie.youtubeKey ? (
          <div className={styles["player"]}>
            <YouTubeIFrame
              videoKey={movie.youtubeKey!}
              playing={playing}
              controls={false}
              muted={muted}
              loop={true}
            />
            {isExpanded && logoPath && (
              <div className={styles.logo}>
                <img src={api.getLogoURL(logoPath)} alt="" />
              </div>
            )}
            <div className={styles["player-controls"]}>
              {isExpanded && buttons}
              <button
                className={styles["mute-btn"]}
                onClick={() =>
                  setPlayerState((p) => ({ ...p, muted: !muted }))
                }>
                {muted ? <SoundOff /> : <SoundHigh />}
              </button>
            </div>
          </div>
        ) : (
          <img src={api.getBackdropURL(movie.backdrop)} alt="" />
        )}
        {!isExpanded ? (
          <div className={styles["mini-modal-info-container"]}>
            {buttons}
            {details}
          </div>
        ) : (
          <div className={styles["big-modal-info-container"]}>
            <div className={styles["big-modal-info-details"]}>{details}</div>
            <MovieCommentForm userId={userId} movieId={movie.movieId} />
          </div>
        )}
      </div>
    </Backdrop>
  );
};

export default DesktopInfoModal;
