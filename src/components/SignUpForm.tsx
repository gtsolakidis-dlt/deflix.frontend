import { FC, FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/sign-up-form.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { endpoints } from "../lib/endpoints";
import { useBaseUrl } from "../contexts/BaseUrlContext";
import { MICROSERVICE_API } from "../lib/constants";
import { SignUpResponse } from "../types";

const SignUpForm = () => {
  const { username, setUsername } = useAuth();
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const BASE_URL = baseUrl[MICROSERVICE_API.USERS] || baseUrl["monolithic"];

    try {
      const response = await fetch(`${BASE_URL}${endpoints.users.signUp()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Register failed");
      }

      const data: SignUpResponse = await response.json();
      // Handle successful signup
      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
      console.error("Error signing up:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["background-panel"]}>
      <form action="#" className={styles["form"]} onSubmit={handleSignUp}>
        <input
          id="username-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />
        <input
          id="password-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <input
          id="email-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && <div className={styles["error"]}>{error}</div>}
        <div className={styles["text"]}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
