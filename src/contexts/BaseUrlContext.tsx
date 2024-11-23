// src/contexts/BaseUrlContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { BaseUrls } from "../types";

// Define context type with the new structure for multiple base URLs
interface BaseUrlContextType {
  baseUrl: BaseUrls;
  setBaseUrl: (urls: Partial<BaseUrls>) => void;
}

// Create context
const BaseUrlContext = createContext<BaseUrlContextType | undefined>(undefined);

// Hook to use the context
export const useBaseUrl = () => {
  const context = useContext(BaseUrlContext);
  if (!context) {
    throw new Error("useBaseUrl must be used within a BaseUrlProvider");
  }
  return context;
};

// Define the key for local storage
const LOCAL_STORAGE_KEY = "apiBaseUrls";

// Provider component
export const BaseUrlProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with values from local storage if available
  const [baseUrl, setBaseUrlState] = useState<BaseUrls>(() => {
    const savedUrls = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedUrls
      ? JSON.parse(savedUrls)
      : {
          users: "",
          preferences: "",
          movies: "",
          recommendations: "",
          subscriptions: "",
        };
  });

  // Update local storage whenever base URLs change
  const setBaseUrl = (updatedUrls: Partial<BaseUrls>) => {
    setBaseUrlState((prevUrls) => {
      const newUrls = { ...prevUrls, ...updatedUrls };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUrls));
      return newUrls;
    });
  };

  return (
    <BaseUrlContext.Provider value={{ baseUrl, setBaseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};
