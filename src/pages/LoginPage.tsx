import Section from "../components/Section";
import { j } from "../utils";
import styles from "../styles/landing-page.module.scss";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className={j(styles["image-wrapper"], styles["image-section"])}></div>
        <Section className={styles["intro-section"]}>
          <LoginForm />
        </Section>
      
    </>
  );
};

export default LoginPage;
