import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import AppProviders from "components/AppProviders";

ReactDOM.render(
  <Router>
    <AppProviders>
      <App />
    </AppProviders>
  </Router>,
  document.getElementById("root")
);
