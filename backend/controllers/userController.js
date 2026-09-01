import bcrypt from "bcryptjs";
import validator from "validator";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      success: true,
      message: "User register successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({
      success: true,
      message: "User login successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("User ID:", req.userId);

    const userData = await userModel.findById(req.userId).select("-password");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      userData,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, image, phone, address, gender, dob } = req.body;

    if (!name || !image || !phone || !gender || !dob) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        {
          name,
          image,
          phone,
          address,
          gender,
          dob,
        },
        { new: true },
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const bookAppointment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.availability) {
      return res.status(404).json({
        success: false,
        message: "Doctor not available. Please choose another doctor.",
      });
    }

    let slots_booked = docData.slots_booked;

    // check slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({
          success: false,
          message: "This slot is already booked.",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({
      success: true,
      message: "Appointment booked successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all appointments of a user
export const listAppointment = async (req, res) => {
  try {
    const { userId } = req.user;
    const appointments = await appointmentModel.find({ userId });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// API to cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this appointment.",
      });
    }

    // cancel appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId).select("-password");
    if (doctorData) {
      let slots_booked = doctorData.slots_booked;
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (time) => time !== slotTime,
        );

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// API to make payment of an appointment
export const makePayment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment cancelled.",
      });
    }

    if (appointmentData.payment) {
      return res.status(400).json({
        success: false,
        message: "Payment already completed.",
      });
    }

    // verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to make payment for this appointment.",
      });
    }

    // Mark appointment as paid
    appointmentData.payment = true;
    await appointmentData.save();

    res.status(200).json({
      success: true,
      message: "Payment successful.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
