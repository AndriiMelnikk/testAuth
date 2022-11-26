import React from "react";
import { useAuthState } from "./auth-context";

function Dashboard() {
  const { user } = useAuthState();
  const { id, name, job, place } = user;

  return (
    <div>
      <h3>Dashboard</h3>
      <ul>
        User
        <hr />
        <li>ID: {id}</li>
        <li>Name: {name}</li>
        <li>Job: {job}</li>
        <li>From: {place}</li>
      </ul>
    </div>
  );
}

export default Dashboard;
