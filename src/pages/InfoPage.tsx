import { Pause, Play, ShareAndroid, Check, Plus } from "iconoir-react";
import { useRef, useState } from "react";
import type ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import YouTubeIFrame from "../components/YouTubeIFrame";
import { api } from "../lib/api";
import styles from "../styles/infopage.module.scss";
import { shareLink } from "../utils";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import { useMoviesAPI } from "../lib/useMoviesAPI";
import { data_movie } from "../types/myApi";
import { useAuth } from "../contexts/AuthContext";
import MovieCommentForm from "../components/MovieCommentForm";

const InfoPage = () => {
  const { category, id } = useParams();
  const { isInList } = useMyListData();
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const dispatchToList = useMyListDispatcher();

  const { userId } = useAuth();

  if (category !== "movie" || !id) {
    throw new Response(
      `Invalid category route or id provided: ${category} - ${id}`,
      { status: 404, statusText: "Not Found" }
    );
  }

  const { getMovieById } = useMoviesAPI();
  const { data: movie, error, isLoading } = getMovieById(userId, id);

  // const movie = data_movie;

  if (error) console.error(error);
  if (isLoading) return <Spinner />;
  if (!movie) return null;

  const title = movie.title ? movie.title : "No title provided";

  const handleListAdd = () => {
    dispatchToList({
      type: "add",
      payload: {
        id: movie.movieId!,
        media_type: "movie",
        poster_path: movie.poster,
      },
    });
  };

  return (
    <main className={styles.main}>
      <div
        style={{
          backgroundImage: `url(${api.getBackdropURL(movie.backdrop)})`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat-x",
          backgroundSize: "cover",
        }}>
        {movie.youtubeKey && (
          <YouTubeIFrame
            ref={playerRef}
            videoKey={movie.youtubeKey!}
            playing={playing}
            controls={true}
            autoplay={false}
            onError={() => {
              console.log("error playing video");
            }}
            onPlay={() => {
              const currentPlayer = playerRef.current!.getInternalPlayer();
              const iframe = currentPlayer.getIframe();

              // Request full screen since we are essentially 'hiding' the controls
              // on portrait mode
              (iframe as HTMLIFrameElement).requestFullscreen().then(() => {
                // screen can only be locked once full screen
                // TODO: check iOS support
                window.screen.orientation.lock("landscape");
              });
            }}
          />
        )}
      </div>
      <section className={styles["info-section"]}>
        <div className={styles["info-section__title"]}>
          <h2>{title}</h2>
          <span className={styles["span-match"]}>
            <span className={styles["span-critics"]}>Critics Rating: </span>
            {movie.criticsRating}
          </span>
          <span className={styles["span-match"]}>
            <span className={styles["span-critics"]}>Users Rating: </span>
            {movie.usersRating}
          </span>
        </div>
        {movie.youtubeKey && (
          <button
            className={styles["info-section__play-btn"]}
            onClick={() => setPlaying(!playing)}>
            {playing ? <Pause /> : <Play />}
            <span>{playing ? "Pause" : "Play"}</span>
          </button>
        )}
        <p>{movie.description}</p>
        <div>
          {movie.usersComment && (
            <span className={styles["span-match"]}>
              Comment:{" "}
              <span className={styles["span-critics"]}>
                {movie.usersComment}
              </span>
            </span>
          )}
        </div>

        <div className={styles["info-section__actions"]}>
          <button onClick={handleListAdd}>
            {isInList(movie.movieId!, "movie") ? <Check /> : <Plus />}
            <span>My List</span>
          </button>
          <button
            onClick={() =>
              shareLink({
                url: window.location.href,
              })
            }>
            <ShareAndroid />
            <span>Share</span>
          </button>
        </div>

        <div className={styles["info-section__actions"]}>
          <MovieCommentForm userId={userId} movieId={movie.movieId} />
        </div>
      </section>
    </main>
  );
};

export default InfoPage;
