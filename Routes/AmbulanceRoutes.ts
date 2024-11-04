import express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
    getanAmbulace,
  login,
  Registeration,
} from "../Controllers/AmbulanceSide/AmbulaceForm";
const AmbulanceRoutes = express.Router();

AmbulanceRoutes.post("/ambulance/register", trycatch(Registeration));
AmbulanceRoutes.post("/ambulance/login", trycatch(login));
AmbulanceRoutes.get("/ambulance", trycatch(getanAmbulace));

export default AmbulanceRoutes;
