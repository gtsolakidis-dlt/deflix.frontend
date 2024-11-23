import styles from "../styles/settings-page.module.scss";
import { j } from "../utils";
import { MICROSERVICE_API } from "../lib/constants";
import { CheckCircle, SaveFloppyDisk } from "iconoir-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUsersAPI } from "../lib/useUsersAPI";
import { endpoints } from "../lib/endpoints";
import { useBaseUrl } from "../contexts/BaseUrlContext";
import { useSubscriptionsAPI } from "../lib/useSubscriptionsAPI";

type Credentials = {
  username: string;
  password: string;
  email: string;
};

type Errors = {
  password: string;
};

const SettingsPage = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const { setIsLoggedIn, setUsername, setUserId, userId } = useAuth();
  const { getProfile } = useUsersAPI();
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = getProfile(userId);

  const [localProfile, setLocalProfile] = useState(profile);

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  const {
    data: subscriptions,
    isLoading: isSubscriptionsLoading,
    error: subscriptionsError,
  } = useSubscriptionsAPI().list();

  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (profile && !isProfileLoading) {
      setCredentials((prev) => ({
        ...prev,
        username: profile.username || "",
        email: profile.email || "",
        password: "",
      }));
    }
  }, [profile, isProfileLoading]);

  useEffect(() => {
    setIsFormValid(credentials.password.trim().length > 0);
  }, [credentials.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      password: value,
    }));

    if (value.trim()) {
      setErrors({ password: "" });
    }
  };

  const updateProfile = async (password: string): Promise<void> => {
    try {
      const response = await fetch(
        `${
          baseUrl[MICROSERVICE_API.USERS] || baseUrl["monolithic"]
        }${endpoints.users.updateProfile(userId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  const handleSave = async () => {
    if (!credentials.password.trim()) {
      setErrors({ password: "Please enter a new password" });
      return;
    }

    setIsUpdating(true);
    setUpdateMessage("");

    try {
      await updateProfile(credentials.password);
      setUpdateMessage("Password updated successfully!");
      setCredentials((prev) => ({ ...prev, password: "" }));
      setIsFormValid(false);
    } catch (error) {
      setErrors({
        password:
          error instanceof Error
            ? error.message
            : "Failed to update password. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const setSubscription = async (subId: number): Promise<void> => {
    try {
      const response = await fetch(
        `${
          baseUrl[MICROSERVICE_API.SUBSCRIPTIONS] || baseUrl["monolithic"]
        }${endpoints.subscriptions.subscribe(userId, subId)}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to select subscription"
      );
    }
  };

  const setNewSub = async (subId: number) => {
    try {
      await setSubscription(subId);

      setLocalProfile((prev) => ({
        ...prev,
        subscriptionType:
          subscriptions.find((sub) => sub.id === subId)?.name ||
          prev.subscriptionType,
      }));
    } catch (error) {
      console.error("Failed to update subscription:", error);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Settings</h1>
      <div className={styles["settings-section"]}>
        <button
          className={styles["logout-btn"]}
          onClick={() => {
            setIsLoggedIn(false);
            setUsername("");
            setUserId("");
          }}>
          Logout
        </button>
        <h2>Edit Profile</h2>
        <div className={styles["credentials-form-wrapper"]}>
          <form className={styles["credentials-form"]}>
            <div className={styles["credentials-form-elem"]}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                disabled
              />
            </div>
            <div className={styles["credentials-form-elem"]}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="New password"
              />
            </div>
            <div className={styles["credentials-form-elem"]}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                disabled
              />
            </div>
            <button
              className={`${styles["btn"]} ${styles["save-form"]}`}
              type="button"
              onClick={handleSave}
              disabled={!isFormValid || isUpdating}>
              {isUpdating ? (
                "Saving..."
              ) : (
                <>
                  Save <SaveFloppyDisk />
                </>
              )}
            </button>
            {errors.password && (
              <span className={styles["error-message"]}>{errors.password}</span>
            )}
            {updateMessage && (
              <span className={styles["success-message"]}>{updateMessage}</span>
            )}
          </form>
        </div>
      </div>
      <div className={styles["settings-section"]}>
        <h2>Choose Plan</h2>
        <div className={styles["billing"]}>
          {subscriptions?.map((subscription) => (
            <div className={styles["container"]} key={subscription.id}>
              <div className={styles["wrapper"]}>
                <h1>{subscription.name}</h1>
                <p className={styles["description"]}>
                  {subscription.description}
                  <br />${subscription.price.toFixed(2)}/month
                </p>
              </div>
              <div className={styles["button-wrapper"]}>
                {subscription.name === localProfile?.subscriptionType ? (
                  <button className={styles["checked"]}>
                    <CheckCircle />
                  </button>
                ) : (
                  <button
                    onClick={() => setNewSub(subscription.id)}
                    className={j(styles["btn"], styles["to-selected"])}>
                    Select {subscription.name} Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
