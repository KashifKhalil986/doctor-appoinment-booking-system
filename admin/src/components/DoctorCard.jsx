import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const DoctorCard = ({ doctor }) => {
  //   const { changeAvailability } = useContext(AdminContext);
  return (
    <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group">
      <img
        className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
        src={doctor.image}
        alt={doctor.name}
      />
      <div className="p-4">
        <p className="text-neutral-800 text-lg font-medium">{doctor.name}</p>
        <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
        <div className="flex items-center mt-2 gap-1 text-sm">
          <input
            // onChange={() => changeAvailability(doctor._id)}
            type="checkbox"
            // checked={doctor.available}
          />
          <p>Available</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
