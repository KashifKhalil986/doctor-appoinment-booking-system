import { createContext } from "react";
import { useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAtoken] = useState(localStorage.getItem("aToken") || "");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const value = { setAtoken, aToken, BackendUrl };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
