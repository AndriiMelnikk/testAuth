import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import { AuthProvider } from "./auth-context";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
