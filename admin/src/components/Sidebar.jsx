import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const adminNavLinks = [
  { to: "/admin/dashboard", icon: assets.home_icon, label: "Dashboard" },
  {
    to: "/admin/all-appointments",
    icon: assets.appointment_icon,
    label: "All Appointments",
  },
  { to: "/admin/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
  { to: "/admin/doctors-list", icon: assets.home_icon, label: "Doctor List" },
];

// const doctorNavLinks = [
//   { to: "/doctor/dashboard", icon: assets.home_icon, label: "Dashboard" },
//   {
//     to: "/doctor/appointments",
//     icon: assets.appointment_icon,
//     label: "My Appointments",
//   },
//   { to: "/doctor/profile", icon: assets.people_icon, label: "Profile" },
// ];

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <div className="min-h-screen bg-white border-r">
      {(aToken || dToken) && (
        <ul className="text-[#515151] mt-5">
          {(aToken ? adminNavLinks : adminNavLinks).map(
            ({ to, icon, label }) => (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-60 lg:min-w-72 cursor-pointer ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                  }`
                }
                key={to}
                to={to}
              >
                <img src={icon} alt={label} />
                <p className="hidden md:block">{label}</p>
              </NavLink>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
