import "./App.css";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppoinment from "./pages/Admin/AllAppoinment";
import DoctorList from "./pages/Admin/DoctorList";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <>
      <div className="bg-[#F8F9FD]">
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/add-doctor" element={<AddDoctor />} />
            <Route path="/admin/all-appointments" element={<AllAppoinment />} />
            <Route path="/admin/doctors-list" element={<DoctorList />} />
          </Routes>
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
