import React from "react";
import { Redirect } from "react-router-dom";
import { useAuthState, useAuthDispatch, doLogin } from "./auth-context";

function Login() {
  const { user: loggedUser, status, error } = useAuthState();
  const dispatch = useAuthDispatch();

  const [user, setUser] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (loggedUser) return <Redirect to="/dashboard" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin(dispatch, user);
    setUser("");
  };

  const handleChange = (e) => setUser(e.target.value);

  return (
    <div>
      <ul>
        <li>Usernames other than "foo" returns an error.</li>
        <li>Each request takes 2 seconds and fires a spinner.</li>
        <li>After successful login, page is redirected to "Dashboard"</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" />
          <input
            ref={inputRef}
            type="text"
            name="name"
            id="name"
            placeholder="Enter username"
            className="login-input"
            value={user}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <button className="login-button" type="submit">
            Login
          </button>
        </div>
      </form>
      {status === "rejected" && (
        <p style={{ color: "maroon", marginTop: "10px" }}>Error: {error}</p>
      )}
    </div>
  );
}

export default Login;
