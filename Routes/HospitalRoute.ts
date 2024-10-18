import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
  addDoctor,
  addSpecialty,
  deleteDoctor,
  deleteSpecialty,
  getHospitalDetails,
  HospitalLogin,
  HospitalRegistration,
  resetPassword,
  updateDoctor,
  updateHospitalDetails,
  updateSpecialty,
} from "../Controllers/HospitalSide/HospitalForm";
import { uploadImage } from "../Middlewares/Multer";

const hospitalRoutes = Express.Router();

hospitalRoutes.post("/hospital/registration", trycatch(HospitalRegistration));
hospitalRoutes.post("/hospital/login", trycatch(HospitalLogin));
hospitalRoutes.post("/hospital/password", trycatch(resetPassword));
hospitalRoutes.get("/hospital/details", trycatch(getHospitalDetails));
hospitalRoutes.put("/hospital/details/:id", trycatch(updateHospitalDetails));
hospitalRoutes.post("/hospital/specialty/:id", trycatch(addSpecialty));
hospitalRoutes.put("/hospital/specialty/:id", trycatch(updateSpecialty));
hospitalRoutes.delete("/hospital/specialty/:id", trycatch(deleteSpecialty));
hospitalRoutes.post("/hospital/profileImage/:id", trycatch(uploadImage));
hospitalRoutes.post("/hospital/doctor/:id", trycatch(addDoctor));
hospitalRoutes.put("/hospital/doctor/:id", trycatch(updateDoctor));
hospitalRoutes.delete(
  "/hospital/doctor/:hospital_id/:doctor_id",
  trycatch(deleteDoctor)
);

export default hospitalRoutes;
