import express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
  login,
  Registeration,
} from "../Controllers/AmbulanceSide/AmbulaceForm";
const AmbulanceRoutes = express.Router();

AmbulanceRoutes.post("/ambulance/register", trycatch(Registeration));
AmbulanceRoutes.post("/ambulance/login", trycatch(login));

export default AmbulanceRoutes;
