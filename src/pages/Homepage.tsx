import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { M_GENRE } from "../lib/constants";
import styles from "../styles/slider.module.scss";
import type { SliderQueries } from "../types/app";

const queries: SliderQueries[] = [
  {
    title: "Recommendations For You",
    genre: M_GENRE.RECOMMENDATIONS,
  },
  {
    title: "Comedy",
    genre: M_GENRE.Comedy,
  },
  {
    title: "Adventure",
    genre: M_GENRE.Adventure,
  },
  {
    title: "Available Movies",
  },
  {
    title: "Horror Movies",
    genre: M_GENRE.Thriller,
  },
  {
    title: "Family Movies",
    genre: M_GENRE.Family,
  },
];

const Homepage = () => {
  return (
    <>
      <Banner />
      <div className={styles["list-container"]}>
        {queries.map((query) => (
          <Slider key={query.title} title={query.title} genre={query.genre} />
        ))}
      </div>
    </>
  );
};

export default Homepage;
