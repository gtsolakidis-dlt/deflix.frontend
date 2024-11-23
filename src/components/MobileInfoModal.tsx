import { motion, Variants } from "framer-motion";
import {
  Check,
  DeleteCircle,
  InfoEmpty,
  NavArrowRight,
  Play,
  Plus,
  ShareAndroid,
} from "iconoir-react";
import { Link, useNavigate } from "react-router-dom";
import { useModalDispatcher } from "../contexts/ModalContext";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import { api } from "../lib/api";
import styles from "../styles/mobile-modal.module.scss";
import { shareLink } from "../utils";
import Backdrop from "./Backdrop";
import Portal from "./Portal";
import { useMoviesAPI } from "../lib/useMoviesAPI";
import { data_movie } from "../types/myApi";
import { useAuth } from "../contexts/AuthContext";

type MobileInfoModalProps = {
  id: string;
};

const modalVariants: Variants = {
  initial: { y: 50 },
  animate: { y: 0 },
  exit: { y: "100%", transition: { stiffness: 100 } },
};

const MobileInfoModal = ({ id }: MobileInfoModalProps) => {
  const { isInList } = useMyListData();
  const dispatchToList = useMyListDispatcher();
  const setModalState = useModalDispatcher();
  const navigate = useNavigate();

  const { userId } = useAuth();

  const { getMovieById } = useMoviesAPI();
  const { data: movie, isLoading } = getMovieById(userId, id);
  // const movie = data_movie;

  if (!movie || isLoading) return null;
  const closeModal = () => setModalState({ visible: false });

  const title = movie.title!;

  const handleListClick = () => {
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
    <Portal>
      <Backdrop
        onClick={(e) => {
          if (e.currentTarget === e.target) setModalState({ visible: false });
        }}>
        <motion.div
          className={styles["modal-container"]}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit">
          <div className={styles["modal-info"]}>
            <div className={styles["modal-info__img"]}>
              <img src={api.getPosterURL(movie.poster!)} />
            </div>
            <div className={styles["modal-info__details"]}>
              <h4>{title}</h4>
              <p>
                {movie.description
                  ? movie.description
                  : "No description provided"}
              </p>
            </div>
          </div>
          <div className={styles["modal-menu"]}>
            <ul>
              <li>
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/movie/${movie.movieId!}`);
                  }}>
                  <div className={styles["modal-icon"]}>
                    <Play />
                  </div>
                  <span>Play</span>
                </button>
              </li>
              <li>
                <button onClick={handleListClick}>
                  <div className={styles["modal-icon"]}>
                    {isInList(movie.movieId!, "movie") ? <Check /> : <Plus />}
                  </div>
                  <span>My List</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    shareLink({
                      url: `${window.location.origin}/movie/${id}`,
                    })
                  }>
                  <div className={styles["modal-icon"]}>
                    <ShareAndroid />
                  </div>
                  <span>Share</span>
                </button>
              </li>
            </ul>
          </div>
          <div className={styles["modal-more"]}>
            <Link to={`/movie/${movie.movieId!}`} onClick={closeModal}>
              <InfoEmpty />
              <p>Details & More</p>
              <NavArrowRight />
            </Link>
          </div>
          <button className={styles["modal-close-btn"]} onClick={closeModal}>
            <DeleteCircle />
          </button>
        </motion.div>
      </Backdrop>
    </Portal>
  );
};

export default MobileInfoModal;
