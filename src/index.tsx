import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.scss";
import App from "./App";
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  // </React.StrictMode>
);
