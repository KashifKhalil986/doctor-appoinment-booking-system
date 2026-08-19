import React from "react";
import "./App.css";
import Login from "./pages/Login";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <>
      <h1>Admin Dashboard</h1>
    </>
  ) : (
    <>
      <Login />
    </>
  );
};

export default App;
