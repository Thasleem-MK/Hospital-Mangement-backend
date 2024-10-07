import express from "express";
import { userRegister } from "../Controllers/UserSide/UserForm";
import { trycatch } from "../Utils/TryCatch";

const userRoutes = express.Router();

userRoutes.post("/users/registeration", trycatch(userRegister));

export default userRoutes;