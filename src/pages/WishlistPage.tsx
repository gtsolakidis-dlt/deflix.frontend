import { CheckCircle } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import styles from "../styles/list-page.module.scss";
import sliderSyles from "../styles/slider.module.scss";
import { j } from "../utils";
import { useWishlistData } from "../contexts/WishlistProvider";

const WishlistPage = () => {
  const navigate = useNavigate();

  const { wishlist } = useWishlistData();

  return (
    <>
      {!wishlist.length ? (
        <div className={styles["no-list"]}>
          <CheckCircle />
          <p>Add movies to your wishlist so you can easily find them later.</p>
          <button onClick={() => navigate("/browse")}>
            Find something to watch
          </button>
        </div>
      ) : (
        <>
          <main className={j(sliderSyles["slider-container"], styles.main)}>
            <h1>Wishlist</h1>
            <div className={sliderSyles["slider-carousel"]}>
              {/* https://stackoverflow.com/a/59459000 */}
              {wishlist.map((item) => {
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

export default WishlistPage;
