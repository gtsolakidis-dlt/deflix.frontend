import { useRouteError } from "react-router-dom";
import Section from "../components/Section";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <>
      <Section>
          <h1>{(error as any).status}</h1>
          <p>{(error as any).statusText}</p>
          <p>{(error as any).message}</p>
        </Section>
    </>
  );
};

export default ErrorPage;
