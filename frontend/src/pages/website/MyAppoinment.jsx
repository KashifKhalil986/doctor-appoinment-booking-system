import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModel";

const MyAppoinment = () => {
  const { BackendUrl, token, getDoctorsData, currencySymbol } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [modalContext, setModalContext] = useState(null);

  const formatDateString = (dateStr) => {
    const [day, month, year] = dateStr.split("_");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(BackendUrl + "/api/user/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments",
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        BackendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Appointment cancelled successfully");
        getUserAppointments();
        getDoctorsData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  const makePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        BackendUrl + "/api/user/make-payment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Payment successful");
        getUserAppointments();
        setModalContext(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to make payment");
    }
  };

  const handlePayClick = (appointmentId) => {
    setModalContext({ type: "payment", appointmentId });
  };

  const handleCancelClick = (appointmentId) => {
    setModalContext({ type: "cancel", appointmentId });
  };

  const getSelectedAppointment = () => {
    if (!modalContext) return null;
    return appointments.find((a) => a._id === modalContext.appointmentId);
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((doc, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50 rounded"
                src={doc.docData.image}
                alt=""
              />
            </div>
            <div className="md:flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {doc.docData.name}
              </p>
              <p>{doc.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{doc.docData.address.line1}</p>
              <p className="text-xs">{doc.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {formatDateString(doc.slotDate)} | {doc.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!doc.payment && !doc.cancelled && !doc.isCompleted && (
                <button
                  onClick={() => handlePayClick(doc._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}

              {doc.payment && !doc.cancelled && !doc.isCompleted && (
                <button className="text-sm text-white bg-green-500 text-center sm:min-w-48 py-2 border border-green-500 rounded">
                  Payment Completed
                </button>
              )}

              {!doc.cancelled && !doc.isCompleted && (
                <button
                  onClick={() => handleCancelClick(doc._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}

              {doc.cancelled && !doc.isCompleted && (
                <button className="text-sm text-red-500 text-center sm:min-w-48 py-2 border border-red-500 rounded">
                  Appointment Cancelled
                </button>
              )}

              {doc.isCompleted && (
                <button className="text-sm text-green-500 text-center sm:min-w-48 py-2 border border-green-500 rounded">
                  Appointment Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Global Confirmation Modal */}
      {modalContext && getSelectedAppointment() && (
        <ConfirmModal
          title={
            modalContext.type === "payment"
              ? "Confirm Payment"
              : "Cancel Appointment"
          }
          message={
            modalContext.type === "payment"
              ? `Do you want to proceed with the consultation fee of ${currencySymbol}${
                  getSelectedAppointment().docData.fees
                }?`
              : "Are you sure you want to cancel this appointment?"
          }
          confirmText={
            modalContext.type === "payment" ? "Make Payment" : "Yes, Cancel"
          }
          cancelText={modalContext.type === "payment" ? "Cancel" : "No"}
          onConfirm={() => {
            modalContext.type === "payment"
              ? makePayment(modalContext.appointmentId)
              : cancelAppointment(modalContext.appointmentId);
            setModalContext(null);
          }}
          onCancel={() => setModalContext(null)}
        />
      )}
    </div>
  );
};

export default MyAppoinment;