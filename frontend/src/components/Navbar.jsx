import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, SetShowMenu] = useState(false);
  const { setToken, token } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="h-12 cursor-pointer"
      />

      <div className="hidden md:flex items-start font-medium gap-5">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-[#5f6FFF]" : "text-gray-800"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            isActive ? "text-[#5f6FFF]" : "text-gray-800"
          }
        >
          All Doctors
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-[#5f6FFF]" : "text-gray-800"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "text-[#5f6FFF]" : "text-gray-800"
          }
        >
          Contact
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        {token ? (
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />

            <div
              className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${
                showDropdown ? "block" : "hidden"
              }`}
            >
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => {
                    navigate("/my-profile");
                    setShowDropdown(false);
                  }}
                >
                  My Profile
                </p>

                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => {
                    navigate("/my-appoinment");
                    setShowDropdown(false);
                  }}
                >
                  My Appoinment
                </p>

                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => {
                    setToken(false);
                    setShowDropdown(false);
                  }}
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light"
          >
            Create account
          </button>
        )}

        <img
          className="w-6 md:hidden cursor-pointer"
          onClick={() => SetShowMenu(true)}
          src={assets.menu_icon}
          alt=""
        />

        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="" className="w-36" />
            <img
              src={assets.cross_icon}
              alt=""
              className="w-7 cursor-pointer"
              onClick={() => SetShowMenu(false)}
            />
          </div>

          <ul className="flex flex-col items-center gap-2 mt-5 text-lg font-medium">
            <NavLink
              to="/"
              onClick={() => SetShowMenu(false)}
              className={({ isActive }) =>
                isActive
                  ? "bg-[#5f6FFF] text-white px-4 py-2 rounded inline-block"
                  : "px-4 py-2 rounded inline-block"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/doctors"
              onClick={() => SetShowMenu(false)}
              className={({ isActive }) =>
                isActive
                  ? "bg-[#5f6FFF] text-white px-4 py-2 rounded inline-block"
                  : "px-4 py-2 rounded inline-block"
              }
            >
              ALL Doctors
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => SetShowMenu(false)}
              className={({ isActive }) =>
                isActive
                  ? "bg-[#5f6FFF] text-white px-4 py-2 rounded inline-block"
                  : "px-4 py-2 rounded inline-block"
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => SetShowMenu(false)}
              className={({ isActive }) =>
                isActive
                  ? "bg-[#5f6FFF] text-white px-4 py-2 rounded inline-block"
                  : "px-4 py-2 rounded inline-block"
              }
            >
              Contact
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
