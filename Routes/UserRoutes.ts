import express from "express";
import {
  getHospitals,
  postReview,
  resetPassword,
  userData,
  userLogin,
  userLogout,
  userRegister,
} from "../Controllers/UserSide/UserForm";
import { trycatch } from "../Utils/TryCatch";

const userRoutes = express.Router();

userRoutes.post("/users/registeration", trycatch(userRegister));
userRoutes.post("/users/login", trycatch(userLogin));
userRoutes.post("/users/password", trycatch(resetPassword));
userRoutes.post("/users/logout", trycatch(userLogout));
userRoutes.get("/users", trycatch(userData));
userRoutes.get("/hospitals", trycatch(getHospitals));
userRoutes.post("/reviews/:id", trycatch(postReview));

export default userRoutes;
