import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "./auth-context";

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuthState();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
