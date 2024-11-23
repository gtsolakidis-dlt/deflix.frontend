import React, { useState } from "react";
import styles from "../styles/movie-comment-form.module.scss";
import { endpoints } from "../lib/endpoints";
import { MICROSERVICE_API } from "../lib/constants";
import { useBaseUrl } from "../contexts/BaseUrlContext";

type MovieCommentFormProps = {
  userId: string;
  movieId: string;
};

const MovieCommentForm = ({ userId, movieId }: MovieCommentFormProps) => {
  const { baseUrl } = useBaseUrl();

  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    setIsLoading(true);
    setError(null);

    const BASE_URL =
      baseUrl[MICROSERVICE_API.PREFERENCES] || baseUrl["monolithic"];

    try {
      const response = await fetch(
        `${BASE_URL}${endpoints.userPreferences.comments.add(userId, movieId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: comment.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.statusText}`);
      }

      await response.json();
      setComment("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while posting comment"
      );
      console.error("Error posting comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["comment-area"]}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about this movie.."
        className="text-area"
        rows={2}
        cols={30}
      />
      <button onClick={handleSubmit} className={styles["btn-post"]}>
        Post Comment
      </button>
    </div>
  );
};

export default MovieCommentForm;
