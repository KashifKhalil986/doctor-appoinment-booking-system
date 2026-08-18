import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
const MyAppoinment = () => {
  const { doctors } = useContext(AppContext);
  return (
    <>
      <div className="">
        <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
          My Appoinment
        </p>
        <div className="">
          {doctors.slice(0, 3).map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div className="">
                <img className="w-32 bg-indigo-50" src={item.image} alt="" />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.name}</p>
                <p className="">{item.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.address.line1}</p>
                <p className="text-xs">{item.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time : 11, May ,2026{" "}
                  </span>
                </p>
              </div>
              <div className=""></div>
              <div className="flex flex-col gap-2 justify-end">
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-[#5f6FFF] transition-all duration-300">
                  Pay Online
                </button>
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-red-600 transition-all duration-300">
                  Cancel Appoinment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyAppoinment;
