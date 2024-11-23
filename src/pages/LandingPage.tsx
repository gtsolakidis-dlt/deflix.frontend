import Section from "../components/Section";
import { j } from "../utils";
import styles from "../styles/landing-page.module.scss";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className={j(styles["image-wrapper"], styles["image-section"])}>
        <Section className={j(styles["intro-section"], styles["gap"])}>
          <h1>Unlimited movies, TV shows and more.</h1>
          <p>Watch anywhere. Cancel anytime.</p>
          <p>Ready to watch?</p>
          {!isLoggedIn ? (
            <button
              className={styles["btn-land"]}
              onClick={() => {
                navigate("/login");
              }}>
              Sign in
            </button>
          ) : (
            <button
              className={styles["btn-land"]}
              onClick={() => {
                navigate("/browse");
              }}>
              Browse Movies
            </button>
          )}
        </Section>
      </div>
    </>
  );
};

export default LandingPage;
