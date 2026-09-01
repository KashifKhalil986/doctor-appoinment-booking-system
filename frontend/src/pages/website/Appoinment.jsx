import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import RelatedDoctors from "../../components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, BackendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDoc = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let slotDateObj = new Date(currentDate);
      slotDateObj.setHours(10, 0, 0, 0); // Start of slots
      let endTime = new Date(currentDate);
      endTime.setHours(20, 30, 0, 0); // End of slots at 8:30pm

      // If it's today, start after current time rounded up to next slot
      if (i === 0) {
        const now = new Date();
        const bookingStartTime = new Date(currentDate);
        bookingStartTime.setHours(10, 0, 0, 0); // 10:00 AM

        const nextSlot = new Date(now);
        nextSlot.setMinutes(now.getMinutes() > 30 ? 0 : 30);
        nextSlot.setHours(
          now.getMinutes() > 30 ? now.getHours() + 1 : now.getHours(),
        );
        nextSlot.setSeconds(0, 0);

        // Use the later of now-rounded-up or 4 PM
        const startFrom =
          nextSlot > bookingStartTime ? nextSlot : bookingStartTime;

        if (startFrom > endTime) continue; // skip today if no valid slot left
        slotDateObj = new Date(startFrom); // start from next available slot
      }

      let timeSlots = [];

      while (slotDateObj <= endTime) {
        let formattedTime = slotDateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let slotDay = slotDateObj.getDate();
        let slotMonth = slotDateObj.getMonth() + 1;
        let slotYear = slotDateObj.getFullYear();
        const slotDateKey = slotDay + "_" + slotMonth + "_" + slotYear;

        const isSlotBooked =
          docInfo?.slots_booked?.[slotDateKey]?.includes(formattedTime);

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(slotDateObj),
            time: formattedTime,
          });
        }

        slotDateObj.setMinutes(slotDateObj.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        setDocSlots((prev) => [...prev, timeSlots]);
      }
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1; // Months are zero-based
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        BackendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully");
        getDoctorsData(); // Refresh doctors data
        navigate("/my-appointments");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    if (docInfo && !docInfo.availability) {
      toast.info(
        `${docInfo.name} is currently unavailable. You may book an appointment with one of our other top-rated doctors.`,
        {
          autoClose: 10000,
          draggable: true,
        },
      );
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={docInfo.availability ? "" : "opacity-50"}>
            <img
              className="bg-[#5f6FFF]  w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* ---------- Doctor Details ---------- */}
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
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
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 mx-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ---------- Booking slots ---------- */}
        {docInfo.availability ? (
          <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
            <p>Booking slots</p>
            <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
              {docSlots.length &&
                docSlots.map((item, index) => (
                  <div
                    onClick={() => setSlotIndex(index)}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                      slotIndex === index
                        ? "bg-[#5f6FFF] text-white"
                        : "border border-gray-200"
                    }`}
                    key={index}
                  >
                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
              {docSlots.length &&
                docSlots[slotIndex].map((item, index) => (
                  <p
                    onClick={() => setSlotTime(item.time)}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                      item.time === slotTime
                        ? "bg-[#5f6FFF] text-white"
                        : "text-gray-400 border border-gray-300"
                    }`}
                    key={index}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))}
            </div>
            <button
              onClick={bookAppointment}
              className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer"
            >
              Book an appointment
            </button>
          </div>
        ) : (
          <div className="mt-10 flex items-center gap-2 text-sm text-center">
            <p className="w-2 h-2 rounded-full bg-gray-500"></p>
            <p className="text-gray-500 font-semibold">
              {docInfo.name} is currently unavailable. You may book an
              appointment with one of our other top-rated doctors.
            </p>
          </div>
        )}

        {/* Related Doctors section */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
