import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthState, useAuthDispatch, doLogout } from "./auth-context";

function CustomLink({ item, action, ...rest }) {
  let customLi = (
    <li className="nav-item">
      <span onClick={action}>{item}</span>
    </li>
  );

  if (action) {
    return customLi;
  }

  return (
    <NavLink
      activeStyle={{
        borderBottom: "2px solid black"
      }}
      {...rest}
    >
      {customLi}
    </NavLink>
  );
}

function Navbar() {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  let loginButton;
  let userMessage;

  if (!user) {
    loginButton = <CustomLink to="/login" item="Login" />;
  } else {
    loginButton = (
      <CustomLink action={() => doLogout(dispatch)} item="Logout" />
    );

    userMessage = (
      <span style={{ marginLeft: "50px" }}>Welcome {user.name}</span>
    );
  }

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <CustomLink to="/" exact item="Home" />
        {loginButton}
        <CustomLink to="/dashboard" item="Dashboard" />
      </ul>
      {userMessage}
    </nav>
  );
}

export default Navbar;
