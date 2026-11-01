import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AppErrorBoundary from "./components/common/AppErrorBoundary";
import "./styles/base.css";
import "./styles/features.css";
import "./styles/dashboard.css";
import "./styles/typography.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>,
);
