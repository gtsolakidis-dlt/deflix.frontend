import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/login-form.module.scss";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "iconoir-react";
import { MICROSERVICE_API } from "../lib/constants";
import { endpoints } from "../lib/endpoints";
import { SignInResponse } from "../types";
import { useBaseUrl } from "../contexts/BaseUrlContext";
// import styles from "../styles/landing-page.module.scss";

const LoginForm = () => {
  const { isLoggedIn, username, setIsLoggedIn, setUsername, setUserId } =
    useAuth();
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  // setIsLoggedIn(true);
  // setUserId("123UserId456");
  // setUsername(username);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const BASE_URL = baseUrl[MICROSERVICE_API.USERS] || baseUrl["monolithic"];

    try {
      const response = await fetch(`${BASE_URL}${endpoints.users.signIn()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: SignInResponse = await response.json();
      setIsLoggedIn(true);
      setUserId(data.userId);
      setUsername(username);
      navigate(`/browse`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      console.error("Error login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["background-panel"]}>
      {!isLoggedIn ? (
        <form action="#" className={styles["form"]} onSubmit={handleLogin}>
          <input
            id="username-field"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            id="password-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login"}
          </button>
          {error && <div className={styles["error"]}>{error}</div>}
          <div className={styles["text"]}>
            Do not have an account?{" "}
            <span onClick={() => navigate("/signup")}>Register</span>
          </div>
        </form>
      ) : (
        <div className={styles["already-logged-in"]}>
          <CheckCircle />
          <p>
            You have already signin, {username}. Move to homepage to watch a
            movie.
          </p>
          <button onClick={() => navigate("/browse")}>Browse movies</button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
