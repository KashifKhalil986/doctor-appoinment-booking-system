import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "Rs ";
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const value = {
    doctors,
    currencySymbol,
  };
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(BackendUrl + "/api/doctor/list");
      setDoctors(data.doctors);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
