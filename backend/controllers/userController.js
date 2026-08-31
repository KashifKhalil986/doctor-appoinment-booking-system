import bcrypt from "bcryptjs";
import validator from "validator";
import userModel from "../models/userModel";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
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
    return res
      .status(200)
      .json({ success: true, message: "User register", token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User does not exist" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ success: true, message: "User login successfuly", token });
  } else {
    return res.json({ success: false, message: "Invalid Credentials" });
  }
};
