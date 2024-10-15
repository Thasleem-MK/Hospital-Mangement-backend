import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
  getHospitalDetails,
  HospitalLogin,
  HospitalRegistration,
  resetPassword,
  updateHospitalDetails,
} from "../Controllers/HospitalSide/HospitalForm";

const hospitalRoutes = Express.Router();

hospitalRoutes.post("/hospital/registration", trycatch(HospitalRegistration));
hospitalRoutes.post("/hospital/login", trycatch(HospitalLogin));
hospitalRoutes.post("/hospital/password", trycatch(resetPassword));
hospitalRoutes.get("/hospital/details", trycatch(getHospitalDetails));
hospitalRoutes.put("/hospital/details/:id", trycatch(updateHospitalDetails));

export default hospitalRoutes;
