import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import "./index.css";
import { ContextProvider } from "./Context";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// yml build commands:
// - "# Execute Amplify CLI with the helper script"
// - chmod u+x ./myamplifypush.sh
// - ./myamplifypush.sh

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Router>
        <App />
      </Router>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
