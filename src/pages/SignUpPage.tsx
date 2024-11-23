import Section from "../components/Section";
import { j } from "../utils";
import styles from "../styles/landing-page.module.scss";
import SignUpForm from "../components/SignUpForm";

const SignUpPage = () => {
  return (
    <>
      <div
        className={j(styles["image-wrapper"], styles["image-section"])}></div>
      <Section className={styles["intro-section"]}>
        <SignUpForm />
      </Section>
    </>
  );
};

export default SignUpPage;
