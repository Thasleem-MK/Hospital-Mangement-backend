import express from "express";
import {
  userData,
  userLogin,
  userRegister,
} from "../Controllers/UserSide/UserForm";
import { trycatch } from "../Utils/TryCatch";

const userRoutes = express.Router();

userRoutes.post("/users/registeration", trycatch(userRegister));
userRoutes.post("/users/login", trycatch(userLogin));
userRoutes.get("/users", trycatch(userData));

export default userRoutes;
