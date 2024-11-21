import express from "express";
import {
  deleteReview,
  editReview,
  getHospitals,
  postReview,
  resetPassword,
  userData,
  userLogin,
  userRegister,
} from "../Controllers/UserSide/UserForm";
import { trycatch } from "../Utils/TryCatch";
import Auth from "../Middlewares/Authenticator";

const userRoutes = express.Router();

userRoutes.post("/users/registeration", trycatch(userRegister));
userRoutes.post("/users/login", trycatch(userLogin));
userRoutes.post("/users/password", Auth, trycatch(resetPassword));
userRoutes.get("/users", Auth, trycatch(userData));
userRoutes.get("/hospitals", trycatch(getHospitals));
userRoutes.post("/reviews/:id", Auth, trycatch(postReview));
userRoutes.put("/reviews/:hospital_id/:reviewId", Auth, trycatch(editReview));
userRoutes.delete(
  "/reviews/:hospital_id/:reviewId",
  Auth,
  trycatch(deleteReview)
);

export default userRoutes;
