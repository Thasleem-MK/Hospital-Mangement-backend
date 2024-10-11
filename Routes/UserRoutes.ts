import express from "express";
import {
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

export default userRoutes;
