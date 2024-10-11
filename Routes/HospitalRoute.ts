import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import { HospitalLogin, HospitalRegistration } from "../Controllers/HospitalSide/HospitalForm";

const hospitalRoutes = Express.Router();

hospitalRoutes.post("/hospital/registration", trycatch(HospitalRegistration));
hospitalRoutes.post("/hospital/login", trycatch(HospitalLogin));

export default hospitalRoutes;