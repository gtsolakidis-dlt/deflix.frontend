import React, { useState } from "react";
import { useBaseUrl } from "../contexts/BaseUrlContext";
import styles from "../styles/configuration.module.scss";
import { EyeAlt, EyeClose } from "iconoir-react";
import { MICROSERVICE_API } from "../lib/constants";

type BaseUrls = {
  monolithic: string;
} & {
  [key in MICROSERVICE_API]: string;
};

const Configuration = () => {
  const { baseUrl, setBaseUrl } = useBaseUrl();
  const [urls, setUrls] = useState(baseUrl);
  const [isVisible, setIsVisible] = useState(true);

  const apiNames: (keyof BaseUrls)[] = [
    "monolithic",
    ...Object.values(MICROSERVICE_API),
  ];

  const handleSave = () => {
    setBaseUrl(editLastCharOfUserEntries(urls));
    // setBaseUrl(urls);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const editLastCharOfUserEntries = (data: BaseUrls) =>
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value && !value.endsWith("/") ? value + "/" : value,
      ])
    );

  return (
    <div
      className={`${styles.configuration} ${
        isVisible ? styles.visible : styles.hidden
      }`}>
      {isVisible ? (
        <>
          <div className={styles["url-inputs"]}>
            {apiNames.map((api) => (
              <label key={api}>
                {api.charAt(0).toUpperCase() + api.slice(1)}:
                <input
                  type="text"
                  value={urls[api]}
                  onChange={(e) => setUrls({ ...urls, [api]: e.target.value })}
                  placeholder={`http://${
                    api.charAt(0).toUpperCase() + api.slice(1)
                  }API:port`}
                />
              </label>
            ))}
          </div>
          {/* <div className={styles["btn-group"]}> */}
          <button className={styles["btn-save"]} onClick={handleSave}>
            Save URLs
          </button>
          <button onClick={toggleVisibility} className={styles["btn-action"]}>
            <EyeAlt />
          </button>
          {/* </div> */}
        </>
      ) : (
        <button onClick={toggleVisibility} className={styles["btn-action"]}>
          <EyeClose />
        </button>
      )}
    </div>
  );
};

export default Configuration;
