import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h3>Landing Page</h3>
      <hr />
      <div>
        If you try to go to{" "}
        <Link to="/dashboard" className="simple-link">
          Dashboard
        </Link>{" "}
        without logging in, it redirects you to{" "}
        <Link className="simple-link" to="/login">
          Login
        </Link>{" "}
        page.
      </div>
      What is used? React and React Router. That is it :)
      <br />
      <br />
      <div>
        PS: There is a Zustand version of this{" "}
        <a
          href="https://codesandbox.io/s/0zb36"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </div>
    </div>
  );
}

export default Landing;
