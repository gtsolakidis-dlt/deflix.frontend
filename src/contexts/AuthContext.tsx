import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  username: string;
  userId: string;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
  });

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem("userId") || "";
  });

  // Save `isLoggedIn` and `username` to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
  }, [isLoggedIn, username, userId]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userId,
        setIsLoggedIn,
        setUsername,
        setUserId,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
