import { useParams } from "react-router-dom";
import { M_GENRE } from "../lib/constants";
import sliderStyles from "../styles/slider.module.scss";
import styles from "../styles/genres-page.module.scss";
import { j } from "../utils";
import Banner from "../components/Banner";
import Slider from "../components/Slider";

const GenresPage = () => {
  const { category, id } = useParams();

  if (category !== "movie" || !id) {
    throw new Response(
      `Invalid category route or id provided: ${category} - ${id}`,
      { status: 404, statusText: "Not Found" }
    );
  }

  const genreName: string =
    Object.keys(M_GENRE).find((name) => (M_GENRE as any)[name] == id) || "";

  return (
    <>
      <Banner genre={`${id}`} />
      <div
        className={j(
          sliderStyles["list-container"],
          styles["genre-list-container"]
        )}>
        <Slider key={genreName} title={genreName} genre={id} flow="column" />
      </div>
    </>
  );
};

export default GenresPage;
