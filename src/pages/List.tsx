import { CheckCircle } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useMyListData } from "../contexts/MyListProvider";
import styles from "../styles/list-page.module.scss";
import sliderSyles from "../styles/slider.module.scss";
import { j } from "../utils";

const List = () => {
  const navigate = useNavigate();

  const { myList } = useMyListData();

  return (
    <>
      {!myList.length ? (
        <div className={styles["no-list"]}>
          <CheckCircle />
          <p>Add movies to your list so you can easily find them later.</p>
          <button onClick={() => navigate("/browse")}>
            Find something to watch
          </button>
        </div>
      ) : (
        <>
          <main className={j(sliderSyles["slider-container"], styles.main)}>
            <h1>My List</h1>
            <div className={sliderSyles["slider-carousel"]}>
              {/* https://stackoverflow.com/a/59459000 */}
              {myList.map((item) => {
                return (
                  <Card
                    key={item.movieId}
                    cardId={item.movieId}
                    mediaType="movie"
                    posterImg={item.poster}
                  />
                );
              })}
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default List;
