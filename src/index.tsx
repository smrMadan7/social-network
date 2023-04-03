import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserContextProvider } from "./context/UserContextProvider";
import { FeedsContextProvider } from "./context/FeedsContextProvider";
import { SocketContextProvider } from "./context/SocketCotextProvider";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
     <FeedsContextProvider>
    <UserContextProvider>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
    </UserContextProvider>
  </FeedsContextProvider>

);
reportWebVitals();
