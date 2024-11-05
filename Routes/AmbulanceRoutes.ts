import express from "express";
import { trycatch } from "../Utils/TryCatch";
import {
  ambulanceDelete,
  getAmbulaces,
  getanAmbulace,
  login,
  Registeration,
  updateData,
} from "../Controllers/AmbulanceSide/AmbulaceForm";
const AmbulanceRoutes = express.Router();

AmbulanceRoutes.post("/ambulance/register", trycatch(Registeration));
AmbulanceRoutes.post("/ambulance/login", trycatch(login));
AmbulanceRoutes.get("/ambulance", trycatch(getanAmbulace));
AmbulanceRoutes.get("/ambulances", trycatch(getAmbulaces));
AmbulanceRoutes.put("/ambulance/:id", trycatch(updateData));
AmbulanceRoutes.delete("/ambulance/:id", trycatch(ambulanceDelete));

export default AmbulanceRoutes;
