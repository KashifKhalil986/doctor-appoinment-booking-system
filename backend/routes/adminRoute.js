import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
} from "../controllers/adminController.js";
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, addDoctor);
adminRouter.post("/admin-login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
export default adminRouter;