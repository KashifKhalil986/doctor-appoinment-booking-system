import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Doctor = () => {
  console.log("doctor component render");
  const { doctors } = useContext(AppContext);
  const { speciality } = useParams();
  console.log("speciality", speciality);
  console.log(
    "doc speciality",
    doctors?.map((d) => d.speciality),
  );
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (doc) =>
            doc.speciality.replace(/\s+/g, "-").toLowerCase() ===
            speciality.toLowerCase(),
        ),
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <>
      <div className="">
        <p className="text-gray-600">Browse through the doctors specialist</p>
        <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "text-white bg-[#5f6FFF]" : ""}`}
          >
            Filters
          </button>
          <div
            className={`${showFilter ? "flex" : "hidden sm:flex"} flex-col  gap-4 text-sm text-gray-600`}
          >
            <p
              onClick={() =>
                speciality === "general-physician"
                  ? navigate("/doctors")
                  : navigate("/doctors/general-physician")
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "general-physician" ? "bg-indigo-100 text-black" : ""}`}
            >
              General physician
            </p>
            <p
              onClick={() =>
                speciality === "Gynecologist"
                  ? navigate("/doctors")
                  : navigate("/doctors/Gynecologist")
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}
            >
              Gynecologist
            </p>
            <p
              onClick={() =>
                speciality === "Dermatologist"
                  ? navigate("/doctors")
                  : navigate("/doctors/Dermatologist")
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}
            >
              Dermatologist
            </p>
            <p
              onClick={() =>
                speciality === "Pediatricians"
                  ? navigate("/doctors")
                  : navigate("/doctors/Pediatricians")
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}
            >
              Pediatricians
            </p>
            <p
              onClick={() =>
                speciality === "Neurologist"
                  ? navigate("/doctors")
                  : navigate("/doctors/Neurologist")
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}
            >
              Neurologist
            </p>
            <p
              onClick={() =>
                speciality === "Gastroenterologist"
                  ? navigate("/doctors")
                  : navigate("/doctors/Gastroenterologist")
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}
            >
              Gastroenterologist
            </p>
          </div>

          <div className="w-full grid  grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6  ">
            {filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appoinment/${item._id}`)}
                key={index}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              >
                <img className="bg-blue-50" src={item.image} alt="" />
                <div className="p-2">
                  <div className="flex items-center gap-2 text-center text-sm text-green-500">
                    <p className="w-2 h-2  rounded-full bg-green-500"></p>
                    <p className="">Available</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium ">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Doctor;
