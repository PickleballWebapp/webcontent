import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Amplify } from "aws-amplify";
import config from "./aws-exports";
import "rsuite/dist/rsuite.min.css";
import "@aws-amplify/ui-react/styles.css";
import { BrowserRouter } from "react-router-dom";

Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
