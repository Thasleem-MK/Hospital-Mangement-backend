import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
  addDoctor,
  addSpecialty,
  deleteDoctor,
  deleteSpecialty,
  getHospitalDetails,
  hospitalDelete,
  HospitalLogin,
  HospitalRegistration,
  resetPassword,
  updateDoctor,
  updateHospitalDetails,
  updateSpecialty,
} from "../Controllers/HospitalSide/HospitalForm";
import { uploadImage } from "../Middlewares/Multer";
import Authenticator from "../Middlewares/Authenticator";

const hospitalRoutes = Express.Router();

hospitalRoutes.post("/hospital/registration", trycatch(HospitalRegistration));
hospitalRoutes.post("/hospital/login", trycatch(HospitalLogin));
hospitalRoutes.post(
  "/hospital/password",
  Authenticator,
  trycatch(resetPassword)
);
hospitalRoutes.get(
  "/hospital/details",
  Authenticator,
  trycatch(getHospitalDetails)
);
hospitalRoutes.put(
  "/hospital/details/:id",
  Authenticator,
  trycatch(updateHospitalDetails)
);
hospitalRoutes.post(
  "/hospital/specialty/:id",
  Authenticator,
  trycatch(addSpecialty)
);
hospitalRoutes.put(
  "/hospital/specialty/:id",
  Authenticator,
  trycatch(updateSpecialty)
);
hospitalRoutes.delete(
  "/hospital/specialty/:id",
  Authenticator,
  trycatch(deleteSpecialty)
);
hospitalRoutes.post(
  "/hospital/profileImage/:id",
  Authenticator,
  trycatch(uploadImage)
);
hospitalRoutes.post("/hospital/doctor/:id", Authenticator, trycatch(addDoctor));
hospitalRoutes.put(
  "/hospital/doctor/:id",
  Authenticator,
  trycatch(updateDoctor)
);
hospitalRoutes.delete(
  "/hospital/doctor/:hospital_id/:doctor_id",
  Authenticator,
  trycatch(deleteDoctor)
);
hospitalRoutes.delete("/hospital/:id", Authenticator, trycatch(hospitalDelete));

export default hospitalRoutes;
