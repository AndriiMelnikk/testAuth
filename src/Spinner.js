import React from "react";
import { useAuthState } from "./auth-context";
import "./spinner.css";

function Spinner() {
  const { status } = useAuthState();

  if (status === "pending") {
    return (
      <div className="spinner-wrapper">
        <div className="spinner">
          <div className="dot1" />
          <div className="dot2" />
        </div>
      </div>
    );
  }

  return null;
}

export default Spinner;
