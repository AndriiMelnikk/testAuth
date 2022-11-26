import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Landing from "./Landing";
import Login from "./Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import Spinner from "./Spinner";
import history from "./history";

function Routes() {
  return (
    <Router history={history}>
      <Navbar />
      <Spinner />
      <div className="layout">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;
