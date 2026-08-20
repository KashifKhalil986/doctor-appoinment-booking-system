import React from "react";
import "./App.css";
import Login from "./pages/Login";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <>
      <div className="bg-[#F8F9FD]">
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
        </div>
      </div>
    </>
  ) : (
    <>
      <Login />
    </>
  );
};

export default App;
