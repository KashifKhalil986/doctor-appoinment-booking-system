import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import RelatedDoctor from "../../components/RelatedDoctor";

const Appoinment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  const getAvailableSlot = async () => {
    setDocSlot([]);

    //  getting current data
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting data with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      //  setting end time with index

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0);

      // setting hours

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlot = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeSlot.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlot((prev) => [...prev, timeSlot]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlot();
  }, [docInfo]);

  useEffect(() => {
    console.log("doc slot", docSlots);
  }, [docSlots]);

  console.log("doc info", docInfo);

  return (
    docInfo && (
      <>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="">
            <img
              className="w-full sm:max-w-72 rounded-lg bg-[#5f6FFF]"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-100 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900  ">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div className="">
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 ">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appoinment Fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}{" "}
              </span>
            </p>
          </div>
        </div>
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
          <p>Booking Slot</p>
          <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
            {docSlots?.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer border border-gray-200  ${slotIndex === index ? "bg-[#5f6FFF] text-white " : ""}`}
              >
                <p className="">
                  {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                </p>
                <p className="">{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar mt-4 ">
            {docSlots[slotIndex]?.map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-[#5f6FFF] text-white" : "text-gray-400 border border-gray-300"}`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book Appoinment
          </button>
        </div>

        {docInfo && (
          <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
        )}
      </>
    )
  );
};

export default Appoinment;
