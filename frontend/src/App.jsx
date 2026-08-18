import { Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./pages/website/About";
import Home from "./pages/website/home";
import Navbar from "./components/Navbar";
import Login from "./pages/website/Login";
import MyAppoinment from "./pages/website/MyAppoinment";
import MyProfile from "./pages/website/MyProfile";
import Appoinment from "./pages/website/Appoinment";
import Doctor from "./pages/website/Doctor";
import Footer from "./components/Footer";
import Contact from "./pages/website/Contact";

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-appoinment" element={<MyAppoinment />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/appoinment/:docId" element={<Appoinment />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
