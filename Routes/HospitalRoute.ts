import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
  addSpecialty,
  deleteSpecialty,
  getHospitalDetails,
  HospitalLogin,
  HospitalRegistration,
  resetPassword,
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

export default hospitalRoutes;
